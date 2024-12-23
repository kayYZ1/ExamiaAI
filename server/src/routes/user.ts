import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { jwt, decode } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';

import { db } from '../db/turso';
import { Users } from '../db/schema';

const user = new Hono<{ Variables: JwtVariables }>();

user.get('/', async (c) => {
  const result = await db.select().from(Users).all();
  return c.json(result, 200);
});

user.post(
  '/',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
    })
  ),
  async (c) => {
    const body = c.req.valid('json');
    const id = randomUUID();
    const { email } = body;

    await db.insert(Users).values({ id, email });

    return c.json(`User ${email} created.`, 201);
  }
);

user.use('*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  });
  return jwtMiddleware(c, next);
});

user.patch(
  'update',
  zValidator(
    'json',
    z.object({
      alias: z.string().min(3).max(25),
      email: z.string().email().max(30),
    })
  ),
  async (c) => {
    const body = c.req.valid('json');
    const authCookie = getCookie(c, 'auth') as string;
    const { payload } = decode(authCookie);

    if (!user) {
      return c.json({ message: 'User does not exist' }, 404);
    }

    await db
      .update(Users)
      .set({ alias: body.alias, email: body.email })
      .where(eq(Users.id, payload.id as string));

    return c.json({ message: `User ${body.email} updated` }, 200);
  }
);

export default user;
