import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    name: 'Test User',
    preferences: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLoginResponse = {
    user: mockUser,
    tokens: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    },
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return the registered user', async () => {
      service.register.mockResolvedValue(mockUser);

      const dto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should call authService.login and return the login response', async () => {
      service.login.mockResolvedValue(mockLoginResponse);

      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with bearer token', async () => {
      service.logout.mockResolvedValue(undefined);

      const result = await controller.logout('Bearer some-token');

      expect(service.logout).toHaveBeenCalledWith('some-token');
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should throw on missing auth header', async () => {
      await expect(controller.logout('')).rejects.toThrow('No token provided');
    });
  });
});
