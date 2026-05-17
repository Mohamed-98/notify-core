import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { NotificationChannel, NotificationStatus } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsObject()
  payload: Record<string, unknown>;
}
