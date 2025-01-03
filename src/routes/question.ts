import { Hono } from 'hono';
import { JwtVariables } from 'hono/jwt';
import { jwt } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { randomUUID } from 'crypto';

import generateQuestions from '../lib/ai';

import { Question, Set } from '../db/schema';
import { db } from '../db/turso';

const question = new Hono<{ Variables: JwtVariables }>();

question.use('*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  });
  return jwtMiddleware(c, next);
});

question.post(
  '/:id',
  zValidator(
    'json',
    z.object({
      numOfQuestions: z.union([z.literal(1), z.literal(5)]),
      level: z.enum(['elementary', 'high school', 'college']),
      topic: z.string().nonempty(),
    })
  ),
  async (c) => {
    const setId = c.req.param('id');
    const body = c.req.valid('json');
    const { numOfQuestions, level, topic } = body;

    const set = await db
      .select({
        name: Set.name,
      })
      .from(Set)
      .where(eq(Set.id, setId))
      .limit(1);

    if (!set) {
      return c.json({ message: 'Set not found' }, 404);
    }

    const response = await generateQuestions(
      set[0].name,
      numOfQuestions,
      level,
      topic
    );

    if (!response) {
      return c.json({ message: 'Error occured' }, 500);
    }

    for (const question of response) {
      await db.insert(Question).values({
        id: randomUUID(),
        setId,
        question: question.question,
        answers: question.answers,
        answer: question.answer,
      });
    }

    return c.json(response, 201);
  }
);

export default question;
