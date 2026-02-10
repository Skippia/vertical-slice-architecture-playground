import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DATABASE, DrizzleDB } from '../../../common/database/database.module';
import { users } from '../../../common/database/schema';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async create(data: { email: string; name: string }) {
    const id = uuidv4();
    const now = new Date().toISOString();

    this.db.insert(users).values({
      id,
      email: data.email,
      name: data.name,
      createdAt: now,
    }).run();

    return this.findById(id) as Promise<NonNullable<Awaited<ReturnType<typeof this.findById>>>>;
  }

  async findById(id: string) {
    const result = this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get();

    return result ?? null;
  }

  async findAll() {
    return this.db.select().from(users).all();
  }
}
