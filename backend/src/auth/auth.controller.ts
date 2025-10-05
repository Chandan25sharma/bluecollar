import { Body, Controller, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('client-signup')
  async clientSignup(@Body() body: SignupDto) {
    return this.authService.signup({ ...body, role: Role.CLIENT });
  }

  @Post('provider-signup')
  async providerSignup(@Body() body: SignupDto) {
    return this.authService.signup({ ...body, role: Role.PROVIDER });
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
}
