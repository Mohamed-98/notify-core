import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { NotificationGateway } from './notification.gateway';

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;
  let jwtService: jest.Mocked<JwtService>;

  const mockSocket = {
    id: 'socket-1',
    handshake: {
      headers: {},
      auth: {},
    },
    data: {},
    disconnect: jest.fn(),
  } as unknown as jest.Mocked<Socket>;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  } as unknown as jest.Mocked<Server>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockJwtService = {
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationGateway,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    gateway = module.get<NotificationGateway>(NotificationGateway);
    jwtService = module.get(JwtService);
    gateway.server = mockServer;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should disconnect if no token provided', async () => {
      await gateway.handleConnection(mockSocket);
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should disconnect if token verification fails', async () => {
      mockSocket.handshake.auth = { token: 'bad-token' };
      jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));
      await gateway.handleConnection(mockSocket);
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should map userId to socket on valid token', async () => {
      mockSocket.handshake.auth = { token: 'valid-token' };
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });
      await gateway.handleConnection(mockSocket);
      expect(mockSocket.data).toEqual({ userId: 'user-1' });
    });
  });

  describe('handleDisconnect', () => {
    it('should remove socket from map', () => {
      mockSocket.data = { userId: 'user-1' };
      gateway['userSocketMap'].set('user-1', 'socket-1');
      gateway.handleDisconnect(mockSocket);
      expect(gateway['userSocketMap'].has('user-1')).toBe(false);
    });
  });

  describe('sendToUser', () => {
    it('should emit to connected user', () => {
      gateway['userSocketMap'].set('user-1', 'socket-1');
      gateway.sendToUser('user-1', { message: 'hello' });
      expect(mockServer.to).toHaveBeenCalledWith('socket-1');
      expect(mockServer.emit).toHaveBeenCalledWith('notification', { message: 'hello' });
    });

    it('should not emit if user not connected', () => {
      gateway.sendToUser('offline-user', { message: 'hello' });
      expect(mockServer.to).not.toHaveBeenCalled();
    });
  });
});
