import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum SendChannel {
  EMAIL = 'email',
  IN_APP = 'in-app',
  BOTH = 'both',
}

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(SendChannel)
  channel: SendChannel;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  subject?: string;
}
