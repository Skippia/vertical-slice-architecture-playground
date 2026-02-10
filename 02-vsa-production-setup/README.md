# 02 — VSA Production Setup

Production-ready Vertical Slice Architecture на NestJS с CQRS, Drizzle ORM, PostgreSQL, RabbitMQ и полной инфраструктурой.

## Что демонстрирует

- **NestJS Monorepo** (`apps/` + `libs/`) — разделение сервисов и shared-кода
- **CQRS** через `@nestjs/cqrs` — разделение Commands, Queries и Events
- **Drizzle ORM** + PostgreSQL — типизированный доступ к БД
- **RabbitMQ** (`@golevelup/nestjs-rabbitmq`) — async events между slices
- **Winston logger** с поддержкой trace ID через `AsyncLocalStorage`
- Альтернативный **Pino logger** (подключается вместо Winston)
- **Кастомный exception filter** с маппингом обработчиков по типу ошибки
- **Docker Compose** — полный стек (app + PostgreSQL + RabbitMQ + pgAdmin)
- Валидация конфигурации через **Joi**
- `GenerateTraceIdMiddleware` — генерация traceId для end-to-end logging

## Домен: e-commerce (3 slices)

| Slice | Endpoints | Commands | Queries |
|-------|-----------|----------|---------|
| **Products** | `POST /products`, `GET /products`, `GET /products/:id` | `CreateProduct` | `GetProduct`, `GetAllProducts` |
| **Users** | `POST /users`, `GET /users`, `GET /users/:id` | `CreateUser` | `GetUser`, `GetAllUsers` |
| **Orders** | `POST /orders/checkout`, `GET /orders/:id`, `GET /orders/user/:userId` | `CheckoutOrder` | `GetOrder`, `GetUserOrders` |

## Структура slice (CQRS)

```
apps/checkout-service/src/features/<slice>/
├── <slice>.module.ts
├── <slice>.controller.ts
├── commands/
│   ├── <action>.command.ts        # Command class
│   └── <action>.handler.ts        # @CommandHandler
├── queries/
│   ├── <action>.query.ts          # Query class
│   └── <action>.handler.ts        # @QueryHandler
├── dto/
│   ├── <action>.in-dto.ts         # Request DTO (class-validator)
│   └── <action>.out-dto.ts        # Response DTO
├── events/                         # (где нужно)
│   └── order-created.consumer.ts  # @RabbitSubscribe (RabbitMQ consumer)
├── infrastructure/
│   └── <slice>.repository.ts      # Drizzle queries (PostgreSQL)
└── tests/
    └── <slice>.handler.spec.ts    # Unit tests
```

## Полная структура проекта

```
apps/
└── checkout-service/
    ├── Dockerfile
    ├── .env.dev                        # PORT=3000
    ├── .env.pg.dev                     # PostgreSQL credentials
    ├── .env.amqp.dev                   # RabbitMQ credentials
    ├── tsconfig.app.json
    ├── test/
    │   ├── jest-e2e.json               # E2E test config
    │   └── app.e2e-spec.ts             # E2E tests (30 тестов)
    └── src/
        ├── app.module.ts               # Root: Config, Winston, DB, RMQ, 3 feature modules
        ├── main.ts                     # Bootstrap с ConfigService + ValidationPipe
        ├── common/
        │   ├── contracts/rabbitmq/     # Exchange/queue/routing key конфигурация
        │   │   ├── exchanges-config.ts # ex.checkout (direct)
        │   │   ├── queues.ts           # q.checkout-sync-projection, q.order-created-stock-update
        │   │   ├── queue-bindings.ts   # Bindings + routing keys
        │   │   └── index.ts
        │   └── database/
        │       ├── database.module.ts  # Global: PostgreSQL Pool + Drizzle
        │       ├── schema.ts           # Drizzle-таблицы (PG dialect)
        │       └── index.ts
        └── features/
            ├── products/               # === Products Slice ===
            │   ├── products.module.ts
            │   ├── products.controller.ts
            │   ├── commands/           # CreateProduct
            │   ├── queries/            # GetProduct, GetAllProducts
            │   ├── dto/                # CreateProductInDto, ProductOutDto
            │   ├── events/             # OrderCreatedConsumer (@RabbitSubscribe — уменьшает stock)
            │   ├── infrastructure/     # ProductsRepository (Drizzle/PG)
            │   └── tests/              # Unit tests
            ├── users/                  # === Users Slice ===
            │   ├── users.module.ts
            │   ├── users.controller.ts
            │   ├── commands/           # CreateUser
            │   ├── queries/            # GetUser, GetAllUsers
            │   ├── dto/                # CreateUserInDto, UserOutDto
            │   ├── infrastructure/     # UsersRepository (Drizzle/PG)
            │   └── tests/              # Unit tests
            └── orders/                 # === Orders Slice ===
                ├── orders.module.ts
                ├── orders.controller.ts
                ├── commands/           # CheckoutOrder (QueryBus + AmqpConnection.publish)
                ├── queries/            # GetOrder, GetUserOrders
                ├── dto/                # CheckoutOrderInDto, OrderOutDto
                ├── infrastructure/     # OrdersRepository (Drizzle/PG)
                └── tests/              # Unit tests

libs/
└── common/src/                         # === Shared Infrastructure (без изменений) ===
    ├── filters/                        # AllExceptionFilter + BaseCustomExceptionFilter
    │   └── base-exception-filter/      # Extensible handler mapping
    ├── middlewares/                     # GenerateTraceIdMiddleware (AsyncLocalStorage)
    └── modules/
        ├── logger/
        │   ├── winston/                # WinstonLoggerService + LoggingInterceptor + @InjectLogger
        │   └── pino/                   # PinoLoggerService (альтернатива)
        ├── rmq/                        # MessageBrokerModule (RabbitMQ dynamic module)
        └── types/                      # Shared types
```

