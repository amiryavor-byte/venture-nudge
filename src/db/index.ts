import * as schema from './schema';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Type union for both database types
type Database = BetterSQLite3Database<typeof schema> | PostgresJsDatabase<typeof schema>;

let cachedDb: Database | null = null;

function initDb(): Database {
    if (cachedDb) return cachedDb;

    // Production: Use Postgres
    if (process.env.DATABASE_URL?.includes('postgres')) {
        const { drizzle } = require('drizzle-orm/postgres-js');
        const postgres = require('postgres');

        const client = postgres(process.env.DATABASE_URL);
        cachedDb = drizzle(client, { schema });
        return cachedDb;
    }

    // Development: Use SQLite
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    const Database = require('better-sqlite3');

    const sqlite = new Database('sqlite.db');
    cachedDb = drizzle(sqlite, { schema });
    return cachedDb;
}

export const db = initDb();
