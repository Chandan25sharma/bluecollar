import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`Backend running on http://localhost:${port}/api`);
  console.log(`Database connected successfully`);
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
