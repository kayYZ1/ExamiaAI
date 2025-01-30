import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const url =
  process.env.NODE_ENV === 'production'
    ? (process.env.TURSO_DATABASE_URL_PROD as string)
    : (process.env.TURSO_DATABASE_URL as string);

const authToken =
  process.env.NODE_ENV === 'production'
    ? (process.env.TURSO_AUTH_TOKEN_PROD as string)
    : (process.env.TURSO_AUTH_TOKEN as string);

const turso = createClient({
  url,
  authToken,
});

export const db = drizzle(turso);
