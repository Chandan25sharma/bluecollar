import { Injectable, Logger } from '@nestjs/common';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { getCashfreeConfig, PAYMENT_CONFIG, TEST_PAYMENT_SCENARIOS } from './cashfree.config';

// Import Cashfree SDK with proper types
const { Cashfree } = require('cashfree-pg');

export interface CreatePaymentOrderDto {
  bookingId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentVerificationDto {
  orderId: string;
  paymentId?: string;
  signature?: string;
}

@Injectable()
export class CashfreePaymentService {
  private readonly logger = new Logger(CashfreePaymentService.name);
  private cashfree: any;

  constructor(private readonly prisma: PrismaService) {
    this.initializeCashfree();
  }

  private initializeCashfree() {
    const config = getCashfreeConfig();
    
    // Initialize Cashfree SDK - Set global configuration
    try {
      Cashfree.XClientId = config.APP_ID;
      Cashfree.XClientSecret = config.SECRET_KEY;
      Cashfree.XEnvironment = config.ENVIRONMENT === 'PRODUCTION' 
        ? Cashfree.Environment.PRODUCTION 
        : Cashfree.Environment.SANDBOX;
      
      this.cashfree = Cashfree;
      this.logger.log(`Cashfree initialized for ${config.ENVIRONMENT} environment`);
    } catch (error) {
      // Fallback for local development - create mock Cashfree object
      this.logger.warn('Cashfree SDK not available, using mock implementation for development');
      this.cashfree = {
        PGCreateOrder: async (version: string, request: any) => ({
          data: {
            cf_order_id: `CF_${Date.now()}`,
            payment_session_id: `session_${Date.now()}`,
            payment_url: `https://sandbox.cashfree.com/pg/orders/session_${Date.now()}`
          }
        }),
        PGOrderFetchPayments: async (version: string, orderId: string) => ({
          data: [{
            cf_payment_id: `CF_PAY_${Date.now()}`,
            payment_status: 'SUCCESS'
          }]
        }),
        PGOrderCreateRefund: async (version: string, orderId: string, request: any) => ({
          data: {
            cf_refund_id: `CF_REF_${Date.now()}`
          }
        })
      };
    }
  }

  /**
   * Create payment order for booking
   */
  async createPaymentOrder(orderData: CreatePaymentOrderDto) {
    try {
      const { bookingId, amount, customerName, customerEmail, customerPhone } = orderData;
      
      // Generate unique order ID
      const orderId = `BLC_${bookingId}_${Date.now()}`;
      
      // Calculate commission and provider amount
      const commission = amount * PAYMENT_CONFIG.commissionRate;
      const providerAmount = amount * PAYMENT_CONFIG.providerRate;

      // Create payment order request
      const orderRequest = {
        order_id: orderId,
        order_amount: amount,
        order_currency: PAYMENT_CONFIG.currency,
        customer_details: {
          customer_id: `CUST_${customerEmail.split('@')[0]}_${Date.now()}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${PAYMENT_CONFIG.returnUrl}/booking/payment-success?order_id=${orderId}`,
          notify_url: PAYMENT_CONFIG.webhookUrl,
          payment_methods: "cc,dc,nb,upi,wallet,emi,paylater"
        },
        order_note: `Payment for BlueCollar service booking ${bookingId}`
      };

      // Create order with Cashfree
      const response = await this.cashfree.PGCreateOrder("2022-09-01", orderRequest);
      
      if (response && response.data) {
        // Save payment record to database
        const payment = await this.prisma.payment.create({
          data: {
            bookingId,
            amount,
            commission,
            providerAmount,
            currency: PAYMENT_CONFIG.currency,
            status: PaymentStatus.PENDING,
            method: 'CASHFREE',
            razorpayOrderId: orderId, // Reusing this field for Cashfree order ID
            transactionId: response.data.cf_order_id,
          }
        });

        return {
          success: true,
          orderId,
          cfOrderId: response.data.cf_order_id,
          paymentSessionId: response.data.payment_session_id,
          paymentUrl: response.data.payment_url,
          amount,
          currency: PAYMENT_CONFIG.currency,
          payment,
          // Test scenarios for development
          testScenarios: process.env.NODE_ENV !== 'production' ? TEST_PAYMENT_SCENARIOS : undefined
        };
      } else {
        throw new Error('Failed to create Cashfree order');
      }
    } catch (error) {
      this.logger.error('Error creating Cashfree payment order:', error);
      throw new Error(`Payment order creation failed: ${error.message}`);
    }
  }

