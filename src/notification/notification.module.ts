import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationConsumer } from './notification.consumer';
import { NotificationProducer } from './notification.producer';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  providers: [NotificationService, NotificationConsumer, NotificationProducer],
  controllers: [NotificationController],
  exports: [NotificationProducer]
})
export class NotificationModule {}
