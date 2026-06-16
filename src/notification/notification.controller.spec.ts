import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: jest.Mocked<NotificationService>;

  const mockService = {
    send: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUser: jest.fn(),
    findPaginatedByUser: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    markAsRead: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [{ provide: NotificationService, useValue: mockService }],
    }).compile();
    controller = module.get<NotificationController>(NotificationController);
    service = module.get(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('send', () => {
    it('should delegate to service.send', async () => {
      const dto = { userId: 'u1', channel: 'email' as any, message: 'hi' };
      mockService.send.mockResolvedValue({ success: true, enqueuedJobs: [] });
      await controller.send(dto);
      expect(mockService.send).toHaveBeenCalledWith(dto);
    });
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto = { userId: 'u1', type: 'info', channel: 'IN_APP' as any, payload: {} };
      mockService.create.mockResolvedValue({ id: 'n1' } as any);
      await controller.create(dto);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      mockService.findAll.mockResolvedValue([]);
      await controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should delegate to service.markAsRead', async () => {
      mockService.markAsRead.mockResolvedValue({ id: 'n1', status: 'READ' } as any);
      await controller.markAsRead('n1');
      expect(mockService.markAsRead).toHaveBeenCalledWith('n1');
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      mockService.findOne.mockResolvedValue({ id: 'n1' } as any);
      await controller.findOne('n1');
      expect(mockService.findOne).toHaveBeenCalledWith('n1');
    });
  });

  describe('update', () => {
    it('should delegate to service.update', async () => {
      mockService.update.mockResolvedValue({ id: 'n1' } as any);
      await controller.update('n1', { type: 'alert' } as any);
      expect(mockService.update).toHaveBeenCalledWith('n1', { type: 'alert' });
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove', async () => {
      mockService.remove.mockResolvedValue({ id: 'n1' } as any);
      await controller.remove('n1');
      expect(mockService.remove).toHaveBeenCalledWith('n1');
    });
  });
});
