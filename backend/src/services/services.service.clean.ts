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
  constructor(private prisma: PrismaService) {}

  async createService(userId: string, serviceData: CreateServiceDto) {
    // First, find the provider profile
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
        provider: true
      }
    });
  }

  async getServicesByProvider(userId: string) {
    // First, find the provider profile
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    return this.prisma.service.findMany({
      where: { providerId: providerProfile.id },
      include: {
        provider: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllServices(filters?: any) {
    const where: any = {};
    
    if (filters?.category) {
      where.category = filters.category;
    }
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.service.findMany({
      where,
      include: {
        provider: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getServiceById(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        provider: true,
        bookings: true
      }
    });
  }

  async updateService(id: string, userId: string, updateData: UpdateServiceDto) {
    // First, find the provider profile
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    // Ensure the service belongs to the user
    const service = await this.prisma.service.findFirst({
      where: { id, providerId: providerProfile.id }
    });

    if (!service) {
      throw new Error('Service not found or unauthorized');
    }

    return this.prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        provider: true
      }
    });
  }

  async deleteService(id: string, userId: string) {
    // First, find the provider profile
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    // Ensure the service belongs to the user
    const service = await this.prisma.service.findFirst({
      where: { id, providerId: providerProfile.id }
    });

    if (!service) {
      throw new Error('Service not found or unauthorized');
    }

    return this.prisma.service.delete({
      where: { id }
    });
  }

  async toggleServiceStatus(id: string, userId: string) {
    // First, find the provider profile
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error('Provider profile not found');
    }

    const service = await this.prisma.service.findFirst({
      where: { id, providerId: providerProfile.id }
    });

    if (!service) {
      throw new Error('Service not found or unauthorized');
    }

    return this.prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
      include: {
        provider: true
      }
    });
  }
}