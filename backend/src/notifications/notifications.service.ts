import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    bookingId?: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        bookingId,
        read: false,
      },
    });
  }

  async getUserNotifications(userId: string, unreadOnly = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    return this.prisma.notification.findMany({
      where,
      include: {
        booking: {
          include: {
            service: true,
            provider: {
              include: {
                user: {
                  select: {
                    phone: true,
                    email: true,
                  },
                },
              },
            },
            client: {
              include: {
                user: {
                  select: {
                    phone: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  // Helper method to notify when booking is accepted
  async notifyBookingAccepted(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: { include: { user: true } },
        provider: { include: { user: true } },
        service: true,
      },
    });

    if (!booking) return;

    await this.createNotification(
      booking.client.userId,
      'BOOKING_ACCEPTED',
      'Booking Accepted!',
      `${booking.provider.name} has accepted your booking for ${booking.service.title}. They will contact you soon.`,
      bookingId,
    );
  }

  // Helper method to notify when booking is completed
  async notifyBookingCompleted(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: { include: { user: true } },
        service: true,
      },
    });

    if (!booking) return;

    await this.createNotification(
      booking.client.userId,
      'BOOKING_COMPLETED',
      'Service Completed!',
      `Your ${booking.service.title} service has been completed. Please leave a review!`,
      bookingId,
    );
  }

  // Helper method to notify provider of new booking
  async notifyNewBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        provider: { include: { user: true } },
        client: true,
        service: true,
      },
    });

    if (!booking) return;

    await this.createNotification(
      booking.provider.userId,
      'BOOKING_CREATED',
      'New Booking Request!',
      `You have a new booking request for ${booking.service.title} from ${booking.client.name}. Distance: ${booking.distance?.toFixed(1) || 'N/A'} km`,
      bookingId,
    );
  }
}
