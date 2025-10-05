import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService, CreateBookingDto } from './bookings.service';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBooking(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    try {
      return await this.bookingsService.createBooking(req.user.id, createBookingDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create booking',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('client/my-bookings')
  async getMyBookingsAsClient(@Request() req) {
    try {
      return await this.bookingsService.getBookingsByClient(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch bookings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider/my-bookings')
  async getMyBookingsAsProvider(@Request() req) {
    try {
      return await this.bookingsService.getBookingsByProvider(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch bookings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBookingById(@Param('id') id: string, @Request() req) {
    try {
      return await this.bookingsService.getBookingById(id, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch booking',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string, 
    @Request() req, 
    @Body() body: UpdateBookingStatusDto
  ) {
    try {
      return await this.bookingsService.updateBookingStatus(id, req.user.id, body.status);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update booking status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
