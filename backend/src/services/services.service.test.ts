import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async testConnection() {
    // Test if we can connect to the database
    try {
      const result = await this.prisma.$connect();
      return { message: 'Database connection successful' };
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async listUsers() {
    // Test if we can query users
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new Error(`Failed to query users: ${error.message}`);
    }
  }
}