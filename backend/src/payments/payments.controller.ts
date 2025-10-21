import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  /**
   * Create payment order for booking
   * POST /payments/create-order
   */
  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      // Ensure the authenticated user is the client making the payment
      const clientUserId = req.user.id;
      
      // Update DTO with authenticated client ID
      createOrderDto.clientId = clientUserId;
      
      return await this.paymentsService.createOrder(createOrderDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create payment order');
    }
  }

  /**
   * Verify payment after successful Razorpay payment
   * POST /payments/verify
   */
  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    try {
      return await this.paymentsService.verifyPayment(verifyPaymentDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Payment verification failed');
    }
  }

  /**
   * Get payment details for a booking
   * GET /payments/booking/:bookingId
   */
  @UseGuards(JwtAuthGuard)
  @Get('booking/:bookingId')
  async getPaymentByBooking(@Param('bookingId') bookingId: string, @Request() req) {
    try {
      const payment = await this.paymentsService.getPaymentByBooking(bookingId);
      
      // Check if user has access to this payment info
      const userId = req.user.id;
      const isClient = payment.booking.client.userId === userId;
      const isProvider = payment.booking.provider.userId === userId;
      const isAdmin = req.user.role === 'ADMIN';
      
      if (!isClient && !isProvider && !isAdmin) {
        throw new BadRequestException('Access denied');
      }
      
      return payment;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch payment details');
    }
  }

  /**
   * Get all payments - Admin only
   * GET /payments/admin/all
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async getAllPayments(
    @Request() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: string
  ) {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Admin access required');
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    return await this.paymentsService.getAllPayments(pageNum, limitNum, status);
  }

  /**
   * Process refund - Admin only
   * POST /payments/admin/refund/:paymentId
   */
  @UseGuards(JwtAuthGuard)
  @Post('admin/refund/:paymentId')
  async refundPayment(
    @Request() req,
    @Param('paymentId') paymentId: string,
    @Body('reason') reason?: string
  ) {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Admin access required');
    }
    
    return await this.paymentsService.refundPayment(paymentId, reason);
  }

  /**
   * Get payment statistics - Admin only
   * GET /payments/admin/stats
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/stats')
  async getPaymentStats(@Request() req) {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Admin access required');
    }

    // You can expand this to return comprehensive payment statistics
    const stats = await this.paymentsService.getAllPayments(1, 1000); // Get all for stats
    
    const totalRevenue = stats.payments
      .filter(p => p.status === 'PAID')
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    const totalCommission = stats.payments
      .filter(p => p.status === 'PAID')
      .reduce((sum, payment) => sum + payment.commission, 0);
    
    const statusCounts = stats.payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalCommission,
      totalPayments: stats.pagination.total,
      statusDistribution: statusCounts,
      averageTransactionValue: totalRevenue / (stats.payments.filter(p => p.status === 'PAID').length || 1)
    };
  }
}
