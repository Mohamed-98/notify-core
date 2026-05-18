import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TokenBlacklistMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const isBlacklisted = await this.redisService.exists(`blacklist:${token}`);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been blacklisted (logged out)');
      }
    }
    next();
  }
}
