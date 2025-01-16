import { Hono } from 'hono';
import { JwtVariables } from 'hono/jwt';
import { jwt } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db/turso';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { Exam, Set, User } from '../db/schema';
import { getUserIdFromCookie } from '../shared/utils';

const exam = new Hono<{ Variables: JwtVariables }>();

exam.use('*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  });
  return jwtMiddleware(c, next);
});

exam.get('/:setId', async (c) => {
  const userId = getUserIdFromCookie(c);
  const setId = c.req.param('setId');

  const user = await db
    .select({ id: User.id })
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

  const exams = await db
    .select({
      id: Exam.id,
      title: Exam.title,
      participants: Exam.participants,
      status: Exam.status,
      duration: Exam.duration,
      setId: Exam.setId,
    })
    .from(Exam);

  if (!exams) {
    return c.json({ message: 'No questions found' }, 404);
  }

  return c.json(exams, 200);
});

exam.post(
  '/:setId',
  zValidator(
    'json',
    z.object({
      title: z.string().min(5).max(60),
      participants: z.number().min(1).max(20),
      duration: z.number(),
    })
  ),
  async (c) => {
    const userId = getUserIdFromCookie(c);
    const setId = c.req.param('setId');

    const body = c.req.valid('json');
    const { title, participants, duration } = body;

    const user = await db
      .select({ id: User.id })
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
      const examId = randomUUID();
      await db.insert(Exam).values({
        id: examId,
        setId,
        title,
        participants,
        duration,
      });

      return c.json({ message: 'Exam created successfully' }, 201);
    } catch (error) {
      console.error(error);
      return c.json({ message: 'Failed to create exam' }, 500);
    }
  }
);

exam.patch(
  '/:examId/:setId',
  zValidator(
    'json',
    z.object({
      title: z.string().min(5).max(60).optional(),
      participants: z.number().min(1).max(20).optional(),
      status: z.string().optional(),
      duration: z.number().optional(),
    })
  ),
  async (c) => {
    const userId = getUserIdFromCookie(c);
    const setId = c.req.param('setId');
    const examId = c.req.param('examId');

    const body = c.req.valid('json');
    const { title, participants, duration, status } = body;

    const user = await db
      .select({ id: User.id })
      .from(User)
      .where(eq(User.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return c.json({ message: 'User not found' }, 404);
    }

    const exam = await db
      .select({
        setId: Exam.setId,
      })
      .from(Exam)
      .where(and(eq(Exam.id, examId), eq(Exam.setId, setId)))
      .limit(1);

    if (!exam || exam.length === 0) {
      return c.json({ message: 'Unauthorized action' }, 403);
    }

    try {
      await db
        .update(Exam)
        .set({
          title,
          participants,
          status,
          duration,
        })
        .where(eq(Exam.id, examId));
      return c.json({ message: 'Exam updated successfully' }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ message: 'Failed to update exam' }, 500);
    }
  }
);

exam.delete('/:examId/:setId', async (c) => {
  const userId = getUserIdFromCookie(c);
  const setId = c.req.param('setId');
  const examId = c.req.param('examId');

  const user = await db
    .select({ id: User.id })
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);

  if (!user || user.length === 0) {
    return c.json({ message: 'User not found' }, 404);
  }

  const exam = await db
    .select({
      setId: Exam.setId,
    })
    .from(Exam)
    .where(and(eq(Exam.id, examId), eq(Exam.setId, setId)))
    .limit(1);

  if (!exam || exam.length === 0) {
    return c.json({ message: 'Unauthorized action' }, 403);
  }

  try {
    await db.delete(Exam).where(eq(Exam.id, examId));
    return c.json({ message: 'Exam deleted successfully' }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Failed to delete exam' }, 500);
  }
});

export default exam;
