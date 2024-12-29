import { Hono } from 'hono';
import { JwtVariables } from 'hono/jwt';
import { jwt, decode } from 'hono/jwt';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { getCookie } from 'hono/cookie';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

import { db } from '../db/turso';
import { Set, User } from '../db/schema';

const sets = new Hono<{ Variables: JwtVariables }>();

sets.use('*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  });
  return jwtMiddleware(c, next);
});

sets.get('/', async (c) => {
  const authCookie = getCookie(c, 'auth') as string;
  const { payload } = decode(authCookie);

  const sets = await db
    .select({ id: Set.id, name: Set.name })
    .from(Set)
    .where(eq(Set.userId, payload.id as string))
    .all();

  if (!sets) {
    return c.json({ message: 'No sets found' }, 404);
  }

  return c.json(sets, 200);
});

sets.post(
  '/',
  zValidator(
    'json',
    z.object({
      name: z.string().min(3).max(25),
    })
  ),
  async (c) => {
    const authCookie = getCookie(c, 'auth') as string;
    const { payload } = decode(authCookie);

    const user = await db
      .select({ sets: User.sets })
      .from(User)
      .where(eq(User.id, payload.id as string));

    if (user[0].sets === 3) {
      return c.json({ message: 'You have reached the limit of sets' }, 400);
    }

    const body = c.req.valid('json');
    const id = randomUUID();
    const { name } = body;

    await db.insert(Set).values({ id, name, userId: payload.id as string });

    return c.json(`Set ${name} created.`, 201);
  }
);
