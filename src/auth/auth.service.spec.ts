import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockUserService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      decode: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('mock-secret'),
    };

    const mockRedisService = {
      set: jest.fn(),
      get: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if email is already registered', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userService.create).not.toHaveBeenCalled();
    });

    it('should successfully register a user and return user details without password', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue(mockUser as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result).toEqual({
        id: 'user-uuid',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });

    it('should successfully login and return tokens + user without password', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        user: {
          id: 'user-uuid',
          email: 'test@example.com',
          name: 'Test User',
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
