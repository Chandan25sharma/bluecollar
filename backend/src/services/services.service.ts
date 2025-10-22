import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateServiceDto {
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive?: boolean;
}

export interface UpdateServiceDto {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  duration?: string;
  isActive?: boolean;
}

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllServices(filters?: {
    category?: string;
    search?: string;
    isActive?: boolean;
  }) {
    const where: any = {
      provider: {
        verified: true,
        verificationStatus: 'APPROVED',
      },
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.service.findMany({
      where,
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
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getServiceById(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
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
        }
      }
    });
  }

  async createService(userId: string, serviceData: CreateServiceDto) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    return this.prisma.service.create({
      data: {
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        category: serviceData.category,
        duration: serviceData.duration,
        isActive: serviceData.isActive ?? true,
        providerId: providerProfile.id,
      },
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
        }
      }
    });
  }

  async updateService(id: string, userId: string, updateData: UpdateServiceDto) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    const service = await this.prisma.service.findFirst({
      where: { id, providerId: providerProfile.id },
    });

    if (!service) {
      throw new Error('Service not found or unauthorized');
    }

    return this.prisma.service.update({
      where: { id },
      data: updateData,
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
        }
      }
    });
  }

  async deleteService(id: string, userId: string) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    const service = await this.prisma.service.findFirst({
      where: { id, providerId: providerProfile.id },
    });

    if (!service) {
      throw new Error('Service not found or unauthorized');
    }

    return this.prisma.service.delete({
      where: { id }
    });
  }

  async getNearbyServices(
    clientLat: number,
    clientLon: number,
    category?: string,
    maxDistance: number = 50
  ) {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    const services = await this.prisma.service.findMany({
      where,
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
        }
      },
    });

    // Filter by distance (simplified - you'd need actual distance calculation)
    return services.filter(service => {
      // For now, return all services - you can implement distance calculation later
      return true;
    });
  }

  async getServicesByProvider(userId: string) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    return this.prisma.service.findMany({
      where: { providerId: providerProfile.id },
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
        bookings: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleServiceStatus(id: string, userId: string) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    const service = await this.prisma.service.findFirst({
      where: { id, providerId: providerProfile.id },
    });

    if (!service) {
      throw new Error('Service not found or unauthorized');
    }

    return this.prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
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
        }
      }
    });
  }
}