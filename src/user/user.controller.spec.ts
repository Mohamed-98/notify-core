import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockService }],
    }).compile();
    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto = { email: 'test@test.com', password: 'secret', name: 'Test' };
      mockService.create.mockResolvedValue({ id: 'u1' } as any);
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

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      mockService.findOne.mockResolvedValue({ id: 'u1' } as any);
      await controller.findOne('u1');
      expect(mockService.findOne).toHaveBeenCalledWith('u1');
    });
  });

  describe('update', () => {
    it('should delegate to service.update', async () => {
      mockService.update.mockResolvedValue({ id: 'u1' } as any);
      await controller.update('u1', { name: 'New' } as any);
      expect(mockService.update).toHaveBeenCalledWith('u1', { name: 'New' });
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove', async () => {
      mockService.remove.mockResolvedValue({ id: 'u1' } as any);
      await controller.remove('u1');
      expect(mockService.remove).toHaveBeenCalledWith('u1');
    });
  });
});
