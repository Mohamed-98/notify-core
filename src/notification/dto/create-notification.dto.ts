import { IsEnum, IsNotEmpty, IsObject, IsString, IsOptional } from 'class-validator';
import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID of the target user' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Type of notification' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ enum: NotificationChannel, description: 'Notification channel' })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiPropertyOptional({ enum: NotificationStatus, description: 'Notification status' })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiProperty({ description: 'Custom notification payload key-value pairs' })
  @IsObject()
  payload: Record<string, unknown>;
}
