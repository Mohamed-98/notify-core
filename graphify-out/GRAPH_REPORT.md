# Graph Report - notify-core  (2026-06-05)

## Corpus Check
- 52 files · ~4,998 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 287 nodes · 374 edges · 20 communities (15 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66117039`
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `UserService` - 14 edges
3. `scripts` - 13 edges
4. `NotificationService` - 12 edges
5. `NotificationController` - 10 edges
6. `AuthService` - 10 edges
7. `UserController` - 9 edges
8. `PrismaService` - 9 edges
9. `jest` - 8 edges
10. `RedisService` - 8 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (20 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (29): devDependencies, dotenv, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals (+21 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (12): AuthController, dto, mockAuthService, mockLoginResponse, mockUser, AuthService, mockConfigService, mockJwtService (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (6): AuthModule, JwtStrategy, AppController, AppModule, AppService, UserModule

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (5): JwtAuthGuard, CreateNotificationDto, UpdateNotificationDto, NotificationController, NotificationService

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (6): CreateUserDto, UpdateUserDto, PrismaModule, PrismaService, UserController, UserService

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (25): dependencies, bcrypt, bull, class-transformer, class-validator, ioredis, joi, @nestjs/bull (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (9): EmailModule, EmailService, EmailJobData, InAppJobData, NotificationConsumer, NotificationGateway, NotificationModule, EnqueueJobOptions (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (15): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (13): code:bash ($ npm install), code:bash (# development), code:bash (# unit tests), code:bash ($ npm install -g @nestjs/mau), Compile and run the project, Deployment, Description, License (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, ^.+\\.(t|j)s$

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **132 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `extends` (+127 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 0` to `Community 8`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 5` to `Community 8`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `UserService` connect `Community 4` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10541310541310542 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._