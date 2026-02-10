# 01 — VSA Basic Slice

Production-grade пример Vertical Slice Architecture на NestJS с CQRS, Drizzle ORM и SQLite.

## Что демонстрирует

- Организация кода по **feature slices** (`features/products/`, `features/users/`, `features/orders/`)
- **CQRS** через `@nestjs/cqrs` — разделение Commands, Queries и Events
- **Drizzle ORM** + SQLite (`better-sqlite3`) — типизированный доступ к БД
- **Cross-slice коммуникация**:
  - `QueryBus` — чтение данных между slices (Orders проверяет существование User и Product)
  - `EventBus` — side effects (Orders публикует `OrderCreatedEvent` → Products уменьшает stock)
- DTO-валидация через `class-validator` + `class-transformer`

## Домен: e-commerce

| Slice | Endpoints | Commands | Queries |
|-------|-----------|----------|---------|
| **Products** | `POST /products`, `GET /products`, `GET /products/:id` | `CreateProduct` | `GetProduct`, `GetAllProducts` |
| **Users** | `POST /users`, `GET /users`, `GET /users/:id` | `CreateUser` | `GetUser`, `GetAllUsers` |
| **Orders** | `POST /orders/checkout`, `GET /orders/:id`, `GET /orders/user/:userId` | `CheckoutOrder` | `GetOrder`, `GetUserOrders` |

## Структура slice (CQRS)

```
src/features/<slice>/
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
│   ├── <event>.event.ts
│   └── <event>.handler.ts         # @EventsHandler
├── infrastructure/
│   └── <slice>.repository.ts      # Drizzle queries
└── tests/
    └── <slice>.handler.spec.ts    # Unit tests
```

## Полная структура проекта

```
src/
├── app.module.ts                       # Root: DatabaseModule + 3 feature modules
├── main.ts                             # Bootstrap (port 3000, global ValidationPipe)
├── common/
│   ├── database/
│   │   ├── database.module.ts          # Global module: SQLite + Drizzle
│   │   ├── schema.ts                   # Drizzle-таблицы (products, users, orders, order_items)
│   │   └── index.ts
│   └── interceptors/
│       └── logging.interceptor.ts      # Request/response logging
└── features/
    ├── products/                       # === Products Slice ===
    │   ├── products.module.ts
    │   ├── products.controller.ts
    │   ├── commands/                   # CreateProduct
    │   ├── queries/                    # GetProduct, GetAllProducts
    │   ├── dto/                        # CreateProductInDto, ProductOutDto
    │   ├── events/                     # OrderCreatedHandler (уменьшает stock)
    │   ├── infrastructure/             # ProductsRepository (Drizzle)
    │   └── tests/                      # Unit tests
    ├── users/                          # === Users Slice ===
    │   ├── users.module.ts
    │   ├── users.controller.ts
    │   ├── commands/                   # CreateUser
    │   ├── queries/                    # GetUser, GetAllUsers
    │   ├── dto/                        # CreateUserInDto, UserOutDto
    │   ├── infrastructure/             # UsersRepository (Drizzle)
    │   └── tests/                      # Unit tests
    └── orders/                         # === Orders Slice ===
        ├── orders.module.ts
        ├── orders.controller.ts
        ├── commands/                   # CheckoutOrder (uses QueryBus + EventBus)
        ├── queries/                    # GetOrder, GetUserOrders
        ├── dto/                        # CheckoutOrderInDto, OrderOutDto
        ├── events/                     # OrderCreatedEvent
        ├── infrastructure/             # OrdersRepository (Drizzle)
        └── tests/                      # Unit tests
```

## Схема БД (SQLite)

```
products:    id(uuid), name, description, price, stock, created_at, updated_at
users:       id(uuid), email(unique), name, created_at
orders:      id(uuid), user_id(FK→users), status, total_amount, created_at
order_items: id(uuid), order_id(FK→orders), product_id(FK→products), quantity, unit_price
```

## Стек

- NestJS 11
- `@nestjs/cqrs` — CQRS (CommandBus, QueryBus, EventBus)
- `drizzle-orm` + `better-sqlite3` — ORM + SQLite
- `class-validator` + `class-transformer` — валидация DTO
- `uuid` — генерация UUID

## Запуск

```bash
pnpm install
pnpm run start:dev
```

Приложение запускается на `http://localhost:3000`. БД (SQLite) создаётся автоматически.

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

# Checkout (подставить реальные ID)
curl -X POST http://localhost:3000/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId": "<user-id>", "items": [{"productId": "<product-id>", "quantity": 2}]}'

# Получить заказы пользователя
curl http://localhost:3000/orders/user/<user-id>
```

## Тесты

```bash
# Unit tests (13 тестов — handlers для всех slices)
pnpm test

# E2E tests (30 тестов — полный flow + error cases + cross-slice events)
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
| Cross-slice EventBus | Stock reduction after checkout, stock reduction after multiple checkouts |
| Full E2E flow | Create product → create user → checkout → verify order → verify user orders → verify stock reduced |

## Cross-slice коммуникация

```
Orders slice                          Products slice
┌─────────────────┐                   ┌──────────────────┐
│ CheckoutHandler  │──QueryBus───────→│ GetProductHandler │
│                  │                   └──────────────────┘
│                  │──EventBus───────→│ OrderCreatedHandler│
│                  │  (OrderCreated)  │ (reduces stock)    │
└─────────────────┘                   └──────────────────┘
        │
        │──QueryBus───────→ Users slice: GetUserHandler
```
