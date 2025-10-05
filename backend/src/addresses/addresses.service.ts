import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAddressDto {
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  label?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async getClientAddresses(userId: string) {
    const client = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new Error('Client profile not found');
    }

    return this.prisma.clientAddress.findMany({
      where: { clientId: client.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, data: CreateAddressDto) {
    const client = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new Error('Client profile not found');
    }

    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await this.prisma.clientAddress.updateMany({
        where: { clientId: client.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.clientAddress.create({
      data: {
        ...data,
        clientId: client.id,
      },
    });
  }

  async updateAddress(addressId: string, userId: string, data: UpdateAddressDto) {
    const client = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new Error('Client profile not found');
    }

    const address = await this.prisma.clientAddress.findUnique({
      where: { id: addressId },
    });

    if (!address || address.clientId !== client.id) {
      throw new Error('Address not found or unauthorized');
    }

    return this.prisma.clientAddress.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(addressId: string, userId: string) {
    const client = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new Error('Client profile not found');
    }

    const address = await this.prisma.clientAddress.findUnique({
      where: { id: addressId },
    });

    if (!address || address.clientId !== client.id) {
      throw new Error('Address not found or unauthorized');
    }

    await this.prisma.clientAddress.delete({
      where: { id: addressId },
    });
  }

  async setDefaultAddress(addressId: string, userId: string) {
    const client = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new Error('Client profile not found');
    }

    const address = await this.prisma.clientAddress.findUnique({
      where: { id: addressId },
    });

    if (!address || address.clientId !== client.id) {
      throw new Error('Address not found or unauthorized');
    }

    // Unset all defaults
    await this.prisma.clientAddress.updateMany({
      where: { clientId: client.id, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    return this.prisma.clientAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
