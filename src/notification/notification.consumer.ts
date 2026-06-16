import { Process, Processor, OnQueueEvent, InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { Job, Queue } from 'bull';
import { EmailService } from '../email/email.service';
import { NotificationGateway } from './notification.gateway';

export type EmailJobData = {
  to: string;
  subject?: string;
  body?: string;
  templateId?: string;
  dynamicVars?: Record<string, any>;
};
export type InAppJobData = { userId: string; message: string };

@Processor('notification')
export class NotificationConsumer {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectQueue('notification-dlq') private readonly dlqQueue: Queue,
    private readonly emailService: EmailService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Process('email')
  async handleEmail(job: Job<EmailJobData>) {
    this.logger.info('Processing email job', {
      jobId: job.id,
      channel: 'email',
      to: job.data.to,
    });
    if (!job.data.to) {
      throw new Error('Missing recipient email address');
    }
    await this.emailService.sendEmail({
      to: job.data.to,
      subject: job.data.subject,
      body: job.data.body,
      templateId: job.data.templateId,
      dynamicVars: job.data.dynamicVars,
    });
  }

  @Process('in-app')
  async handleInApp(job: Job<InAppJobData>) {
    this.logger.info('Processing in-app job', {
      jobId: job.id,
      channel: 'in-app',
      userId: job.data.userId,
    });
    const { userId, message } = job.data;
    if (!userId) {
      throw new Error('Missing user ID');
    }
    this.notificationGateway.sendToUser(userId, { message });
  }

  @OnQueueEvent('waiting')
  onQueued(jobId: string | number) {
    this.logger.info('Job queued', { jobId });
  }

  @OnQueueEvent('active')
  onActive(job: Job) {
    this.logger.info('Job active', {
      jobId: job.id,
      channel: job.name,
      ...(job.data?.userId && { userId: job.data.userId }),
    });
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    this.logger.info('Job completed', {
      jobId: job.id,
      channel: job.name,
      ...(job.data?.userId && { userId: job.data.userId }),
    });
  }

  @OnQueueEvent('failed')
  async onFailed(job: Job, error: Error) {
    this.logger.error('Job failed', {
      jobId: job.id,
      channel: job.name,
      ...(job.data?.userId && { userId: job.data.userId }),
      error: error.message,
      attemptsMade: job.attemptsMade,
    });

    const attempts = job.opts.attempts ?? 1;
    if (job.attemptsMade >= attempts) {
      this.logger.warn('Job moved to dead-letter queue', {
        jobId: job.id,
        channel: job.name,
        attempts: job.attemptsMade,
      });
      await this.dlqQueue.add(job.name, {
        originalJobId: job.id,
        data: job.data,
        failedAt: new Date().toISOString(),
        reason: error.message,
        attemptsMade: job.attemptsMade,
      });
    }
  }
}
