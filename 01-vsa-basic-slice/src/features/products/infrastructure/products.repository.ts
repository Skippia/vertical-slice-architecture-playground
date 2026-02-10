import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DATABASE, DrizzleDB } from '../../../common/database/database.module';
import { products } from '../../../common/database/schema';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async create(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    const id = uuidv4();
    const now = new Date().toISOString();

    this.db.insert(products).values({
      id,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      createdAt: now,
      updatedAt: now,
    }).run();

    return this.findById(id) as Promise<NonNullable<Awaited<ReturnType<typeof this.findById>>>>;
  }

  async findById(id: string) {
    const result = this.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .get();

    return result ?? null;
  }

  async findAll() {
    return this.db.select().from(products).all();
  }

  async updateStock(id: string, newStock: number) {
    this.db
      .update(products)
      .set({ stock: newStock, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id))
      .run();
  }
}
