import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: process.env.DATABASE_URL?.includes('postgres') ? 'postgresql' : 'sqlite',
    dbCredentials: process.env.DATABASE_URL?.includes('postgres')
        ? { url: process.env.DATABASE_URL }
        : { url: 'sqlite.db' },
});
