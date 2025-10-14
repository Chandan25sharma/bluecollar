import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateClientProfileDto {
  name: string;
  age?: number;
}

export interface CreateProviderProfileDto {
  name: string;
  skills: string[];
  rate: number;
  bankName?: string;
  bankAcc?: string;
}

export interface UpdateClientProfileDto {
  name?: string;
  age?: number;
}

export interface UpdateProviderProfileDto {
  name?: string;
  skills?: string[];
  rate?: number;
  bankName?: string;
  bankAcc?: string;
}

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createClientProfile(userId: string, profileData: CreateClientProfileDto) {
    // Check if user exists and is a client
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== Role.CLIENT) {
      throw new Error('User not found or not a client');
    }

    // Check if profile already exists
    const existingProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new Error('Client profile already exists');
    }

    return this.prisma.clientProfile.create({
      data: {
        userId,
        name: profileData.name,
        age: profileData.age,
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            role: true,
          }
        }
      }
    });
  }

  async createProviderProfile(userId: string, profileData: CreateProviderProfileDto) {
    // Check if user exists and is a provider
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== Role.PROVIDER) {
      throw new Error('User not found or not a provider');
    }

    // Check if profile already exists
    const existingProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new Error('Provider profile already exists');
    }

    return this.prisma.providerProfile.create({
      data: {
        userId,
        name: profileData.name,
        skills: profileData.skills,
        rate: profileData.rate,
        bankName: profileData.bankName,
        bankAcc: profileData.bankAcc,
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            role: true,
          }
        }
      }
    });
  }

  async getClientProfile(userId: string) {
    return this.prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            role: true,
            verified: true,
          }
        },
        bookings: {
          include: {
            service: true,
            provider: {
              select: {
                name: true,
                rate: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 bookings
        },
        reviews: {
          include: {
            provider: {
              select: {
                name: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 reviews
        }
      }
    });
  }

  async getProviderProfile(userId: string) {
    return this.prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            role: true,
            verified: true,
          }
        },
        services: {
          include: {
            bookings: {
              select: {
                status: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          include: {
            service: true,
            client: {
              select: {
                name: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 bookings
        },
        reviews: {
          include: {
            client: {
              select: {
                name: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 reviews
        }
      }
    });
  }

  async updateClientProfile(userId: string, updateData: UpdateClientProfileDto) {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Client profile not found');
    }

    return this.prisma.clientProfile.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            role: true,
          }
        }
      }
    });
  }

  async updateProviderProfile(userId: string, updateData: UpdateProviderProfileDto) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Provider profile not found');
    }

    return this.prisma.providerProfile.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            role: true,
          }
        }
      }
    });
  }

  async getAllProviders(filters?: {
    skills?: string;
    verified?: boolean;
    minRate?: number;
    maxRate?: number;
  }) {
    const where: any = {
      // Only show active providers to clients
      isActive: true,
    };

    if (filters?.verified !== undefined) {
      where.verified = filters.verified;
    }

    if (filters?.minRate !== undefined || filters?.maxRate !== undefined) {
      where.rate = {};
      if (filters.minRate !== undefined) {
        where.rate.gte = filters.minRate;
      }
      if (filters.maxRate !== undefined) {
        where.rate.lte = filters.maxRate;
      }
    }

    if (filters?.skills) {
      where.skills = {
        has: filters.skills
      };
    }

    return this.prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            verified: true,
          }
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
          }
        },
        reviews: {
          select: {
            rating: true,
          }
        }
      },
      orderBy: { user: { createdAt: 'desc' } },
    });
  }

  /**
   * Toggle provider availability status
   */
  async toggleProviderAvailability(userId: string) {
    // Find provider profile
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new Error('Provider profile not found');
    }

    // Toggle the isActive status
    const updatedProvider = await this.prisma.providerProfile.update({
      where: { id: provider.id },
      data: { isActive: !provider.isActive },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          }
        }
      }
    });

    return {
      id: updatedProvider.id,
      name: updatedProvider.name,
      isActive: updatedProvider.isActive,
      verified: updatedProvider.verified,
    };
  }

  /**
   * Get provider availability status
   */
  async getProviderAvailability(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        isActive: true,
        verified: true,
      }
    });

    if (!provider) {
      throw new Error('Provider profile not found');
    }

    return provider;
  }
}