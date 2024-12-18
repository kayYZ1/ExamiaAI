import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { randomUUID } from 'crypto';

import { db } from '../db/turso';
import { Users } from '../db/schema';

const user = new Hono();

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

export default user;
