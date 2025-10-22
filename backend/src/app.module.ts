import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddressesModule } from './addresses/addresses.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ServicesModule } from './services/services.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    ProfilesModule,
    AddressesModule,
    AdminModule,
    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
