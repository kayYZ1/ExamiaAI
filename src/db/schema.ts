import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const User = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  alias: text('alias'),
  sets: integer('sets').notNull().default(0),
  tokens: integer('tokens').notNull().default(15),
  exams: integer('exams').notNull().default(0),
  plan: text('plan').notNull().default('Basic'),
  createdAt: text('createdAt')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer('updatedAt', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export const Set = sqliteTable('sets', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => User.id),
  name: text('name').notNull(),
  createdAt: text('createdAt')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export const Question = sqliteTable('questions', {
  id: text('id').primaryKey(),
  setId: text('setId')
    .notNull()
    .references(() => Set.id),
  question: text('question').notNull(),
  answers: text('answers').notNull(),
  answer: text('answer').notNull(),
  createdAt: text('createdAt')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export const Exam = sqliteTable('exams', {
  id: text('id').primaryKey(),
  setId: text('setId')
    .notNull()
    .references(() => Set.id),
  title: text('title').notNull(),
  status: text('status').notNull().default('created'),
  participants: integer('participants').notNull(),
  duration: integer('duration').notNull(),
  createdAt: text('createdAt')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});
