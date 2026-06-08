import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SendChannel {
  EMAIL = 'email',
  IN_APP = 'in-app',
  BOTH = 'both',
}

export class SendNotificationDto {
  @ApiProperty({ description: 'ID of the recipient user' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: SendChannel, description: 'Delivery channel preference' })
  @IsEnum(SendChannel)
  channel: SendChannel;

  @ApiProperty({ description: 'Notification message body' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Notification subject (optional)' })
  @IsOptional()
  @IsString()
  subject?: string;
}
