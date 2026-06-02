# Graph Report - .  (2026-06-02)

## Corpus Check
<<<<<<< HEAD
- 3 files · ~4,448 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 259 nodes · 282 edges · 27 communities (15 shown, 12 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

=======
- 48 files · ~4,448 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 291 nodes · 428 edges · 26 communities (14 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e333da4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

>>>>>>> 8e333da (chore: update graph visualization, report, and labels to reflect system structure changes)
## Community Hubs (Navigation)
- [[_COMMUNITY_Testing & Mock Setup|Testing & Mock Setup]]
- [[_COMMUNITY_Dev Tooling & ESLint|Dev Tooling & ESLint]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Core Dependencies|Core Dependencies]]
- [[_COMMUNITY_Auth Module|Auth Module]]
- [[_COMMUNITY_App Bootstrap & Health|App Bootstrap & Health]]
- [[_COMMUNITY_Notification CRUD|Notification CRUD]]
- [[_COMMUNITY_Queue Consumers|Queue Consumers]]
- [[_COMMUNITY_Jest Test Config|Jest Test Config]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Redis Service|Redis Service]]
- [[_COMMUNITY_E2E Test Config|E2E Test Config]]
- [[_COMMUNITY_Nest CLI Config|Nest CLI Config]]
- [[_COMMUNITY_TS Build Config|TS Build Config]]
- [[_COMMUNITY_User Entity|User Entity]]
- [[_COMMUNITY_Agent Rules Graphify|Agent Rules: Graphify]]
- [[_COMMUNITY_Agent Workflows Graphify|Agent Workflows: Graphify]]
- [[_COMMUNITY_Nest CLI Config|Nest CLI Config]]
- [[_COMMUNITY_TS Build Config|TS Build Config]]
- [[_COMMUNITY_ESLint Root Config|ESLint Root Config]]
- [[_COMMUNITY_Package Config|Package Config]]
- [[_COMMUNITY_TS Root Config|TS Root Config]]
- [[_COMMUNITY_E2E Jest Config|E2E Jest Config]]
- [[_COMMUNITY_DB Migration|DB Migration]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `UserService` - 15 edges
3. `scripts` - 13 edges
4. `jest` - 9 edges
5. `NotificationConsumer` - 6 edges
6. `JWT Authentication Scheme` - 5 edges
7. `NotificationProducer` - 4 edges
8. `Prisma Database Access` - 4 edges
9. `Redis Caching and Blacklist` - 4 edges
10. `compilerOptions` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (26 total, 12 thin omitted)

### Community 0 - "Testing & Mock Setup"
Cohesion: 0.13
Nodes (6): Prisma Database Access, CreateUserDto, UpdateUserDto, PrismaService, UserController, UserService

### Community 1 - "Dev Tooling & ESLint"
Cohesion: 0.07
Nodes (29): devDependencies, dotenv, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals (+21 more)

### Community 2 - "TypeScript Compiler Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 3 - "Core Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, bcrypt, bull, class-transformer, class-validator, ioredis, joi, @nestjs/bull (+14 more)

### Community 4 - "Auth Module"
Cohesion: 0.13
Nodes (14): AuthController, dto, mockAuthService, mockLoginResponse, mockUser, AuthService, mockConfigService, mockJwtService (+6 more)

### Community 5 - "App Bootstrap & Health"
Cohesion: 0.15
Nodes (8): AuthModule, JwtStrategy, PrismaModule, RedisModule, AppController, AppModule, AppService, UserModule

### Community 6 - "Notification CRUD"
Cohesion: 0.20
Nodes (4): CreateNotificationDto, UpdateNotificationDto, NotificationController, NotificationService

### Community 7 - "Queue Consumers"
<<<<<<< HEAD
Cohesion: 0.12
Nodes (5): EmailJobData, InAppJobData, EmailJobData, InAppJobData, EnqueueJobOptions
=======
Cohesion: 0.14
Nodes (8): EmailJobData, InAppJobData, NotificationConsumer, NotificationModule, EmailJobData, InAppJobData, EnqueueJobOptions, NotificationProducer
>>>>>>> 8e333da (chore: update graph visualization, report, and labels to reflect system structure changes)

### Community 8 - "Jest Test Config"
Cohesion: 0.07
Nodes (28): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+20 more)

### Community 9 - "Project Documentation"
Cohesion: 0.13
Nodes (14): NestJS Modular Architecture, code:bash ($ npm install), code:bash (# development), code:bash (# unit tests), code:bash ($ npm install -g @nestjs/mau), Compile and run the project, Deployment, Description (+6 more)

### Community 12 - "E2E Test Config"
Cohesion: 0.29
Nodes (6): moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$

### Community 13 - "Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **139 isolated node(s):** `EmailJobData`, `InAppJobData`, `NotificationModule`, `EnqueueJobOptions`, `$schema` (+134 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling & ESLint` to `Jest Test Config`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Core Dependencies` to `Jest Test Config`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `UserService` connect `Testing & Mock Setup` to `Auth Module`, `App Bootstrap & Health`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `EmailJobData`, `InAppJobData`, `NotificationModule` to the rest of the system?**
  _139 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Testing & Mock Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.12688172043010754 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling & ESLint` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._