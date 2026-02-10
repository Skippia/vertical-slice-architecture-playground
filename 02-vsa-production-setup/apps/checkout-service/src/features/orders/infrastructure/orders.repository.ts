import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { DATABASE, DrizzleDB } from '../../../common/database/database.module'
import { orders, orderItems } from '../../../common/database/schema'
import { OrderOutDto } from '../dto/order.out-dto'

@Injectable()
export class OrdersRepository {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async create(data: {
    userId: string
    totalAmount: number
    items: { productId: string; quantity: number; unitPrice: number }[]
  }): Promise<OrderOutDto> {
    const orderId = uuidv4()

    const [order] = await this.db.insert(orders).values({
      id: orderId,
      userId: data.userId,
      status: 'confirmed',
      totalAmount: data.totalAmount,
    }).returning()

    const itemRecords = data.items.map((item) => ({
      id: uuidv4(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }))

    const insertedItems = await this.db.insert(orderItems).values(itemRecords).returning()

    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: insertedItems.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    }
  }

  async findById(id: string): Promise<OrderOutDto | null> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))

    const order = result[0]
    if (!order) return null

    const items = await this.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id))

    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: items.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    }
  }

  async findByUserId(userId: string): Promise<OrderOutDto[]> {
    const userOrders = await this.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))

    const result: OrderOutDto[] = []

    for (const order of userOrders) {
      const items = await this.db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id))

      result.push({
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: items.map((i) => ({
          id: i.id,
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      })
    }

    return result
  }
}
