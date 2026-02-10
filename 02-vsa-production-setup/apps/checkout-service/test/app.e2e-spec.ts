import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'

/**
 * E2E tests for checkout-service.
 * Requires PostgreSQL and RabbitMQ running (docker-compose up -d).
 *
 * Run: pnpm test:e2e
 */
describe('Checkout Service E2E', () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()
  }, 30000)

  afterAll(async () => {
    await app.close()
  })

  // ──────────────────────────────────────────────
  // Products
  // ──────────────────────────────────────────────
  let productId: string
  let product2Id: string

  describe('Products — happy path', () => {
    it('POST /products — should create a product', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Widget', description: 'A test widget', price: 19.99, stock: 50 })
        .expect(201)

      expect(res.body.id).toBeDefined()
      expect(res.body.name).toBe('Widget')
      expect(res.body.description).toBe('A test widget')
      expect(res.body.price).toBe(19.99)
      expect(res.body.stock).toBe(50)
      expect(res.body.createdAt).toBeDefined()
      expect(res.body.updatedAt).toBeDefined()
      productId = res.body.id
    })

    it('POST /products — should create a second product', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Gadget', description: 'Another product', price: 49.99, stock: 10 })
        .expect(201)

      product2Id = res.body.id
    })

    it('GET /products — should return all products', async () => {
      const res = await request(app.getHttpServer())
        .get('/products')
        .expect(200)

      expect(res.body.length).toBeGreaterThanOrEqual(2)
    })

    it('GET /products/:id — should return product by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)

      expect(res.body.id).toBe(productId)
      expect(res.body.name).toBe('Widget')
    })
  })

  describe('Products — error cases', () => {
    it('GET /products/:id — should return 404 for non-existent product', async () => {
      await request(app.getHttpServer())
        .get('/products/00000000-0000-0000-0000-000000000000')
        .expect(404)
    })

    it('POST /products — should return 400 for missing name', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({ price: 10, stock: 5 })
        .expect(400)
    })

    it('POST /products — should return 400 for negative price', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Bad', price: -1, stock: 5 })
        .expect(400)
    })

    it('POST /products — should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({})
        .expect(400)
    })
  })

  // ──────────────────────────────────────────────
  // Users
  // ──────────────────────────────────────────────
  let userId: string

  describe('Users — happy path', () => {
    it('POST /users — should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email: `e2e-${Date.now()}@test.com`, name: 'E2E User' })
        .expect(201)

      expect(res.body.id).toBeDefined()
      expect(res.body.name).toBe('E2E User')
      expect(res.body.createdAt).toBeDefined()
      userId = res.body.id
    })

    it('GET /users — should return all users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .expect(200)

      expect(res.body.length).toBeGreaterThanOrEqual(1)
    })

    it('GET /users/:id — should return user by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)

      expect(res.body.id).toBe(userId)
    })
  })

  describe('Users — error cases', () => {
    it('GET /users/:id — should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(404)
    })

    it('POST /users — should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'not-an-email', name: 'Bad User' })
        .expect(400)
    })

    it('POST /users — should return 400 for missing name', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'valid@test.com' })
        .expect(400)
    })

    it('POST /users — should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(400)
    })
  })

  // ──────────────────────────────────────────────
  // Orders — Checkout Flow
  // ──────────────────────────────────────────────
  let orderId: string

  describe('Orders — happy path', () => {
    it('POST /orders/checkout — should create an order with single item', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId,
          items: [{ productId, quantity: 2 }],
        })
        .expect(201)

      expect(res.body.id).toBeDefined()
      expect(res.body.userId).toBe(userId)
      expect(res.body.status).toBe('confirmed')
      expect(res.body.totalAmount).toBe(39.98) // 19.99 * 2
      expect(res.body.items).toHaveLength(1)
      expect(res.body.items[0].productId).toBe(productId)
      expect(res.body.items[0].quantity).toBe(2)
      expect(res.body.items[0].unitPrice).toBe(19.99)
      expect(res.body.createdAt).toBeDefined()
      orderId = res.body.id
    })

    it('POST /orders/checkout — should create an order with multiple items', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId,
          items: [
            { productId, quantity: 1 },
            { productId: product2Id, quantity: 3 },
          ],
        })
        .expect(201)

      expect(res.body.items).toHaveLength(2)
      // 19.99 * 1 + 49.99 * 3 = 169.96
      expect(res.body.totalAmount).toBeCloseTo(169.96, 1)
    })

    it('GET /orders/:id — should return order by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(200)

      expect(res.body.id).toBe(orderId)
      expect(res.body.userId).toBe(userId)
      expect(res.body.items).toHaveLength(1)
    })

    it('GET /orders/user/:userId — should return user orders', async () => {
      const res = await request(app.getHttpServer())
        .get(`/orders/user/${userId}`)
        .expect(200)

      expect(res.body.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Orders — error cases', () => {
    it('POST /orders/checkout — should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId: '00000000-0000-0000-0000-000000000000',
          items: [{ productId, quantity: 1 }],
        })
        .expect(404)
    })

    it('POST /orders/checkout — should return 404 for non-existent product', async () => {
      await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId,
          items: [{ productId: '00000000-0000-0000-0000-000000000000', quantity: 1 }],
        })
        .expect(404)
    })

    it('POST /orders/checkout — should return 400 for insufficient stock', async () => {
      await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId,
          items: [{ productId: product2Id, quantity: 99999 }],
        })
        .expect(400)
    })

    it('POST /orders/checkout — should return 400 for empty items', async () => {
      await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({ userId, items: [] })
        .expect(400)
    })

    it('POST /orders/checkout — should return 400 for missing userId', async () => {
      await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({ items: [{ productId, quantity: 1 }] })
        .expect(400)
    })

    it('POST /orders/checkout — should return 400 for quantity = 0', async () => {
      await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId,
          items: [{ productId, quantity: 0 }],
        })
        .expect(400)
    })

    it('GET /orders/:id — should return 404 for non-existent order', async () => {
      await request(app.getHttpServer())
        .get('/orders/00000000-0000-0000-0000-000000000000')
        .expect(404)
    })
  })

  // ──────────────────────────────────────────────
  // Cross-slice: RabbitMQ — stock reduction
  // ──────────────────────────────────────────────
  describe('Cross-slice — stock reduction via RabbitMQ', () => {
    it('should reduce product stock after checkout', async () => {
      // Create a fresh product with known stock
      const productRes = await request(app.getHttpServer())
        .post('/products')
        .send({ name: 'StockTestItem', price: 5.0, stock: 20 })
        .expect(201)
      const freshProductId = productRes.body.id

      // Checkout 7 units
      await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId,
          items: [{ productId: freshProductId, quantity: 7 }],
        })
        .expect(201)

      // Wait for the RabbitMQ consumer to process the message
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const res = await request(app.getHttpServer())
        .get(`/products/${freshProductId}`)
        .expect(200)

      expect(res.body.stock).toBe(13) // 20 - 7
    }, 10000)
  })

  // ──────────────────────────────────────────────
  // Full E2E flow
  // ──────────────────────────────────────────────
  describe('Full E2E flow — create product, user, checkout, verify', () => {
    it('should execute complete checkout flow', async () => {
      // 1. Create product
      const product = await request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Flow Product', price: 100, stock: 5 })
        .expect(201)

      // 2. Create user
      const user = await request(app.getHttpServer())
        .post('/users')
        .send({ email: `flow-${Date.now()}@test.com`, name: 'Flow User' })
        .expect(201)

      // 3. Checkout
      const order = await request(app.getHttpServer())
        .post('/orders/checkout')
        .send({
          userId: user.body.id,
          items: [{ productId: product.body.id, quantity: 3 }],
        })
        .expect(201)

      expect(order.body.totalAmount).toBe(300) // 100 * 3

      // 4. Verify order is retrievable
      const fetchedOrder = await request(app.getHttpServer())
        .get(`/orders/${order.body.id}`)
        .expect(200)

      expect(fetchedOrder.body.userId).toBe(user.body.id)

      // 5. Verify order appears in user's orders
      const userOrders = await request(app.getHttpServer())
        .get(`/orders/user/${user.body.id}`)
        .expect(200)

      expect(userOrders.body.some((o) => o.id === order.body.id)).toBe(true)

      // 6. Verify stock reduced (via RabbitMQ consumer)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const updatedProduct = await request(app.getHttpServer())
        .get(`/products/${product.body.id}`)
        .expect(200)

      expect(updatedProduct.body.stock).toBe(2) // 5 - 3
    }, 15000)
  })
})
