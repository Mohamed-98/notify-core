import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotificationConsumer } from './notification.consumer';
import { EmailService } from '../email/email.service';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationConsumer', () => {
  let consumer: NotificationConsumer;
  let emailService: jest.Mocked<EmailService>;
  let gateway: jest.Mocked<NotificationGateway>;

  const mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  const mockDlqQueue = { add: jest.fn() };

  const mockJob = (overrides = {}) => ({
    id: 'job-1',
    name: 'email',
    data: { to: 'test@example.com', subject: 'Hi', body: 'Hello' },
    opts: { attempts: 3 },
    attemptsMade: 0,
    ...overrides,
  });

  beforeEach(async () => {
    const mockEmailService = { sendEmail: jest.fn() };
    const mockGateway = { sendToUser: jest.fn() };
    const mockPrisma = {
      notification: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationConsumer,
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
        { provide: getQueueToken('notification-dlq'), useValue: mockDlqQueue },
        { provide: EmailService, useValue: mockEmailService },
        { provide: NotificationGateway, useValue: mockGateway },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    consumer = module.get<NotificationConsumer>(NotificationConsumer);
    emailService = module.get(EmailService);
    gateway = module.get(NotificationGateway);
  });

  describe('handleEmail', () => {
    it('should send email via EmailService', async () => {
      const job = mockJob();
      await consumer.handleEmail(job as any);
      expect(emailService.sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Hi',
        body: 'Hello',
        templateId: undefined,
        dynamicVars: undefined,
      });
    });

    it('should throw if recipient is missing', async () => {
      const job = mockJob({ data: {} });
      await expect(consumer.handleEmail(job as any)).rejects.toThrow('Missing recipient');
    });
  });

  describe('handleInApp', () => {
    it('should send in-app via gateway', async () => {
      const job = mockJob({
        name: 'in-app',
        data: { userId: 'user-1', message: 'Alert!' },
      });
      await consumer.handleInApp(job as any);
      expect(gateway.sendToUser).toHaveBeenCalledWith('user-1', { message: 'Alert!' });
    });

    it('should throw if userId is missing', async () => {
      const job = mockJob({ name: 'in-app', data: {} });
      await expect(consumer.handleInApp(job as any)).rejects.toThrow('Missing user ID');
    });
  });
});
