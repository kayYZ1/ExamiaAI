import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import { eq } from 'drizzle-orm';

import { db } from '../db/turso';
import { User } from '../db/schema';
import { getUserIdFromCookie } from '../shared/utils';

const user = new Hono<{ Variables: JwtVariables }>();

user.use(
  '*',
  jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  })
);

user.patch(
  '/',
  zValidator(
    'json',
    z.object({
      alias: z.string().min(3).max(25),
      email: z.string().email().max(30),
    })
  ),
  async (c) => {
    const { alias, email } = c.req.valid('json');

    const userId = getUserIdFromCookie(c);

    await db.update(User).set({ alias, email }).where(eq(User.id, userId));

    return c.json({ message: `User ${email} updated` }, 200);
  }
);

/* Leave for testing
user.get('/', async (c) => {
  const result = await db.select().from(User).all();
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
    const { email } = c.req.valid('json');
    const id = randomUUID();

    await db.insert(User).values({ id, email });

    return c.json(`User ${email} created.`, 201);
  }
);*/

export default user;
