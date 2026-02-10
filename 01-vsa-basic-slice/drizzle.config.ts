import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/common/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './sqlite.db',
  },
});
