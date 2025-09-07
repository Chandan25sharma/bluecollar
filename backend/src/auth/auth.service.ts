import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signup(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { user, token };
  }
}
