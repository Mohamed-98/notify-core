import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Send a notification via chosen channels with user preference routing' })
  @ApiResponse({ status: 201, description: 'Notification jobs enqueued successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('send')
  send(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationService.send(sendNotificationDto);
  }

  @ApiOperation({ summary: 'Create a raw notification entry in DB' })
  @ApiResponse({ status: 201, description: 'Notification entry created successfully' })
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @ApiOperation({ summary: 'Retrieve all notifications in DB' })
  @ApiResponse({ status: 200, description: 'List of all notifications' })
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @ApiOperation({ summary: 'Get current user\'s paginated notifications list' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiResponse({ status: 200, description: 'Paginated list of notifications' })
  @Get('me')
  findMyNotifications(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    return this.notificationService.findPaginatedByUser(req.user.id, pageNum, limitNum);
  }

  @ApiOperation({ summary: 'Retrieve all notifications for a specific user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'User\'s notifications' })
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.notificationService.findByUser(userId);
  }

  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'ID of the notification' })
  @ApiResponse({ status: 200, description: 'Notification marked as read successfully' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @ApiOperation({ summary: 'Get details of a single notification' })
  @ApiParam({ name: 'id', description: 'ID of the notification' })
  @ApiResponse({ status: 200, description: 'Notification details' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a notification entry' })
  @ApiParam({ name: 'id', description: 'ID of the notification' })
  @ApiResponse({ status: 200, description: 'Notification updated successfully' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @ApiOperation({ summary: 'Delete a notification entry' })
  @ApiParam({ name: 'id', description: 'ID of the notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
