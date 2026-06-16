import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    id: 'u1',
    email: 'test@example.com',
    password: 'hash',
    name: 'Test',
    preferences: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      mockPrisma.user.create.mockResolvedValue(mockUser);
      const dto = { email: 'test@example.com', password: 'hash', name: 'Test' };
      const result = await service.create(dto as any);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockPrisma.user.findMany.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOne('u1');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'u1' } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, name: 'Updated' });
      const result = await service.update('u1', { name: 'Updated' } as any);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({ where: { id: 'u1' }, data: { name: 'Updated' } });
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockPrisma.user.delete.mockResolvedValue(mockUser);
      await service.remove('u1');
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
    });
  });
});
