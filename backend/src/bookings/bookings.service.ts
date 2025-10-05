import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { calculateDistance } from '../common/utils/distance.util';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateBookingDto {
  serviceId: string;
  providerId?: string; // Optional: specific provider ID
  date: string;
  notes?: string;
  // Client address for this booking
  clientAddress?: string;
  clientLatitude?: number;
  clientLongitude?: number;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  date?: string;
  notes?: string;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.booking.create({
      data: {
        clientId: clientProfile.id,
        providerId,
        serviceId: service.id,
        date: new Date(bookingData.date),
        notes: bookingData.notes,
        totalAmount: service.price,
        status: BookingStatus.PENDING,
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

    // Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
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

    // If booking is completed, create a payment record (hardcoded for now)
    if (status === BookingStatus.COMPLETED) {
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalAmount,
          commission: booking.totalAmount * 0.1, // 10% commission
          status: 'COMPLETED',
          method: 'CASH', // Hardcoded payment method
        }
      });
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
