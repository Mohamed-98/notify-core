import { Process, Processor, OnQueueEvent, InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { Job, Queue } from 'bull';
import { EmailService } from '../email/email.service';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationStatus } from '@prisma/client';

export type EmailJobData = {
  notificationId?: string;
  to: string;
  subject?: string;
  body?: string;
  templateId?: string;
  dynamicVars?: Record<string, any>;
};
export type InAppJobData = {
  notificationId?: string;
  userId: string;
  message: string;
};

@Processor('notification-dlq')
export class NotificationDlqConsumer {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Process('email')
  async handleFailedEmail(job: Job) {
    this.logger.error('Permanent email failure - Job moved to DLQ', {
      jobId: job.id,
      originalJobId: job.data.originalJobId,
      notificationId: job.data.notificationId,
      reason: job.data.reason,
      to: job.data.data?.to,
    });
  }

  @Process('in-app')
  async handleFailedInApp(job: Job) {
    this.logger.error('Permanent in-app failure - Job moved to DLQ', {
      jobId: job.id,
      originalJobId: job.data.originalJobId,
      notificationId: job.data.notificationId,
      reason: job.data.reason,
      userId: job.data.data?.userId,
    });
  }
}

@Processor('notification')
export class NotificationConsumer {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectQueue('notification-dlq') private readonly dlqQueue: Queue,
    private readonly emailService: EmailService,
    private readonly notificationGateway: NotificationGateway,
    private readonly prisma: PrismaService,
  ) {}

  @Process('email')
  async handleEmail(job: Job<EmailJobData>) {
    const { notificationId, to, subject, body, templateId, dynamicVars } =
      job.data;
    this.logger.info('Processing email job', {
      jobId: job.id,
      notificationId,
      channel: 'email',
      to,
    });
    if (!to) {
      throw new Error('Missing recipient email address');
    }
    await this.emailService.sendEmail({
      to,
      subject,
      body,
      templateId,
      dynamicVars,
    });

    if (notificationId) {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: NotificationStatus.SENT },
      });
    }
  }

  @Process('in-app')
  async handleInApp(job: Job<InAppJobData>) {
    const { notificationId, userId, message } = job.data;
    this.logger.info('Processing in-app job', {
      jobId: job.id,
      notificationId,
      channel: 'in-app',
      userId,
    });
    if (!userId) {
      throw new Error('Missing user ID');
    }
    this.notificationGateway.sendToUser(userId, { message });

    if (notificationId) {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: NotificationStatus.DELIVERED },
      });
    }
  }

  @OnQueueEvent('waiting')
  onQueued(jobId: string | number) {
    this.logger.info('Job queued', { jobId });
  }

  @OnQueueEvent('active')
  onActive(job: Job) {
    this.logger.info('Job active', {
      jobId: job.id,
      notificationId: job.data?.notificationId,
      channel: job.name,
      ...(job.data?.userId && { userId: job.data.userId }),
    });
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    this.logger.info('Job completed', {
      jobId: job.id,
      notificationId: job.data?.notificationId,
      channel: job.name,
      ...(job.data?.userId && { userId: job.data.userId }),
    });
  }

  @OnQueueEvent('failed')
  async onFailed(job: Job, error: Error) {
    const { notificationId } = job.data;
    this.logger.error('Job failed', {
      jobId: job.id,
      notificationId,
      channel: job.name,
      ...(job.data?.userId && { userId: job.data.userId }),
      error: error.message,
      attemptsMade: job.attemptsMade,
    });

    const attempts = job.opts.attempts ?? 1;
    if (job.attemptsMade >= attempts) {
      this.logger.warn('Job moved to dead-letter queue', {
        jobId: job.id,
        notificationId,
        channel: job.name,
        attempts: job.attemptsMade,
      });

      if (notificationId) {
        await this.prisma.notification.update({
          where: { id: notificationId },
          data: { status: NotificationStatus.FAILED },
        });
      }

      await this.dlqQueue.add(job.name, {
        originalJobId: job.id,
        notificationId,
        data: job.data,
        failedAt: new Date().toISOString(),
        reason: error.message,
        attemptsMade: job.attemptsMade,
      });
    }
  }
}
