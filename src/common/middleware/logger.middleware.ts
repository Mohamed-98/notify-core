import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const requestId = randomUUID();
    (req as any).requestId = requestId;

    res.on('finish', () => {
      const latency = Date.now() - start;
      this.logger.info('HTTP Request', {
        requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: res.statusCode,
        latency: `${latency}ms`,
      });
    });

    next();
  }
}
