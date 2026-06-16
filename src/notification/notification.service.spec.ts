import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { NotificationProducer } from './notification.producer';
import { SendChannel } from './dto/send-notification.dto';

const mockPrisma = {
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

const mockUserService = {
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockProducer = {
  enqueueJob: jest.fn(),
};

describe('NotificationService', () => {
  let service: NotificationService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test',
    password: 'hash',
    preferences: { email: true, inApp: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotification = {
    id: 'notif-1',
    userId: 'user-1',
    type: 'info',
    channel: 'IN_APP',
    status: 'PENDING',
    payload: { message: 'hello' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UserService, useValue: mockUserService },
        { provide: NotificationProducer, useValue: mockProducer },
      ],
    }).compile();
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      await expect(
        service.send({ userId: 'bad-id', channel: SendChannel.EMAIL, message: 'hi' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should enqueue email job when channel is EMAIL', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockPrisma.notification.create.mockResolvedValue({ id: 'notif-email-1' });
      mockProducer.enqueueJob.mockResolvedValue({ id: 'job-1' });

      const result = await service.send({
        userId: 'user-1',
        channel: SendChannel.EMAIL,
        message: 'hello',
        subject: 'Greeting',
      });

      expect(mockProducer.enqueueJob).toHaveBeenCalledWith('email', {
        notificationId: 'notif-email-1',
        to: 'test@example.com',
        subject: 'Greeting',
        body: 'hello',
      });
      expect(result).toEqual({
        success: true,
        enqueuedJobs: [
          { type: 'email', jobId: 'job-1', notificationId: 'notif-email-1' },
        ],
      });
    });

    it('should enqueue in-app job when channel is IN_APP', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockPrisma.notification.create.mockResolvedValue({ id: 'notif-inapp-1' });
      mockProducer.enqueueJob.mockResolvedValue({ id: 'job-2' });

      const result = await service.send({
        userId: 'user-1',
        channel: SendChannel.IN_APP,
        message: 'hello',
      });

      expect(mockProducer.enqueueJob).toHaveBeenCalledWith('in-app', {
        notificationId: 'notif-inapp-1',
        userId: 'user-1',
        message: 'hello',
      });
      expect(result).toEqual({
        success: true,
        enqueuedJobs: [
          { type: 'in-app', jobId: 'job-2', notificationId: 'notif-inapp-1' },
        ],
      });
    });

    it('should enqueue both when channel is BOTH', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockPrisma.notification.create
        .mockResolvedValueOnce({ id: 'notif-email-1' })
        .mockResolvedValueOnce({ id: 'notif-inapp-1' });
      mockProducer.enqueueJob
        .mockResolvedValueOnce({ id: 'job-1' })
        .mockResolvedValueOnce({ id: 'job-2' });

      const result = await service.send({
        userId: 'user-1',
        channel: SendChannel.BOTH,
        message: 'hello',
      });

      expect(mockProducer.enqueueJob).toHaveBeenCalledTimes(2);
      expect(result.enqueuedJobs).toEqual([
        { type: 'email', jobId: 'job-1', notificationId: 'notif-email-1' },
        { type: 'in-app', jobId: 'job-2', notificationId: 'notif-inapp-1' },
      ]);
    });

    it('should skip email when user preference is false', async () => {
      mockUserService.findOne.mockResolvedValue({
        ...mockUser,
        preferences: { email: false, inApp: true },
      });

      const result = await service.send({
        userId: 'user-1',
        channel: SendChannel.EMAIL,
        message: 'hello',
      });

      expect(mockProducer.enqueueJob).not.toHaveBeenCalled();
      expect(result.enqueuedJobs).toEqual([
        { type: 'email', status: 'skipped_by_preference' },
      ]);
    });
  });

  describe('create', () => {
    it('should create notification via prisma', async () => {
      mockPrisma.notification.create.mockResolvedValue(mockNotification);
      const result = await service.create({
        userId: 'user-1',
        type: 'info',
        channel: 'IN_APP' as any,
        payload: { message: 'hello' },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('findAll', () => {
    it('should return all notifications with user info', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([mockNotification]);
      const result = await service.findAll();
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        include: { user: { select: { id: true, email: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockNotification]);
    });
  });

  describe('findOne', () => {
    it('should return notification if found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      const result = await service.findOne('notif-1');
      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findPaginatedByUser', () => {
    it('should return paginated results', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([mockNotification]);
      mockPrisma.notification.count.mockResolvedValue(1);
      const result = await service.findPaginatedByUser('user-1', 1, 10);
      expect(result).toEqual({
        data: [mockNotification],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });
  });

  describe('markAsRead', () => {
    it('should update status to READ', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.update.mockResolvedValue({
        ...mockNotification,
        status: 'READ',
      });
      const result = await service.markAsRead('notif-1');
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { status: 'READ' },
      });
      expect(result.status).toBe('READ');
    });
  });

  describe('update', () => {
    it('should update notification fields', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.update.mockResolvedValue({
        ...mockNotification,
        type: 'alert',
      });
      const result = await service.update('notif-1', { type: 'alert' } as any);
      expect(result.type).toBe('alert');
    });
  });

  describe('remove', () => {
    it('should delete notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.delete.mockResolvedValue(mockNotification);
      await service.remove('notif-1');
      expect(mockPrisma.notification.delete).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
      });
    });
  });
});
