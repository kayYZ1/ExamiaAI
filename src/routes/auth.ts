import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { jwt, sign, verify } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { deleteCookie, setCookie } from 'hono/cookie';

import { Users } from '../db/schema';
import { db } from '../db/turso';

const auth = new Hono<{ Variables: JwtVariables }>();

auth.post(
  '/magic-link',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
    })
  ),
  async (c) => {
    const body = c.req.valid('json');
    const { email } = body;

    const userExist = await db
      .select({ email: Users.email, id: Users.id })
      .from(Users)
      .where(eq(Users.email, email));

    if (userExist.length === 0) {
      return c.json({ message: 'User not found' }, 404);
    }

    const jwtToken = await sign(
      {
        email,
        id: userExist[0].id,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, //5 minutes for email magic link login
      },
      process.env.JWT_SECRET as string
    );

    const magicLink = `http://localhost:7676/auth/verify?token=${jwtToken}`;
    //Send it via e-mail

    return c.json({ message: `${magicLink}` });
  }
);

auth.get('/verify', async (c) => {
  const { token } = c.req.query();
  if (!token) {
    return c.json({ message: 'Token is required' }, 400);
  }

  try {
    const payload = await verify(token, process.env.JWT_SECRET as string);
    const { id, email } = payload;

    const jwtCookieToken = await sign(
      {
        email,
        id,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day cookie age
      },
      process.env.JWT_SECRET as string
    );

    setCookie(c, 'auth', jwtCookieToken, {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: 'Strict',
    });

    return c.json({ message: 'Succesfully validated. Check cookies.' }, 200);
  } catch (err) {
    return c.json({ message: 'Invalid or expired token' }, 401);
  }
});

auth.use('*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  });
  return jwtMiddleware(c, next);
});

auth.post('/logout', (c) => {
  deleteCookie(c, 'auth');
  return c.json({ message: 'Successfully logged out.' }, 200);
});

export default auth;
