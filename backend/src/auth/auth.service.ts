import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signup(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    // Auto-create profile based on role
    if (user.role === Role.CLIENT) {
      await this.prisma.clientProfile.create({
        data: {
          userId: user.id,
          name: userData.name || 'User',
          age: userData.age || null,
        },
      });
    } else if (user.role === Role.PROVIDER) {
      await this.prisma.providerProfile.create({
        data: {
          userId: user.id,
          name: userData.name || 'Provider',
          skills: userData.skills || [],
          rate: userData.rate || 0,
          verified: false,
          bankName: userData.bankName || null,
          bankAcc: userData.bankAcc || null,
          govIdUrl: userData.govIdUrl || null,
          address: userData.address || null,
          latitude: userData.latitude || null,
          longitude: userData.longitude || null,
          city: userData.city || null,
          state: userData.state || null,
          zipCode: userData.zipCode || null,
        },
      });
    }

    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      role: user.role 
    });
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      role: user.role 
    });
    return { user, token };
  }
}