## Схема БД (PostgreSQL)

```
products:    id(uuid PK), name(varchar), description(text), price(real), stock(int), created_at, updated_at
users:       id(uuid PK), email(varchar unique), name(varchar), created_at
orders:      id(uuid PK), user_id(FK→users), status(varchar), total_amount(real), created_at
order_items: id(uuid PK), order_id(FK→orders), product_id(FK→products), quantity(int), unit_price(real)
```

## RabbitMQ: exchanges, queues, routing keys

| Exchange | Type | Routing Key | Queue | Consumer |
|----------|------|-------------|-------|----------|
| `ex.checkout` | direct | `checkout.sync.projection` | `q.checkout-sync-projection` | — (reserved) |
| `ex.checkout` | direct | `checkout.order.created` | `q.order-created-stock-update` | `OrderCreatedConsumer` (Products slice) |

**Flow**: `CheckoutOrderHandler` → publish to RabbitMQ → `OrderCreatedConsumer` уменьшает stock.

## Cross-slice коммуникация

```
Orders slice                          Products slice
┌──────────────────┐                  ┌───────────────────────┐
│ CheckoutHandler   │──QueryBus──────→│ GetProductHandler      │
│                   │                  └───────────────────────┘
│                   │──RabbitMQ──────→│ OrderCreatedConsumer    │
│                   │  (async,durable)│ @RabbitSubscribe        │
│                   │                  │ (reduces stock)        │
└──────────────────┘                  └───────────────────────┘
        │
        │──QueryBus──────→ Users slice: GetUserHandler
```

**Отличие от 01-basic**: events идут через RabbitMQ (async, durable), а не через in-process EventBus.

## Стек

- NestJS 11 (monorepo)
- `@nestjs/cqrs` — CQRS (CommandBus, QueryBus)
- `drizzle-orm` + `pg` — ORM + PostgreSQL
- `@golevelup/nestjs-rabbitmq` — message broker
- `winston` — structured logging с traceId
- `joi` — валидация env-переменных
- `class-validator` + `class-transformer` — валидация DTO
- Docker Compose (PostgreSQL, RabbitMQ, pgAdmin)

## Запуск

```bash
pnpm install

# Поднять инфраструктуру
docker-compose up -d

# Запустить сервис
pnpm run start:dev
```

### Доступные сервисы

| Сервис | URL | Credentials |
|--------|-----|-------------|
| App | `http://localhost:3000` | — |
| pgAdmin | `http://localhost:5050` | admin@admin.com / root |
| RabbitMQ Management | `http://localhost:15672` | user / password |
| PostgreSQL | `localhost:5434` | postgres / midapa24 / checkout-db |

## Примеры запросов

```bash
# Создать продукт
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Widget", "description": "A useful widget", "price": 19.99, "stock": 100}'

# Создать пользователя
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe"}'

# Checkout (подставить реальные UUID из ответов выше)
curl -X POST http://localhost:3000/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId": "<user-id>", "items": [{"productId": "<product-id>", "quantity": 2}]}'

# Получить заказы пользователя
curl http://localhost:3000/orders/user/<user-id>

# Проверить что stock уменьшился (через RabbitMQ consumer)
curl http://localhost:3000/products/<product-id>
```

## Drizzle миграции

```bash
# Сгенерировать миграцию из schema
pnpm db:generate

# Применить миграции к БД
pnpm db:migrate
```

## Тесты

```bash
# Unit tests (13 тестов — handlers для всех slices)
pnpm test

# E2E tests (требует docker-compose up -d)
pnpm test:e2e
```

### Покрытие E2E тестов

| Категория | Тесты |
|-----------|-------|
| Products — happy path | POST create, POST create second, GET all, GET by id |
| Products — errors | GET 404, POST missing name, POST negative price, POST empty body |
| Users — happy path | POST create, GET all, GET by id |
| Users — errors | GET 404, POST invalid email, POST missing name, POST empty body |
| Orders — happy path | POST checkout single item, POST checkout multiple items, GET by id, GET by userId |
| Orders — errors | POST non-existent user (404), POST non-existent product (404), POST insufficient stock (400), POST empty items (400), POST missing userId (400), POST quantity=0 (400), GET 404 |
| Cross-slice RabbitMQ | Stock reduction after checkout (async via RabbitMQ consumer) |
| Full E2E flow | Create product → create user → checkout → verify order → verify user orders → verify stock reduced via RabbitMQ |

## Отличие от 01-vsa-basic-slice

| | 01-basic-slice | 02-production-setup |
|---|---|---|
| Фокус | Минимальный CQRS + SQLite | Production: CQRS + PG + RabbitMQ + infra |
| Структура | Обычный проект | Monorepo (apps + libs) |
| БД | SQLite (better-sqlite3) | PostgreSQL (Docker) |
| Events | In-process EventBus (sync) | RabbitMQ (async, durable) |
| Логирование | NestJS Logger | Winston + traceId + AsyncLocalStorage |
| Error handling | Default | Custom exception filter chain |
| Config | Hardcoded port | ConfigService + Joi validation |
| Docker | Нет | Compose (4 сервиса) |
