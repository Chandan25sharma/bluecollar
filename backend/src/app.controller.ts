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

  // This will be available at /api since we have global prefix 'api'
  // Railway health check looks for /api endpoint
  @Get('')
  apiRoot(): { message: string; status: string; timestamp: string } {
    return {
      message: 'BlueCollar API is healthy',
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}