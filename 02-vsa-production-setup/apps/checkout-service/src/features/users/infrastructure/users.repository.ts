import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { DATABASE, DrizzleDB } from '../../../common/database/database.module'
import { users } from '../../../common/database/schema'

@Injectable()
export class UsersRepository {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async create(data: { email: string; name: string }) {
    const id = uuidv4()

    const [user] = await this.db.insert(users).values({
      id,
      email: data.email,
      name: data.name,
    }).returning()

    return user
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))

    return result[0] ?? null
  }

  async findAll() {
    return this.db.select().from(users)
  }
}
