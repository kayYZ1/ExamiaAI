import { defineConfig } from 'drizzle-kit';

const url =
  process.env.NODE_ENV === 'production'
    ? (process.env.TURSO_DATABASE_URL_PROD as string)
    : (process.env.TURSO_DATABASE_URL as string);

const authToken =
  process.env.NODE_ENV === 'production'
    ? (process.env.TURSO_AUTH_TOKEN_PROD as string)
    : (process.env.TURSO_AUTH_TOKEN as string);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url,
    authToken,
  },
  verbose: true,
  strict: true,
});