  /**
   * Verify payment after completion
   */
  async verifyPayment(verificationData: PaymentVerificationDto) {
    try {
      const { orderId, paymentId } = verificationData;

      // Get payment from database
      const payment = await this.prisma.payment.findFirst({
        where: { razorpayOrderId: orderId },
        include: { booking: true }
      });

      if (!payment) {
        throw new Error('Payment record not found');
      }

      // Verify with Cashfree
      const response = await this.cashfree.PGOrderFetchPayments("2022-09-01", orderId);
      
      if (response && response.data && response.data.length > 0) {
        const paymentStatus = response.data[0];
        
        if (paymentStatus.payment_status === 'SUCCESS') {
          // Update payment status
          const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: PaymentStatus.PAID,
              transactionId: paymentStatus.cf_payment_id,
              updatedAt: new Date()
            }
          });

          // 🎯 PAYMENT-FIRST FLOW: Update booking to ACCEPTED and notify provider
          const updatedBooking = await this.prisma.booking.update({
            where: { id: payment.bookingId },
            data: { 
              status: BookingStatus.ACCEPTED, // Now provider can see this booking
              updatedAt: new Date()
            },
            include: {
              client: {
                include: {
                  user: {
                    select: {
                      email: true,
                      phone: true,
                    }
                  }
                }
              },
              provider: {
                include: {
                  user: {
                    select: {
                      email: true,
                      phone: true,
                    }
                  }
                }
              },
              service: true,
            }
          });

          // 🔔 NOW notify provider about the PAID booking
          try {
            // You would typically inject NotificationsService here
            // For now, we'll create a basic notification
            await this.prisma.notification.create({
              data: {
                userId: updatedBooking.provider.userId,
                title: 'New Paid Booking Request!',
                message: `You have a new booking request for ${updatedBooking.service.title}. Payment has been secured.`,
                type: 'BOOKING_CREATED',
                bookingId: updatedBooking.id,
                read: false,
              }
            });
            this.logger.log(`Provider notified for booking ${updatedBooking.id}`);
          } catch (notificationError) {
            this.logger.warn('Failed to send notification:', notificationError);
          }

          return {
            success: true,
            payment: updatedPayment,
            booking: updatedBooking,
            transactionId: paymentStatus.cf_payment_id,
            message: '🎉 Payment successful! Provider has been notified of your booking request.'
          };
        } else {
          // Payment failed
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: { 
              status: PaymentStatus.FAILED,
              updatedAt: new Date()
            }
          });

          throw new Error(`Payment failed with status: ${paymentStatus.payment_status}`);
        }
      } else {
        throw new Error('No payment information found');
      }
    } catch (error) {
      this.logger.error('Error verifying Cashfree payment:', error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  /**
   * Handle Cashfree webhook notifications
   */
  async handleWebhook(webhookData: any) {
    try {
      this.logger.log('Received Cashfree webhook:', webhookData);
      
      const { orderId, txStatus, paymentMode, txMsg, txTime } = webhookData;

      if (!orderId) {
        throw new Error('Order ID not found in webhook data');
      }

      const payment = await this.prisma.payment.findFirst({
        where: { razorpayOrderId: orderId }
      });

      if (!payment) {
        this.logger.warn(`Payment not found for order ID: ${orderId}`);
        return { success: false, message: 'Payment not found' };
      }

      // Update payment based on webhook status
      let paymentStatus: PaymentStatus;
      let bookingStatus: BookingStatus = BookingStatus.PENDING;

      switch (txStatus) {
        case 'SUCCESS':
          paymentStatus = PaymentStatus.PAID;
          bookingStatus = BookingStatus.ACCEPTED;
          break;
        case 'FAILED':
        case 'CANCELLED':
          paymentStatus = PaymentStatus.FAILED;
          bookingStatus = BookingStatus.CANCELLED;
          break;
        default:
          paymentStatus = PaymentStatus.PENDING;
      }

      // Update payment
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentStatus,
          method: paymentMode || 'CASHFREE',
          updatedAt: new Date()
        }
      });

      // Update booking if payment successful
      if (paymentStatus === PaymentStatus.PAID) {
        await this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: bookingStatus,
            updatedAt: new Date()
          }
        });
      }

      return { success: true, status: paymentStatus };
    } catch (error) {
      this.logger.error('Error handling Cashfree webhook:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string) {
    try {
      const payment = await this.prisma.payment.findFirst({
        where: { razorpayOrderId: orderId },
        include: {
          booking: {
            include: {
              service: true,
              provider: true,
              client: true
            }
          }
        }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      return {
        payment,
        booking: payment.booking
      };
    } catch (error) {
      this.logger.error('Error getting payment status:', error);
      throw error;
    }
  }

  /**
   * Process refund (for admin use)
   */
  async processRefund(paymentId: string, refundAmount?: number) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment || payment.status !== 'PAID') {
        throw new Error('Payment not found or not eligible for refund');
      }

      const refundRequest = {
        refund_id: `REF_${paymentId}_${Date.now()}`,
        refund_amount: refundAmount || payment.amount,
        refund_currency: payment.currency,
        refund_note: 'Refund processed by admin'
      };

      // Process refund with Cashfree
      const response = await this.cashfree.PGOrderCreateRefund(
        "2022-09-01",
        payment.razorpayOrderId,
        refundRequest
      );

      if (response && response.data) {
        // Update payment status
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.REFUNDED,
            updatedAt: new Date()
          }
        });

        return {
          success: true,
          refundId: response.data.cf_refund_id,
          refundAmount: refundAmount || payment.amount
        };
      } else {
        throw new Error('Refund request failed');
      }
    } catch (error) {
      this.logger.error('Error processing refund:', error);
      throw error;
    }
  }
}