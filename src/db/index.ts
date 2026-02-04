import * as schema from './schema';

// Use Postgres on Vercel, SQLite locally
if (process.env.DATABASE_URL?.includes('postgres')) {
    // Production: Vercel Postgres
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const postgres = await import('postgres');

    const client = postgres.default(process.env.DATABASE_URL!);
    export const db = drizzle(client, { schema });
} else {
    // Development: SQLite
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const Database = (await import('better-sqlite3')).default;

    const sqlite = new Database('sqlite.db');
    export const db = drizzle(sqlite, { schema });
}
