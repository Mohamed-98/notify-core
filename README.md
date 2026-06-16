# notify-core

Notification & Alert Service built with NestJS, Bull, Prisma, SendGrid, and WebSockets.

## Architecture

```
Client → REST API → NotificationService → Bull Queue → Consumer → SendGrid / WebSocket
         ↑                          ↓
         └── JWT Auth ────── UserService ── Prisma (Postgres)
```

- **REST API** — NestJS controllers with JWT auth
- **Queue** — Bull via Redis for reliable async delivery
- **Email** — SendGrid with template support and circuit breaker
- **Real-time** — Socket.io gateway for in-app delivery
- **Database** — PostgreSQL via Prisma ORM

## Setup

```bash
cp .env.example .env
# Edit .env with your values
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `SENDGRID_API_KEY` | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Verified sender email for SendGrid |
| `PORT` | App port (default 3001) |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/auth/logout` | JWT | Logout, blacklists token |
| POST | `/notifications/send` | JWT | Send notification via email/in-app/both |
| GET | `/notifications/me` | JWT | List my notifications (paginated) |
| GET | `/notifications` | JWT | List all notifications |
| GET | `/notifications/user/:userId` | JWT | Get notifications for a user |
| GET | `/notifications/:id` | JWT | Get notification details |
| PATCH | `/notifications/:id/read` | JWT | Mark as read |
| PATCH | `/notifications/:id` | JWT | Update a notification |
| DELETE | `/notifications/:id` | JWT | Delete a notification |
| POST | `/user` | JWT | Create a user |
| GET | `/user` | JWT | List all users |
| GET | `/user/:id` | JWT | Get user by ID |
| PATCH | `/user/:id` | JWT | Update user |
| DELETE | `/user/:id` | JWT | Delete user |
| GET | `/health` | No | Health check (Redis + Postgres) |
| GET | `/api/docs` | No | Swagger UI |

## WebSocket Client

```typescript
import { io, Socket } from 'socket.io-client';

let socket: Socket;

function connect(token: string) {
  socket = io('http://localhost:3001', {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  socket.on('connect', () => console.log('Connected'));
  socket.on('notification', (data) => console.log('Notification:', data));
  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      connect(token);
    }
  });
  socket.on('connect_error', (err) => console.error('WS error:', err.message));
}
```

## Testing

```bash
npm test          # unit tests
npm run test:e2e  # e2e tests
npm run test:cov  # coverage
```

## Docker

```bash
docker compose up --build
```
