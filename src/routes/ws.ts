import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import type { WSContext } from 'hono/ws';
import { randomUUID } from 'crypto';
import { eq, and } from 'drizzle-orm';
import type { ServerWebSocket } from 'bun';

import { db } from '../db/turso';
import { getUserIdFromCookie } from '../shared/utils';
import { User, Exam, Question } from '../db/schema';
import type { ExamQuestions } from '../shared/types';

const ws = new Hono();

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

const activeSessions: Map<
  string,
  {
    examId: string;
    numOfParticipants: number;
    clients: Set<{
      ws: WSContext<ServerWebSocket<undefined>>;
      id: string;
      fullName: string;
    }>;
  }
> = new Map();

const getExamQuestions = async (examId: string) => {
  const exam = await db
    .select({ setId: Exam.setId, duration: Exam.duration })
    .from(Exam)
    .where(eq(Exam.id, examId))
    .limit(1);

  if (!exam || exam.length === 0) {
    return [];
  }

  const questions = await db
    .select({
      id: Question.id,
      question: Question.question,
      answers: Question.answers,
      answer: Question.answer,
    })
    .from(Question)
    .where(eq(Question.setId, exam[0].setId));

  return { questions, duration: exam[0].duration };
};

ws.get(
  '/session/:code',
  upgradeWebSocket((c) => {
    const connectionCode = c.req.param('code');
    const uid = randomUUID();

    const session = activeSessions.get(connectionCode);

    return {
      onOpen(_, ws) {
        if (!connectionCode || !activeSessions.has(connectionCode)) {
          console.log(`Wrong connection code for ${uid}`);
          ws.close();
          return;
        }

        console.log(`${uid} joined the session`);
      },
      async onMessage(event, ws) {
        const message = JSON.parse(event.data as string);

        if (!session) {
          ws.send(
            JSON.stringify({
              message: `Exam session does not exist`,
            })
          );
          ws.close();
          return;
        }

        if (message.type === 'join') {
          const fullName = message.fullName;

          if (
            Array.from(session.clients).some((client) => client.id === uid)
          ) {
            ws.send(
              JSON.stringify({
                message: `Client already joined the session`,
              })
            );
            return;
          }

          session.clients.add({ ws, id: uid, fullName });
          ws.send(
            JSON.stringify({
              message: `Welcome ${fullName}! You have joined the exam.`,
            })
          );

          session.clients.forEach((client) => {
            if (uid !== client.id) {
              client.ws.send(
                JSON.stringify({
                  message: `${fullName} has joined the exam.`,
                })
              );
            }
          });

          //Start the exam if all participants have joined
          if (session.clients.size === session.numOfParticipants) {
            const examQuestions = await getExamQuestions(session.examId);
            const { questions, duration } = examQuestions as ExamQuestions;

            session.clients.forEach(async (client) => {
              client.ws.send(
                JSON.stringify({
                  message: 'The exam has started!',
                  questions,
                  duration: duration,
                })
              );
            });
          }
        }

        if (message.type === 'submit') {
          const { questionId, answer } = message;

          console.log(
            `Client ${uid} answered question ${questionId}: ${answer}`
          );

          ws.send(
            JSON.stringify({
              message: `Your answer to question ${questionId} has been received.`,
            })
          );
        }
      },
      onClose(_, ws) {
        console.log(`${uid} left the session`);
        session?.clients.forEach((client) => {
          if (client.ws === ws) {
            session.clients.delete(client);
          }
        });
      },
    };
  })
);

ws.post('/:examId/start', async (c) => {
  const userId = getUserIdFromCookie(c);
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
      participants: Exam.participants,
    })
    .from(Exam)
    .where(and(eq(Exam.id, examId)))
    .limit(1);

  if (!exam || exam.length === 0) {
    return c.json({ message: 'Unauthorized action' }, 403);
  }

  const numOfParticipants = exam[0].participants;

  const connectionCode = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase(); //4 letter string code

  activeSessions.set(connectionCode, {
    examId,
    numOfParticipants,
    clients: new Set(),
  });

  return c.json({ examId, connectionCode });
});

export default ws;
