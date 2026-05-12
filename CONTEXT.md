# Notification & Alert Service — Project Context

## Stack

- **Framework**: NestJS
- **ORM**: Prisma (or TypeORM)
- **Queue**: Bull / Redis
- **Real-time**: WebSockets (Socket.io)
- **Email**: SendGrid
- **Logging**: Winston
- **Testing**: Jest
- **Node**: v24 (Assuming consistent with DevBoard)

## Current Status

- ⬜ Phase 1 — Project setup & scaffold
  - ⬜ Init NestJS project with CLI
  - ⬜ Set up monorepo or single-service structure
  - ⬜ Configure .env and ConfigModule
  - ⬜ Set up Docker + docker-compose (app, Redis)
  - ⬜ Add ESLint + Prettier config
  - ⬜ Initialize Git repo + .gitignore
- ⬜ Phase 2 — Database & data layer
  - ⬜ Choose and wire ORM
  - ⬜ Design notification schema (id, userId, channel, type, payload, status, createdAt, readAt)
  - ⬜ Create and run initial migration
  - ⬜ Seed script for dev/test data
- ⬜ Phase 3 — Auth & user context
  - ⬜ JWT auth guard
  - ⬜ CurrentUser decorator
  - ⬜ Guard applied globally/per-module
  - ⬜ Logout endpoint + token invalidation strategy
- ⬜ Phase 4 — Bull/Redis queues
  - ⬜ Install @nestjs/bull, bull, ioredis
  - ⬜ Configure BullModule with Redis connection
  - ⬜ Define queue names as constants
  - ⬜ NotificationProducer: addJob() method
  - ⬜ NotificationConsumer: @Process() handlers (email, push, in-app)
  - ⬜ Failed job handling (retries, backoff)
- ⬜ Phase 5 — Email channel — SendGrid
  - ⬜ Install @sendgrid/mail
  - ⬜ EmailService: sendEmail()
  - ⬜ Store SendGrid API key in env
  - ⬜ Dynamic templates / HTML fallback
  - ⬜ Error handling + queue failure events
- ⬜ Phase 6 — WebSocket — real-time
  - ⬜ Install @nestjs/websockets, socket.io
  - ⬜ NotificationsGateway with CORS
  - ⬜ Authenticate WS connection (JWT)
  - ⬜ User-specific rooms (socket.join(userId))
  - ⬜ Push in-app notifications to rooms
  - ⬜ Emit typed events (notification:new, notification:read)
- ⬜ Phase 7 — Notification logic & API
  - ⬜ NotificationsModule assembly
  - ⬜ POST /notifications/send (enqueue job)
  - ⬜ GET /notifications (paginated list)
  - ⬜ PATCH /notifications/:id/read
  - ⬜ PATCH /notifications/read-all
  - ⬜ DELETE /notifications/:id
  - ⬜ DTOs with class-validator
- ⬜ Phase 8 — Logging — Winston
  - ⬜ WinstonModule setup
  - ⬜ Log levels (env-controlled)
  - ⬜ Structured JSON logging for prod
  - ⬜ Log job lifecycle and SendGrid/WS events
  - ⬜ Request/response interceptor
- ⬜ Phase 9 — Testing — Jest
  - ⬜ Unit tests: NotificationsService (mocked producer)
  - ⬜ Unit tests: NotificationConsumer (mock SendGrid, mock WS)
  - ⬜ Unit tests: EmailService (mock SendGrid)
  - ⬜ Integration tests for Send and Read endpoints
  - ⬜ E2E test: full flow (enqueue → consumer → WS emit)
  - ⬜ Coverage threshold (min 80%)
- ⬜ Phase 10 — Error handling & resilience
  - ⬜ Global exception filter (HTTP + WS)
  - ⬜ Unhandled Bull job errors handling
  - ⬜ Rate limiting (throttler)
  - ⬜ Circuit breaker pattern for SendGrid
  - ⬜ Graceful shutdown (queue flushing)
- ⬜ Phase 11 — DevOps & final polish
  - ⬜ Multi-stage Dockerfile
  - ⬜ docker-compose.yml: app + Redis
  - ⬜ Health check endpoint (GET /health)
  - ⬜ Environment-specific configs
  - ⬜ Swagger docs (OpenAPI)
  - ⬜ CI pipeline (GitHub Actions)

## Key Decisions & Workarounds

### Queue Strategy
- Use **Bull** for reliable background processing.
- Separate queues/jobs for different channels (email, web, push) to allow independent scaling and failure handling.

### WebSocket Authentication
- JWT validation must happen during the **handshake** phase to prevent unauthorized connections.
- Rooms are keyed by `userId` to ensure private delivery of notifications.

### Email Integration
- **SendGrid** is the primary provider.
- Failure to send emails should trigger a retry in the Bull queue with exponential backoff.

### Logging
- Use **Winston** for structured logging.
- Essential for tracking job status in production and debugging failed delivery attempts.

## .env Template

```
DATABASE_URL="postgresql://user:pass@localhost:5432/notify_db"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_key
SENDGRID_API_KEY=your_sendgrid_key
PORT=3001
```

## Project Structure

```
notify-core/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── auth/
│   ├── common/          ← Guards, Decorators, Filters
│   ├── notifications/
│   │   ├── consumers/
│   │   ├── producers/
│   │   ├── gateway/
│   │   └── dto/
│   ├── email/
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml
├── .env
└── README.md
```
