import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationConsumer } from './notification.consumer';
import { NotificationProducer } from './notification.producer';
import { NotificationController } from './notification.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    BullModule.registerQueue(
      { name: 'notification' },
      { name: 'notification-dlq' },
    ),
  ],
  providers: [NotificationService, NotificationConsumer, NotificationProducer],
  controllers: [NotificationController],
  exports: [NotificationProducer]
})
export class NotificationModule {}
