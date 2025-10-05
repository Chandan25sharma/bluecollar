import { Controller, Get, Query, Patch, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats(@Query('timeRange') timeRange?: string) {
    return this.adminService.getStats(timeRange);
  }

  @Get('recent-activities')
  async getRecentActivities(@Query('limit') limit?: number) {
    return this.adminService.getRecentActivities(limit || 10);
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: string,
  ) {
    return this.adminService.getAllUsers(
      page || 1,
      limit || 10,
      role,
    );
  }

  @Get('bookings')
  async getAllBookings(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllBookings(
      page || 1,
      limit || 10,
      status,
    );
  }

  @Get('services')
  async getAllServices(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isActive') isActive?: string,
  ) {
    return this.adminService.getAllServices(
      page || 1,
      limit || 10,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    );
  }

  @Get('providers')
  async getAllProviders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('verified') verified?: string,
  ) {
    return this.adminService.getAllProviders(
      page || 1,
      limit || 10,
      verified === 'true' ? true : verified === 'false' ? false : undefined,
    );
  }

  @Get('providers/pending')
  async getPendingProviders() {
    return this.adminService.getPendingProviders();
  }

  @Get('providers/:id')
  async getProviderDetails(@Param('id') id: string) {
    return this.adminService.getProviderDetails(id);
  }

  @Patch('providers/:id/verify')
  async verifyProvider(
    @Param('id') id: string,
    @Body() body: { adminId: string; approved: boolean; reason?: string },
  ) {
    return this.adminService.verifyProvider(id, body.adminId, body.approved, body.reason);
  }
}
