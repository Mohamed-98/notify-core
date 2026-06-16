import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import * as net from 'net';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    const redisHost = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const redisPort = this.configService.get<number>('REDIS_PORT') || 6379;
    const redisCheck = await this.checkConnection(redisHost, redisPort);

    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    let pgHost = 'localhost';
    let pgPort = 5432;
    if (databaseUrl) {
      try {
        const dbUrl = new URL(databaseUrl);
        pgHost = dbUrl.hostname;
        pgPort = parseInt(dbUrl.port || '5432', 10);
      } catch {
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
