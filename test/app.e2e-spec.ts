import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotificationProducer } from '../src/notification/notification.producer';
import { JwtService } from '@nestjs/jwt';

describe('Notification (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NotificationProducer)
      .useValue({ enqueueJob: jest.fn().mockResolvedValue({ id: 'mock-job' }) })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);
    authToken = jwtService.sign({ sub: 'e2e-user', email: 'e2e@test.com' });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /notifications/send', () => {
    it('should return 401 without token', async () => {
      await supertest(app.getHttpServer())
        .post('/notifications/send')
        .send({ userId: 'u1', channel: 'email', message: 'test' })
        .expect(401);
    });

    it('should return 201 and enqueue job', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'u1',
        email: 'e2e@test.com',
        name: 'E2E User',
        password: 'hash',
        preferences: { email: true, inApp: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const res = await supertest(app.getHttpServer())
        .post('/notifications/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 'u1', channel: 'email', message: 'E2E test' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.enqueuedJobs).toBeDefined();
    });
  });

  describe('GET /notifications/me', () => {
    it('should return paginated notifications', async () => {
      jest.spyOn(prisma.notification, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.notification, 'count').mockResolvedValue(0);

      const res = await supertest(app.getHttpServer())
        .get('/notifications/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.meta).toBeDefined();
    });
  });
});
