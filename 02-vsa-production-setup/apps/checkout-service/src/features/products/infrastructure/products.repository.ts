import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { DATABASE, DrizzleDB } from '../../../common/database/database.module'
import { products } from '../../../common/database/schema'

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async create(data: {
    name: string
    description: string
    price: number
    stock: number
  }) {
    const id = uuidv4()

    const [product] = await this.db.insert(products).values({
      id,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    }).returning()

    return product
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id))

    return result[0] ?? null
  }

  async findAll() {
    return this.db.select().from(products)
  }

  async updateStock(id: string, newStock: number) {
    await this.db
      .update(products)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(products.id, id))
  }
}
