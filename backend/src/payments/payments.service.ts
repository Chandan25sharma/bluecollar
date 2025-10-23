import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PAYMENT_CONFIG, getRazorpayInstance } from './razorpay.config';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  private getRazorpay() {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      throw new BadRequestException('Payment service not configured');
    }
    return razorpay;
  }

  /**
   * Create Razorpay order for booking payment
   */
  async createOrder(createOrderDto: CreateOrderDto) {
    const { bookingId, amount, clientId, providerId, currency = 'INR' } = createOrderDto;

    // Validate amount
    if (amount < PAYMENT_CONFIG.minAmount || amount > PAYMENT_CONFIG.maxAmount) {
      throw new BadRequestException(
        `Amount must be between ₹${PAYMENT_CONFIG.minAmount} and ₹${PAYMENT_CONFIG.maxAmount}`
      );
    }

    // Check if booking exists and belongs to client
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        client: true,
        provider: true,
        service: true
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.client.userId !== clientId) {
      throw new BadRequestException('You can only pay for your own bookings');
    }

    if (booking.provider.id !== providerId) {
      throw new BadRequestException('Invalid provider for this booking');
    }

    // Check if payment already exists for this booking
    const existingPayment = await this.prisma.payment.findUnique({
      where: { bookingId }
    });

    if (existingPayment && existingPayment.status === 'PAID') {
      throw new BadRequestException('Payment already completed for this booking');
    }

    // Calculate commission and provider amount
    const commission = amount * PAYMENT_CONFIG.commissionRate;
    const providerAmount = amount * PAYMENT_CONFIG.providerRate;

    try {
      // Create Razorpay order
      const razorpay = this.getRazorpay();
      const razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `booking_${bookingId}_${Date.now()}`,
        notes: {
          bookingId,
          clientId,
          providerId,
          serviceTitle: booking.service.title
        }
      });

      // Create or update payment record
      const paymentData = {
        amount,
        currency,
        commission,
        providerAmount,
        status: 'PENDING' as const,
        method: 'RAZORPAY',
        razorpayOrderId: razorpayOrder.id,
        bookingId
      };

      let payment;
      if (existingPayment) {
        payment = await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: paymentData
        });
      } else {
        payment = await this.prisma.payment.create({
          data: paymentData
        });
      }

      // Booking should already be in PENDING_PAYMENT status
      // No need to update here as it's created with PENDING_PAYMENT initially

      return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        paymentId: payment.id,
        booking: {
          id: booking.id,
          service: booking.service.title,
          provider: booking.provider.name,
          amount: amount
        }
      };

    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new BadRequestException('Failed to create payment order. Please try again.');
    }
  }

  /**
   * Verify payment signature and update payment status
   */
  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentDto;

    // Find payment record
    const payment = await this.prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
      include: { booking: true }
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (payment.status === 'PAID') {
      throw new BadRequestException('Payment already verified');
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update payment status to failed
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
      throw new BadRequestException('Invalid payment signature');
    }

    try {
      // Update payment status to paid
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          transactionId: razorpay_payment_id,
          signature: razorpay_signature,
          updatedAt: new Date()
        }
      });

      // 🎯 PAYMENT-FIRST FLOW: Update booking to ACCEPTED and notify provider
      const updatedBooking = await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { 
          status: 'ACCEPTED', // Now provider can see this booking and respond
          updatedAt: new Date()
        },
        include: {
          client: {
            include: {
              user: {
                select: {
                  email: true,
                  phone: true
                }
              }
            }
          },
          provider: {
            include: {
              user: {
                select: {
                  email: true,
                  phone: true
                }
              }
            }
          },
          service: true
        }
      });

      // 🔔 NOW notify provider about the PAID booking
      try {
        await this.prisma.notification.create({
          data: {
            userId: updatedBooking.provider.userId,
            title: 'New Paid Booking Request!',
            message: `You have a new booking request for ${updatedBooking.service.title}. Payment has been secured - ₹${updatedPayment.amount}`,
            type: 'BOOKING_CREATED',
            bookingId: updatedBooking.id,
            read: false,
          }
        });
      } catch (notificationError) {
        console.log('Failed to send notification:', notificationError);
      }

      return {
        success: true,
        paymentId: updatedPayment.id,
        transactionId: razorpay_payment_id,
        amount: updatedPayment.amount,
        status: 'PAID',
        bookingId: payment.bookingId,
        booking: updatedBooking,
        message: '🎉 Payment successful! Provider has been notified of your booking request.'
      };

    } catch (error) {
      console.error('Payment verification update failed:', error);
      throw new BadRequestException('Failed to update payment status');
    }
  }

  /**
   * Get payment details by booking ID
   */
  async getPaymentByBooking(bookingId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            service: true,
            client: { include: { user: true } },
            provider: { include: { user: true } }
          }
        }
      }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for this booking');
    }

    return payment;
  }

  /**
   * Get all payments (admin use)
   */
  async getAllPayments(page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;
    
    const where = status ? { status: status as any } : {};
    
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          booking: {
            include: {
              service: true,
              client: { include: { user: { select: { email: true, phone: true } } } },
              provider: { include: { user: { select: { email: true, phone: true } } } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.payment.count({ where })
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Refund payment (admin use)
   */
  async refundPayment(paymentId: string, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'PAID') {
      throw new BadRequestException('Only paid payments can be refunded');
    }

    try {
      // Create refund in Razorpay
      const refund = await razorpay.payments.refund(payment.transactionId!, {
        amount: payment.amount * 100, // Convert to paise
        speed: 'normal',
        notes: {
          reason: reason || 'Refund requested',
          paymentId: payment.id
        }
      });

      // Update payment status
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'REFUNDED',
          updatedAt: new Date()
        }
      });

      // Update booking status
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CANCELLED' }
      });

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      };

    } catch (error) {
      console.error('Refund failed:', error);
      throw new BadRequestException('Failed to process refund');
    }
  }

  /**
   * Get booking for payment (used by Cashfree integration)
   */
  async getBookingForPayment(bookingId: string, clientUserId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
                phone: true
              }
            }
          }
        },
        provider: {
          include: {
            user: {
              select: {
                email: true,
                phone: true
              }
            }
          }
        },
        service: true
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.client.userId !== clientUserId) {
      throw new BadRequestException('You can only pay for your own bookings');
    }

    return booking;
  }
}
