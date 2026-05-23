# Graph Report - notify-core  (2026-05-23)

## Corpus Check
- 47 files · ~4,245 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 279 nodes · 370 edges · 29 communities (17 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2cba1a1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_User Authentication Module|User Authentication Module]]
- [[_COMMUNITY_User Management & DTOs|User Management & DTOs]]
- [[_COMMUNITY_Linting and Testing Setup|Linting and Testing Setup]]
- [[_COMMUNITY_Notification Endpoints|Notification Endpoints]]
- [[_COMMUNITY_TypeScript Settings|TypeScript Settings]]
- [[_COMMUNITY_Core App Dependencies|Core App Dependencies]]
- [[_COMMUNITY_Unit Testing Setup|Unit Testing Setup]]
- [[_COMMUNITY_Health Check & App Root|Health Check & App Root]]
- [[_COMMUNITY_Build & Execution Scripts|Build & Execution Scripts]]
- [[_COMMUNITY_Redis Client & Cache|Redis Client & Cache]]
- [[_COMMUNITY_Prisma ORM & DB Client|Prisma ORM & DB Client]]
- [[_COMMUNITY_E2E Testing Settings|E2E Testing Settings]]
- [[_COMMUNITY_NestJS CLI Config|NestJS CLI Config]]
- [[_COMMUNITY_TypeScript Build Scope|TypeScript Build Scope]]
- [[_COMMUNITY_User Entity Model|User Entity Model]]
- [[_COMMUNITY_Nest CLI JSON|Nest CLI JSON]]
- [[_COMMUNITY_tsconfig.build.json Config|tsconfig.build.json Config]]
- [[_COMMUNITY_eslint.config.mjs Config|eslint.config.mjs Config]]
- [[_COMMUNITY_package.json Config|package.json Config]]
- [[_COMMUNITY_tsconfig.json Config|tsconfig.json Config]]
- [[_COMMUNITY_jest-e2e.json Config|jest-e2e.json Config]]
- [[_COMMUNITY_Database Initialization Migration|Database Initialization Migration]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `UserService` - 18 edges
3. `NotificationService` - 15 edges
4. `AuthService` - 14 edges
5. `scripts` - 13 edges
6. `PrismaService` - 13 edges
7. `NotificationController` - 12 edges
8. `UserController` - 11 edges
9. `RedisService` - 11 edges
10. `AuthController` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PrismaService` --conceptually_related_to--> `Prisma Database Access`  [INFERRED]
  src/prisma/prisma.service.ts → README.md
- `PrismaModule` --conceptually_related_to--> `Prisma Database Access`  [INFERRED]
  src/prisma/prisma.module.ts → README.md
- `AuthController` --conceptually_related_to--> `JWT Authentication Scheme`  [INFERRED]
  src/auth/auth.controller.ts → README.md
- `JwtAuthGuard` --conceptually_related_to--> `JWT Authentication Scheme`  [INFERRED]
  src/auth/jwt-auth.guard.ts → README.md
- `AuthService` --conceptually_related_to--> `JWT Authentication Scheme`  [INFERRED]
  src/auth/auth.service.ts → README.md

## Hyperedges (group relationships)
- **NestJS App Modules** — src_app_module_appmodule, notification_notification_module_notificationmodule, user_user_module_usermodule, auth_auth_module_authmodule, prisma_prisma_module_prismamodule, redis_redis_module_redismodule [INFERRED 0.95]

## Communities (29 total, 12 thin omitted)

### Community 0 - "User Authentication Module"
Cohesion: 0.11
Nodes (12): AuthController, dto, mockAuthService, mockLoginResponse, mockUser, AuthModule, AuthService, JwtAuthGuard (+4 more)

### Community 1 - "User Management & DTOs"
Cohesion: 0.12
Nodes (9): mockConfigService, mockJwtService, mockUser, mockUserService, CreateUserDto, UpdateUserDto, UserController, UserModule (+1 more)

### Community 2 - "Linting and Testing Setup"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest (+20 more)

### Community 3 - "Notification Endpoints"
Cohesion: 0.11
Nodes (8): CreateNotificationDto, UpdateNotificationDto, NotificationController, NotificationModule, EmailJobData, InAppJobData, NotificationProcessor, NotificationService

### Community 4 - "TypeScript Settings"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 5 - "Core App Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, bcrypt, bull, class-transformer, class-validator, ioredis, joi, @nestjs/bull (+14 more)

### Community 6 - "Unit Testing Setup"
Cohesion: 0.12
Nodes (15): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+7 more)

### Community 7 - "Health Check & App Root"
Cohesion: 0.22
Nodes (3): AppController, AppModule, AppService

### Community 8 - "Build & Execution Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 9 - "Redis Client & Cache"
Cohesion: 0.20
Nodes (5): NestJS Modular Architecture, Prisma Database Access, Redis Caching and Blacklist, RedisModule, RedisService

### Community 11 - "E2E Testing Settings"
Cohesion: 0.29
Nodes (6): moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$

### Community 12 - "NestJS CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (13): code:bash ($ npm install), code:bash (# development), code:bash (# unit tests), code:bash ($ npm install -g @nestjs/mau), Compile and run the project, Deployment, Description, License (+5 more)

## Knowledge Gaps
- **135 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `extends` (+130 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UserService` connect `User Management & DTOs` to `User Authentication Module`, `Prisma ORM & DB Client`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Linting and Testing Setup` to `Unit Testing Setup`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `PrismaService` connect `Prisma ORM & DB Client` to `User Management & DTOs`, `Notification Endpoints`, `Redis Client & Cache`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User Authentication Module` be split into smaller, more focused modules?**
  _Cohesion score 0.1053763440860215 - nodes in this community are weakly interconnected._
- **Should `User Management & DTOs` be split into smaller, more focused modules?**
  _Cohesion score 0.11576354679802955 - nodes in this community are weakly interconnected._
- **Should `Linting and Testing Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._