import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const Users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  alias: text('alias'),
  tokens: integer('tokens').notNull().default(15),
  plan: text('plan').notNull().default('Basic'),
  createdAt: text('createdAt')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer('updatedAt', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});
