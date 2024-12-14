import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN as string
})

db.executeMultiple(
  `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR NOT NULL,
      email TEXT NOT NULL UNIQUE,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )`
);