import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

export interface EnqueueJobOptions {
  priority?: number;
  delay?: number;
}

@Injectable()
export class NotificationProducer {
  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  async enqueueJob(name: 'email' | 'in-app', data: any, options?: EnqueueJobOptions) {
    return this.notificationQueue.add(name, data, {
      priority: options?.priority,
      delay: options?.delay,
    });
  }
}
