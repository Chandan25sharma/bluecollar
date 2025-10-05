import { Injectable } from '@nestjs/common';
import { BookingStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats(timeRange?: string) {
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get total counts
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      pendingBookings,
      completedBookings,
      activeProviders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.providerProfile.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.booking.count({
        where: { status: 'COMPLETED' },
      }),
      this.prisma.providerProfile.count({
        where: { verified: true },
      }),
    ]);

    // Calculate revenue from completed bookings
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      select: { totalAmount: true },
    });

    const revenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Platform earnings (assuming 15% commission)
    const platformEarnings = revenue * 0.15;

    return {
      totalUsers,
      totalProviders,
      totalBookings,
      revenue,
      pendingBookings,
      completedBookings,
      activeProviders,
      platformEarnings,
    };
  }

  async getRecentActivities(limit: number) {
    // Get recent bookings
    const recentBookings = await this.prisma.booking.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        service: true,
      },
    });

    // Get recent users
    const recentUsers = await this.prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        clientProfile: true,
        providerProfile: true,
      },
    });

    // Combine and sort activities
    const activities = [
      ...recentBookings.map((booking) => ({
        id: booking.id,
        type: 'booking' as const,
        action: `Booking ${booking.status.toLowerCase()}`,
        user: booking.client.name,
        timestamp: booking.createdAt.toISOString(),
        status: booking.status === 'COMPLETED' ? 'completed' as const : 
                booking.status === 'PENDING' ? 'pending' as const : 
                'failed' as const,
      })),
      ...recentUsers.map((user) => ({
        id: user.id,
        type: user.role === 'PROVIDER' ? 'provider' as const : 'user' as const,
        action: `${user.role} account created`,
        user: user.email,
        timestamp: user.createdAt.toISOString(),
        status: 'completed' as const,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return activities;
  }

  async getAllUsers(page: number, limit: number, role?: string) {
    const skip = (page - 1) * limit;
    const where = role ? { role: role as Role } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          clientProfile: true,
          providerProfile: true,
          adminProfile: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllBookings(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as BookingStatus } : {};

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          provider: true,
          service: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllServices(page: number, limit: number, isActive?: boolean) {
    const skip = (page - 1) * limit;
    const where = isActive !== undefined ? { isActive } : {};

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: {
            include: {
              user: {
                select: {
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllProviders(page: number, limit: number, verified?: boolean) {
    const skip = (page - 1) * limit;
    const where = verified !== undefined ? { verified } : {};

    const [providers, total] = await Promise.all([
      this.prisma.providerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { user: { createdAt: 'desc' } },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              verified: true,
              createdAt: true,
            },
          },
          services: {
            select: {
              id: true,
              title: true,
              category: true,
              isActive: true,
            },
          },
        },
      }),
      this.prisma.providerProfile.count({ where }),
    ]);

    return {
      data: providers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingProviders() {
    const providers = await this.prisma.providerProfile.findMany({
      where: {
        OR: [
          { verificationStatus: 'PENDING' },
          { verificationStatus: 'RESUBMITTED' },
        ],
      },
      orderBy: { createdAt: 'asc' }, // Oldest first
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    return providers;
  }

  async getProviderDetails(id: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            verified: true,
            createdAt: true,
          },
        },
        services: true,
        bookings: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    return provider;
  }

  async verifyProvider(
    providerId: string,
    adminId: string,
    approved: boolean,
    reason?: string,
  ) {
    const updateData: any = {
      verificationStatus: approved ? 'APPROVED' : 'REJECTED',
      verified: approved,
      verifiedAt: approved ? new Date() : null,
      verifiedBy: approved ? adminId : null,
    };

    if (!approved && reason) {
      updateData.rejectionReason = reason;
    }

    const provider = await this.prisma.providerProfile.update({
      where: { id: providerId },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });

    // TODO: Send email/SMS notification to provider
    // if (approved) {
    //   await this.notificationService.sendApprovalEmail(provider.user.email);
    // } else {
    //   await this.notificationService.sendRejectionEmail(provider.user.email, reason);
    // }

    return {
      success: true,
      provider,
      message: approved
        ? 'Provider approved successfully'
        : 'Provider rejected. They can resubmit documents.',
    };
  }
}
