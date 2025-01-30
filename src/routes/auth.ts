import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { jwt, sign, verify } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { deleteCookie, setCookie } from 'hono/cookie';
import { createTransport } from 'nodemailer';

import { User } from '../db/schema';
import { db } from '../db/turso';
import { getUserIdFromCookie } from '../shared/utils';

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

    const user = await db
      .select({ email: User.email, id: User.id })
      .from(User)
      .where(eq(User.email, email));

    let userId: string;

    if (!user || user.length === 0) {
      userId = randomUUID();
      await db.insert(User).values({ id: userId, email });
    } else {
      userId = user[0].id;
    }

    const jwtToken = await sign(
      {
        email,
        id: userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, //5 minutes for email magic link login
      },
      process.env.JWT_SECRET as string
    );

    const magicLink =
      process.env.NODE_ENV === 'production'
        ? `https://examia-ai.netlify.app/auth/verify/${jwtToken}`
        : `http://localhost:5173/auth/verify/${jwtToken}`;

    try {
      const transporter = createTransport({
        host: process.env.MAIL_HOST as string,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      const mailOptions = {
        from: 'examia@mail.com',
        to: email,
        subject: 'Magic link login',
        text: `${magicLink}`,
      };

      await transporter.sendMail(mailOptions);
      return c.json({ message: `Email sent to ${email}` });
    } catch (error) {
      return c.json(
        { message: 'Failed to send email', error: error },
        500
      );
    }
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
      sameSite: 'None',
    });

    return c.json(
      { message: 'Succesfully validated. Check cookies.' },
      200
    );
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

auth.get('/validate-cookie', (c) => {
  return c.json({ message: 'Validation succesfull' }, 200);
});

auth.get('/profile', async (c) => {
  const userId = getUserIdFromCookie(c);

  const user = await db
    .select({
      id: User.id,
      email: User.email,
      sets: User.sets,
      tokens: User.tokens,
      exams: User.exams,
      plan: User.plan,
      alias: User.alias,
    })
    .from(User)
    .where(eq(User.id, userId));

  if (!user) {
    return c.json({ message: 'User does not exist' }, 404);
  }

  return c.json(user[0], 200);
});

auth.post('/logout', (c) => {
  deleteCookie(c, 'auth');
  return c.json({ message: 'Successfully logged out.' }, 200);
});

export default auth;
