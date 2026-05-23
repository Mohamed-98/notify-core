import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

export type EmailJobData = { to: string; subject: string; body: string };
export type InAppJobData = { userId: string; message: string };

@Processor('notification')
export class NotificationProcessor {
  @Process('email')
  async handleEmail(job: Job<EmailJobData>) {
    console.log('Processing email:', job.data);
  }

  @Process('in-app')
  async handleInApp(job: Job<InAppJobData>) {
    console.log('Processing in-app:', job.data);
  }
}
