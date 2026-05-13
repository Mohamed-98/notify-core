import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as net from 'net';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisCheck = await this.checkConnection(redisHost, redisPort);
    let pgHost = 'localhost';
    let pgPort = 5432;
    if (process.env.DATABASE_URL) {
      try {
        const dbUrl = new URL(process.env.DATABASE_URL);
        pgHost = dbUrl.hostname;
        pgPort = parseInt(dbUrl.port || '5432', 10);
      } catch (e) {
        // ignore parsing error
      }
    }
    const pgCheck = await this.checkConnection(pgHost, pgPort);

    return {
      status: 'ok',
      redis: redisCheck ? 'up' : 'down',
      postgres: pgCheck ? 'up' : 'down',
    };
  }

  private checkConnection(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2000);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.on('error', () => {
        resolve(false);
      });
      socket.connect(port, host);
    });
  }
}
