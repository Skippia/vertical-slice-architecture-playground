import { Global, Module } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Database = require('better-sqlite3');
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DATABASE = 'DATABASE';
export type DrizzleDB = BetterSQLite3Database<typeof schema>;

const SQL_CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL
  );
`;

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: () => {
        const sqlite = new Database('sqlite.db');
        sqlite.pragma('journal_mode = WAL');
        sqlite.pragma('foreign_keys = ON');

        const db = drizzle(sqlite, { schema });

        // Auto-create tables (for simplicity in this basic example)
        sqlite.exec(SQL_CREATE_TABLES);

        return db;
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
