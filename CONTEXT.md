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

- 🔄 Phase 1 — Project setup & scaffold
  - ✅ Init NestJS project with Nest CLI
  - ✅ Configure ESLint, Prettier, tsconfig paths
  - ✅ Set up docker-compose with app, Postgres, Redis services
  - ✅ Configure environment variables with @nestjs/config and .env.example
  - ⬜ Verify app boots and connects to Postgres + Redis via health check
- ⬜ Phase 2 — Database & data layer
  - ⬜ Set up TypeORM module with async config
  - ⬜ Design and create User entity
  - ⬜ Design and create Notification entity (userId, type, channel, status, payload)
  - ⬜ Write and run initial migrations
  - ⬜ Create repositories and service skeletons for each entity
- ⬜ Phase 3 — Auth & user context
  - ⬜ Implement register and login endpoints with bcrypt password hashing
  - ⬜ Issue access token (short TTL) + refresh token (long TTL)
  - ⬜ Implement JWT validation and user extraction inside AuthService
  - ⬜ Implement logout with Redis token blacklist
  - ⬜ Create JwtAuthGuard and attach to protected routes
- ⬜ Phase 4 — Bull / Redis queues
  - ⬜ Install and configure @nestjs/bull with Redis connection
  - ⬜ Create notification.queue and define job types (email, in-app)
  - ⬜ Implement NotificationProducer to enqueue jobs with priority/delay support
  - ⬜ Implement NotificationConsumer with @Process handlers per job type
  - ⬜ Add retry logic and dead-letter handling for failed jobs
- ⬜ Phase 5 — Email channel — SendGrid
  - ⬜ Install @sendgrid/mail and create EmailService
  - ⬜ Build sendEmail() with template support (subject, body, dynamic vars)
  - ⬜ Wire email job consumer to EmailService
  - ⬜ Test real email delivery in dev with a sandbox/verified sender
- ⬜ Phase 6 — WebSocket — real-time
  - ⬜ Create NotificationGateway with @WebSocketGateway()
  - ⬜ Implement JWT handshake auth in handleConnection()
  - ⬜ Map authenticated users to socket IDs in-memory (or via Redis)
  - ⬜ Implement server.to(socketId).emit() for targeted delivery
  - ⬜ Handle client client disconnect and clean up socket map
- ⬜ Phase 7 — Notification logic & API
  - ⬜ Create POST /notifications/send — enqueues job based on channel (email | in-app | both)
  - ⬜ Create GET /notifications/me — paginated list of user's notifications
  - ⬜ Create PATCH /notifications/:id/read — mark as read
  - ⬜ Implement preference-aware routing (user can opt out of channels)
  - ⬜ Validate all DTOs with class-validator, add Swagger decorators
- ⬜ Phase 8 — Logging — Winston
  - ⬜ Install nest-winston and configure transports (console + file)
  - ⬜ Add structured log fields: requestId, userId, channel, jobId
  - ⬜ Add HTTP request logging middleware (method, path, status, latency)
  - ⬜ Log all queue job lifecycle events (queued, processing, done, failed)
- ⬜ Phase 9 — Testing — Jest
  - ⬜ Unit test NotificationService with mocked repos and queue
  - ⬜ Unit test EmailService with mocked SendGrid client
  - ⬜ Unit test NotificationGateway auth and emit logic
  - ⬜ Integration test queue → consumer → delivery flow
  - ⬜ E2E test: POST /send → job processed → notification persisted + delivered
- ⬜ Phase 10 — Error handling & resilience
  - ⬜ Create global HttpExceptionFilter for consistent error shape
  - ⬜ Add rate limiting on send endpoint (throttler guard)
  - ⬜ Implement circuit breaker or fallback for SendGrid outages
  - ⬜ Handle WebSocket errors and reconnect gracefully on client side
- ⬜ Phase 11 — DevOps & final polish
  - ⬜ Multi-stage Dockerfile (build → production image)
  - ⬜ Finalize docker-compose with healthchecks and depends_on ordering
  - ⬜ Add GitHub Actions CI: lint → test → build on every PR
  - ⬜ Write README: architecture overview, setup guide, env vars table, API reference
  - ⬜ Add Swagger UI at /api/docs with full schema coverage

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
