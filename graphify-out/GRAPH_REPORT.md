# Graph Report - notify-core  (2026-06-02)

## Corpus Check
- 48 files · ~4,319 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 259 nodes · 285 edges · 27 communities (15 shown, 12 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a89d7e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_User Management & DTOs|User Management & DTOs]]
- [[_COMMUNITY_Linting and Testing Setup|Linting and Testing Setup]]
- [[_COMMUNITY_TypeScript Settings|TypeScript Settings]]
- [[_COMMUNITY_Core App Dependencies|Core App Dependencies]]
- [[_COMMUNITY_User Authentication Module|User Authentication Module]]
- [[_COMMUNITY_package.json Config|package.json Config]]
- [[_COMMUNITY_README Documentation|README Documentation]]
- [[_COMMUNITY_Notification Queue & Consumers|Notification Queue & Consumers]]
- [[_COMMUNITY_Build & Execution Scripts|Build & Execution Scripts]]
- [[_COMMUNITY_Redis Client & Cache|Redis Client & Cache]]
- [[_COMMUNITY_E2E Testing Settings|E2E Testing Settings]]
- [[_COMMUNITY_NestJS CLI Config|NestJS CLI Config]]
- [[_COMMUNITY_tsconfig.build.json Config|tsconfig.build.json Config]]
- [[_COMMUNITY_User Entity Model|User Entity Model]]
- [[_COMMUNITY_Graphify Rules|Graphify Rules]]
- [[_COMMUNITY_Graphify Workflows|Graphify Workflows]]
- [[_COMMUNITY_Nest CLI Config Node|Nest CLI Config Node]]
- [[_COMMUNITY_tsconfig.build Config Node|tsconfig.build Config Node]]
- [[_COMMUNITY_eslint Config Node|eslint Config Node]]
- [[_COMMUNITY_package.json Config Node|package.json Config Node]]
- [[_COMMUNITY_tsconfig Config Node|tsconfig Config Node]]
- [[_COMMUNITY_jest-e2e Config Node|jest-e2e Config Node]]
- [[_COMMUNITY_Database Initialization Migration|Database Initialization Migration]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `UserService` - 14 edges
3. `scripts` - 13 edges
4. `jest` - 9 edges
5. `JWT Authentication Scheme` - 5 edges
6. `NotificationConsumer` - 4 edges
7. `Prisma Database Access` - 4 edges
8. `Redis Caching and Blacklist` - 4 edges
9. `compilerOptions` - 2 edges
10. `transform` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (27 total, 12 thin omitted)

### Community 0 - "User Management & DTOs"
Cohesion: 0.08
Nodes (6): mockConfigService, mockJwtService, mockUser, mockUserService, Prisma Database Access, UserService

### Community 1 - "Linting and Testing Setup"
Cohesion: 0.07
Nodes (28): devDependencies, dotenv, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals (+20 more)

### Community 2 - "TypeScript Settings"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 3 - "Core App Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, bcrypt, bull, class-transformer, class-validator, ioredis, joi, @nestjs/bull (+14 more)

### Community 4 - "User Authentication Module"
Cohesion: 0.11
Nodes (6): dto, mockAuthService, mockLoginResponse, mockUser, JWT Authentication Scheme, LoginDto

### Community 7 - "package.json Config"
Cohesion: 0.12
Nodes (15): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+7 more)

### Community 8 - "README Documentation"
Cohesion: 0.13
Nodes (14): NestJS Modular Architecture, code:bash ($ npm install), code:bash (# development), code:bash (# unit tests), code:bash ($ npm install -g @nestjs/mau), Compile and run the project, Deployment, Description (+6 more)

### Community 9 - "Notification Queue & Consumers"
Cohesion: 0.14
Nodes (7): EmailJobData, InAppJobData, NotificationConsumer, NotificationModule, EmailJobData, InAppJobData, EnqueueJobOptions

### Community 10 - "Build & Execution Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 12 - "E2E Testing Settings"
Cohesion: 0.29
Nodes (6): moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$

### Community 13 - "NestJS CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **139 isolated node(s):** `EmailJobData`, `InAppJobData`, `NotificationModule`, `$schema`, `collection` (+134 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Linting and Testing Setup` to `package.json Config`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Core App Dependencies` to `package.json Config`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `UserService` connect `User Management & DTOs` to `User Authentication Module`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `EmailJobData`, `InAppJobData`, `NotificationModule` to the rest of the system?**
  _139 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User Management & DTOs` be split into smaller, more focused modules?**
  _Cohesion score 0.08387096774193549 - nodes in this community are weakly interconnected._
- **Should `Linting and Testing Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._