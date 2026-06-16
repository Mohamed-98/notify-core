import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationConsumer, NotificationDlqConsumer } from './notification.consumer';
import { NotificationProducer } from './notification.producer';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    EmailModule,
    AuthModule,
    UserModule,
    BullModule.registerQueue(
      { name: 'notification' },
      { name: 'notification-dlq' },
    ),
  ],
  providers: [
    NotificationService,
    NotificationConsumer,
    NotificationDlqConsumer,
    NotificationProducer,
    NotificationGateway,
  ],
  controllers: [NotificationController],
  exports: [NotificationProducer]
})
export class NotificationModule {}
