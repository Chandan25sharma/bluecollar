import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { calculateDistance } from '../common/utils/distance.util';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

export interface UpdateBookingDto {
  status?: BookingStatus;
  date?: string;
  notes?: string;
}

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async createBooking(clientUserId: string, bookingData: CreateBookingDto) {
    // Find client profile
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId: clientUserId },
    });

    if (!clientProfile) {
      throw new Error('Client profile not found');
    }

    // Find service and its provider
    const service = await this.prisma.service.findUnique({
      where: { id: bookingData.serviceId },
      include: { provider: true }
    });

    if (!service) {
      throw new Error('Service not found');
    }

    // Use specific provider if provided, otherwise use service's provider
    const providerId = bookingData.providerId || service.providerId;
    
    // Calculate distance if both client and provider have locations
    let distance: number | undefined;
    if (bookingData.clientLatitude && bookingData.clientLongitude) {
      const provider = await this.prisma.providerProfile.findUnique({
        where: { id: providerId },
      });
      
      if (provider?.latitude && provider?.longitude) {
        distance = calculateDistance(
          bookingData.clientLatitude,
          bookingData.clientLongitude,
          provider.latitude,
          provider.longitude
        );
      }
    }

    // CREATE BOOKING WITH PENDING_PAYMENT STATUS - Payment Required Before Provider Notification
    const booking = await this.prisma.booking.create({
      data: {
        clientId: clientProfile.id,
        providerId,
        serviceId: service.id,
        date: new Date(bookingData.date),
        notes: bookingData.notes,
        totalAmount: service.price,
        status: BookingStatus.PENDING, // Changed: Booking starts as PENDING_PAYMENT until paid
        clientAddress: bookingData.clientAddress,
        clientLatitude: bookingData.clientLatitude,
        clientLongitude: bookingData.clientLongitude,
        distance,
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

    // DO NOT notify provider yet - they get notified only after payment
    // await this.notificationsService.notifyNewBooking(booking.id);

    return {
      ...booking,
      requiresPayment: true,
      message: 'Booking created. Payment required to notify provider.'
    };
  }

  /**
   * Create booking with payment - NEW PAYMENT-FIRST FLOW
   */
  async createBookingWithPayment(clientUserId: string, bookingData: CreateBookingDto & { paymentData: any }) {
    // Create booking first (without notifying provider)
    const booking = await this.createBooking(clientUserId, bookingData);
    
    return {
      booking,
      nextStep: 'payment',
      paymentRequired: true,
      message: 'Please complete payment to send booking request to provider'
    };
  }

  /**
   * Confirm booking after successful payment - Provider gets notified here
   */
  async confirmBookingAfterPayment(bookingId: string, paymentId: string) {
    // Update booking status to ACCEPTED (waiting for provider response)
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: BookingStatus.ACCEPTED, // Now provider can see and respond
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

    // NOW notify provider about the PAID booking
    await this.notificationsService.notifyNewBooking(booking.id);

    return {
      ...booking,
      message: 'Payment successful! Provider has been notified of your booking request.'
    };
  }

  async getBookingsByClient(clientUserId: string) {
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId: clientUserId },
    });

    if (!clientProfile) {
      throw new Error('Client profile not found');
    }

    return this.prisma.booking.findMany({
      where: { clientId: clientProfile.id },
      include: {
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
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingsByProvider(providerUserId: string) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId: providerUserId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    return this.prisma.booking.findMany({
      where: { providerId: providerProfile.id },
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
        service: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateBookingStatus(bookingId: string, userId: string, status: BookingStatus) {
    // Find the booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: { include: { user: true } },
        provider: { include: { user: true } },
      }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if user is authorized (either client or provider)
    const isAuthorized = booking.client.user.id === userId || booking.provider.user.id === userId;
    if (!isAuthorized) {
      throw new Error('Unauthorized to update this booking');
    }

    // Prepare update data with timestamps
    const updateData: any = { status };
    
    if (status === BookingStatus.ACCEPTED) {
      updateData.acceptedAt = new Date();
    } else if (status === BookingStatus.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (status === BookingStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    // Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
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

    // Send notifications based on status change
    if (status === BookingStatus.ACCEPTED) {
      await this.notificationsService.notifyBookingAccepted(bookingId);
    } else if (status === BookingStatus.COMPLETED) {
      await this.notificationsService.notifyBookingCompleted(bookingId);
      
      // Create payment record for completed bookings (if payment doesn't exist)
      const existingPayment = await this.prisma.payment.findUnique({
        where: { bookingId: booking.id }
      });
      
      if (!existingPayment) {
        await this.prisma.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount,
            commission: booking.totalAmount * 0.1, // 10% commission
            providerAmount: booking.totalAmount * 0.9, // 90% to provider
            status: 'PAID', // Use correct enum value
            method: 'CASH', // Cash payment for completed bookings
          }
        });
      }
    }

    return updatedBooking;
  }

  async getBookingById(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
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
        payment: true,
        review: true,
      }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if user is authorized
    const isAuthorized = booking.client.userId === userId || booking.provider.userId === userId;
    if (!isAuthorized) {
      throw new Error('Unauthorized to view this booking');
    }

    return booking;
  }
}
