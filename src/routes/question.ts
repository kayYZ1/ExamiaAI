import { Hono } from 'hono';
import { JwtVariables } from 'hono/jwt';
import { jwt } from 'hono/jwt';
import { eq, and } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { randomUUID } from 'crypto';

import generateQuestions from '../lib/ai';

import { Question, Set, User } from '../db/schema';
import { getUserIdFromCookie } from '../shared/utils';
import { db } from '../db/turso';
import { LLMResponse } from '../shared/types';

const question = new Hono<{ Variables: JwtVariables }>();

question.use('*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  });
  return jwtMiddleware(c, next);
});

question.get('/:id', async (c) => {
  const setId = c.req.param('id');

  const questions = await db
    .select({
      id: Question.id,
      question: Question.question,
      answers: Question.answers,
      answer: Question.answer,
    })
    .from(Question)
    .where(eq(Question.setId, setId));

  if (!questions) {
    return c.json({ message: 'No questions found' }, 404);
  }

  return c.json(questions, 200);
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
    const userId = getUserIdFromCookie(c);
    const setId = c.req.param('id');
    const body = c.req.valid('json');

    const { numOfQuestions, level, topic } = body;

    const user = await db
      .select({ tokens: User.tokens })
      .from(User)
      .where(eq(User.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return c.json({ message: 'User not found' }, 404);
    }

    const set = await db
      .select({
        name: Set.name,
      })
      .from(Set)
      .where(and(eq(Set.id, setId), eq(Set.userId, userId)))
      .limit(1);

    if (!set || set.length === 0) {
      return c.json({ message: 'Unauthorized action' }, 403);
    }

    const response: LLMResponse[] = await generateQuestions(
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

    await db
      .update(User)
      .set({ tokens: user[0].tokens - 1 })
      .where(eq(User.id, userId));

    return c.json(response, 201);
  }
);

question.patch(
  '/:id/:questionId',
  zValidator(
    'json',
    z.object({
      question: z.string().max(90),
      answers: z.string().max(60),
      answer: z.string().max(60),
    })
  ),
  async (c) => {
    const userId = getUserIdFromCookie(c);
    const setId = c.req.param('id');
    const questionId = c.req.param('questionId');

    const body = c.req.valid('json');
    const { question, answers, answer } = body;

    const user = await db
      .select({ tokens: User.tokens })
      .from(User)
      .where(eq(User.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return c.json({ message: 'User not found' }, 404);
    }

    const set = await db
      .select({
        name: Set.name,
      })
      .from(Set)
      .where(and(eq(Set.id, setId), eq(Set.userId, userId)))
      .limit(1);

    if (!set || set.length === 0) {
      return c.json({ message: 'Unauthorized action' }, 403);
    }

    try {
      await db
        .update(Question)
        .set({
          question,
          answers,
          answer,
        })
        .where(
          and(eq(Question.setId, setId), eq(Question.id, questionId))
        );

      return c.json({ message: `Question ${questionId} updated` }, 200);
    } catch (error) {
      console.log(error);
      return c.json({ message: 'Could not update the question' }, 400);
    }
  }
);

question.delete('/:id/:questionId', async (c) => {
  const userId = getUserIdFromCookie(c);
  const setId = c.req.param('id');
  const questionId = c.req.param('questionId');

  const user = await db
    .select({ tokens: User.tokens })
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);

  if (!user || user.length === 0) {
    return c.json({ message: 'User not found' }, 404);
  }

  const set = await db
    .select({
      name: Set.name,
    })
    .from(Set)
    .where(and(eq(Set.id, setId), eq(Set.userId, userId)))
    .limit(1);

  if (!set || set.length === 0) {
    return c.json({ message: 'Unauthorized action' }, 403);
  }

  try {
    await db
      .delete(Question)
      .where(and(eq(Question.setId, setId), eq(Question.id, questionId)));

    return c.json({ message: `Question ${questionId} deleted` }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ message: 'Could not delete the question' }, 400);
  }
});

export default question;
