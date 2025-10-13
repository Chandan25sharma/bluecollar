import {
    Controller,
    Get,
    Param,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('unread') unread?: string,
  ) {
    const unreadOnly = unread === 'true';
    return this.notificationsService.getUserNotifications(
      req.user.id,
      unreadOnly,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Put('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
