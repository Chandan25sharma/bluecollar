import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting BlueCollar Backend...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    
    // Enable CORS
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://blue.coderspace.com',
        'https://*.coderspace.com',
        'https://vercel.app',
        'https://*.vercel.app'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
    // Global prefix for all routes
    app.setGlobalPrefix('api');
    
    const port = process.env.PORT || 4000;
    console.log(`🌐 Attempting to listen on port ${port} on all interfaces...`);
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Backend successfully started on port ${port}`);
    console.log(`🔗 Health check available at /api`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    console.error('❌ Failed to start the application:', error);
    throw error;
  }
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
