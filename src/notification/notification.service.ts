import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
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
