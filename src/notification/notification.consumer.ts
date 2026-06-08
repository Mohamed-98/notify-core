import { Process, Processor, OnQueueFailed, InjectQueue } from '@nestjs/bull';
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
    @InjectQueue('notification-dlq') private readonly dlqQueue: Queue,
    private readonly emailService: EmailService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Process('email')
  async handleEmail(job: Job<EmailJobData>) {
    console.log('Processing email:', job.data);
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
    console.log('Processing in-app:', job.data);
    const { userId, message } = job.data;
    if (!userId) {
      throw new Error('Missing user ID');
    }
    this.notificationGateway.sendToUser(userId, { message });
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: Error) {
    const attempts = job.opts.attempts ?? 1;
    if (job.attemptsMade >= attempts) {
      console.error(
        `Job ${job.id} of type ${job.name} failed permanently after ${attempts} attempts. Error: ${error.message}. Moving to dead-letter queue.`,
      );
      await this.dlqQueue.add(job.name, {
        originalJobId: job.id,
        data: job.data,
        failedAt: new Date().toISOString(),
        reason: error.message,
        attemptsMade: job.attemptsMade,
      });
    } else {
      console.warn(
        `Job ${job.id} of type ${job.name} failed. Attempt ${job.attemptsMade}/${attempts}. Error: ${error.message}. Retrying...`,
      );
    }
  }
}
