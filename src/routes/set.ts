import { Hono } from 'hono';
import { JwtVariables } from 'hono/jwt';
import { jwt } from 'hono/jwt';
import { randomUUID } from 'crypto';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

import { db } from '../db/turso';
import { Set, User } from '../db/schema';
import { getUserIdFromCookie } from '../shared/utils';

const set = new Hono<{ Variables: JwtVariables }>();

set.use('*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  });
  return jwtMiddleware(c, next);
});

set.get('/', async (c) => {
  const userId = getUserIdFromCookie(c);

  const sets = await db
    .select({
      id: Set.id,
      name: Set.name,
      userId: Set.userId,
      createdAt: Set.createdAt,
      updatedAt: Set.updatedAt,
    })
    .from(Set)
    .where(eq(Set.userId, userId));

  if (!sets) {
    return c.json({ message: 'No sets found' }, 404);
  }

  return c.json(sets, 200);
});

set.get('/:id', async (c) => {
  const userId = getUserIdFromCookie(c);
  const setId = c.req.param('id');

  const set = await db
    .select({
      id: Set.id,
      name: Set.name,
      userId: Set.userId,
      createdAt: Set.createdAt,
      updatedAt: Set.updatedAt,
    })
    .from(Set)
    .where(and(eq(Set.userId, userId), eq(Set.id, setId)));

  if (!set || set.length === 0) {
    return c.json({ message: 'Unauthorized action' }, 404);
  }

  return c.json(set[0], 200);
});

set.post(
  '/',
  zValidator(
    'json',
    z.object({
      name: z.string().min(3).max(25),
    })
  ),
  async (c) => {
    const userId = getUserIdFromCookie(c);

    const user = await db
      .select({ sets: User.sets })
      .from(User)
      .where(eq(User.id, userId));

    if (user[0].sets === 3) {
      return c.json(
        { message: 'You have reached the limit of sets' },
        400
      );
    }

    const body = c.req.valid('json');
    const id = randomUUID();
    const { name } = body;

    await db.insert(Set).values({ id, name, userId });

    await db
      .update(User)
      .set({ sets: user[0].sets + 1 })
      .where(eq(User.id, userId));

    return c.json(`Set ${name} created.`, 201);
  }
);

set.patch(
  '/:id',
  zValidator(
    'json',
    z.object({
      name: z.string().min(3).max(25),
    })
  ),
  async (c) => {
    const userId = getUserIdFromCookie(c);
    const setId = c.req.param('id');

    const body = c.req.valid('json');
    const { name } = body;

    const user = await db
      .select({ sets: User.sets, id: User.id })
      .from(User)
      .where(eq(User.id, userId));

    if (!user) {
      return c.json({ message: 'User does not exist' }, 404);
    }

    try {
      await db
        .update(Set)
        .set({ name, updatedAt: new Date() })
        .where(and(eq(Set.id, setId), eq(Set.userId, user[0].id)));
    } catch (error) {
      return c.json({ message: `Error: ${error}` }, 400);
    } finally {
      return c.json({ message: `Set ${setId} has been updated` }, 201);
    }
  }
);

set.delete('/:id', async (c) => {
  const userId = getUserIdFromCookie(c);
  const setId = c.req.param('id');

  const user = await db
    .select({ sets: User.sets, id: User.id })
    .from(User)
    .where(eq(User.id, userId));

  if (!user) {
    return c.json({ message: 'User does not exist' }, 404);
  }

  try {
    await db
      .delete(Set)
      .where(and(eq(Set.id, setId), eq(Set.userId, user[0].id)));

    await db
      .update(User)
      .set({ sets: user[0].sets - 1 })
      .where(eq(User.id, userId));
  } catch (error) {
    return c.json({ message: `Error: ${error}` }, 400);
  } finally {
    return c.json({ message: `Set ${setId} has been deleted` }, 201);
  }
});

export default set;
