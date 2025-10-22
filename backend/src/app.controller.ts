import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): { message: string; status: string } {
    return {
      message: 'BlueCollar Backend API is running',
      status: 'healthy'
    };
  }

  @Get('health')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}