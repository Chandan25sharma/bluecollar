import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting BlueCollar Backend...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    
    // Enable CORS for all origins in production (simplify for now)
    app.enableCors({
      origin: true,
      credentials: true,
    });
    
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
    }));
    
    // Global prefix for all routes
    app.setGlobalPrefix('api');
    
    const port = process.env.PORT || 4000;
    console.log(`🌐 Starting server on port ${port}...`);
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Backend started successfully on port ${port}`);
    console.log(`🔗 Health check: /api/health`);
    
  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
