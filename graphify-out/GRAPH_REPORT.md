# Graph Report - notify-core  (2026-06-17)

## Corpus Check
- 57 files · ~8,529 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 338 nodes · 463 edges · 20 communities (14 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `92172a80`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `UserService` - 16 edges
3. `NotificationService` - 15 edges
4. `scripts` - 13 edges
5. `NotificationController` - 13 edges
6. `NotificationGateway` - 10 edges
7. `NotificationConsumer` - 10 edges
8. `AuthService` - 10 edges
9. `PrismaService` - 10 edges
10. `EmailService` - 9 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (20 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (29): devDependencies, dotenv, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals (+21 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (16): AuthController, dto, mockAuthService, mockLoginResponse, mockUser, AuthService, mockConfigService, mockJwtService (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (7): AuthModule, JwtStrategy, LoggerMiddleware, NotificationModule, AppController, AppService, UserModule

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (15): CreateNotificationDto, SendChannel, SendNotificationDto, UpdateNotificationDto, dto, mockService, EnqueueJobOptions, NotificationProducer (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (9): CreateUserDto, UpdateUserDto, dto, mockService, UserController, dto, mockPrisma, mockUser (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (29): dependencies, bcrypt, bull, class-transformer, class-validator, ioredis, joi, nest-winston (+21 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (16): EmailModule, CircuitState, EmailService, err, EmailJobData, InAppJobData, NotificationConsumer, job (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (28): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+20 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (13): API Endpoints, Architecture, code:block1 (Client → REST API → NotificationService → Bull Queue → Consu), code:bash (cp .env.example .env), code:typescript (import { io, Socket } from 'socket.io-client';), code:bash (npm test          # unit tests), code:bash (docker compose up --build), Docker (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **156 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `extends` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UserService` connect `Community 4` to `Community 1`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `NotificationService` connect `Community 12` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 5` to `Community 8`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _156 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07422402159244265 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._