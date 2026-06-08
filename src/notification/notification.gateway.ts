import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly userSocketMap = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      const token = client.handshake.auth?.token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;
      if (userId) {
        this.userSocketMap.set(userId, client.id);
        client.data = { userId };
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId && this.userSocketMap.get(userId) === client.id) {
      this.userSocketMap.delete(userId);
    }
  }

  sendToUser(userId: string, data: any) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', data);
    }
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
