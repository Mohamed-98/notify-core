import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Prisma, NotificationChannel } from '@prisma/client';
import { UserService } from '../user/user.service';
import { NotificationProducer } from './notification.producer';
import { SendNotificationDto, SendChannel } from './dto/send-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly notificationProducer: NotificationProducer,
  ) {}

  async send(sendNotificationDto: SendNotificationDto) {
    const { userId, channel, message, subject } = sendNotificationDto;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const userPrefs = (user.preferences as Record<string, any>) || {
      email: true,
      inApp: true,
    };
    const emailEnabled = userPrefs.email !== false;
    const inAppEnabled = userPrefs.inApp !== false;

    const enqueuedJobs: any[] = [];

    if (channel === SendChannel.EMAIL || channel === SendChannel.BOTH) {
      if (emailEnabled) {
        const notification = await this.prisma.notification.create({
          data: {
            userId,
            type: 'alert',
            channel: NotificationChannel.EMAIL,
            payload: { message, subject },
          },
        });

        const job = await this.notificationProducer.enqueueJob('email', {
          notificationId: notification.id,
          to: user.email,
          subject: subject || 'Notification',
          body: message,
        });
        enqueuedJobs.push({
          type: 'email',
          jobId: job.id,
          notificationId: notification.id,
        });
      } else {
        enqueuedJobs.push({ type: 'email', status: 'skipped_by_preference' });
      }
    }

    if (channel === SendChannel.IN_APP || channel === SendChannel.BOTH) {
      if (inAppEnabled) {
        const notification = await this.prisma.notification.create({
          data: {
            userId,
            type: 'alert',
            channel: NotificationChannel.IN_APP,
            payload: { message },
          },
        });

        const job = await this.notificationProducer.enqueueJob('in-app', {
          notificationId: notification.id,
          userId,
          message,
        });
        enqueuedJobs.push({
          type: 'in-app',
          jobId: job.id,
          notificationId: notification.id,
        });
      } else {
        enqueuedJobs.push({ type: 'in-app', status: 'skipped_by_preference' });
      }
    }

    return {
      success: true,
      enqueuedJobs,
    };
  }

  async markAsRead(id: string) {
    await this.findOne(id); // throws if not found
    return this.prisma.notification.update({
      where: { id },
      data: { status: 'READ' },
    });
  }

  create(createNotificationDto: CreateNotificationDto) {
    const { userId, type, channel, status, payload } = createNotificationDto;
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        channel,
        ...(status && { status }),
        payload: payload as Prisma.InputJsonValue,
      },
    });
  }
  findAll() {
    return this.prisma.notification.findMany({
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async findPaginatedByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }
  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.findOne(id); // throws if not found
    const { userId, type, channel, status, payload } = updateNotificationDto;
    return this.prisma.notification.update({
      where: { id },
      data: {
        ...(userId && { userId }),
        ...(type && { type }),
        ...(channel && { channel }),
        ...(status && { status }),
        ...(payload && { payload: payload as Prisma.InputJsonValue }),
      },
    });
  }
  async remove(id: string) {
    await this.findOne(id); // throws if not found
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
