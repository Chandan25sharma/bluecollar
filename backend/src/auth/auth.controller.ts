import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('client-signup')
  async clientSignup(@Body() body: any) {
    return this.authService.signup({ ...body, role: 'client' });
  }

  @Post('provider-signup')
  async providerSignup(@Body() body: any) {
    return this.authService.signup({ ...body, role: 'provider' });
  }

  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
}
