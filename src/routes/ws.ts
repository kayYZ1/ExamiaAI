import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import type { WSContext } from 'hono/ws';
import { eq, and } from 'drizzle-orm';
import type { ServerWebSocket } from 'bun';

import { db } from '../db/turso';
import { getUserIdFromCookie } from '../shared/utils';
import { User, Exam } from '../db/schema';

const ws = new Hono();

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

const activeSessions: Map<
  string,
  {
    examId: string;
    clients: Set<{
      ws: WSContext<ServerWebSocket<undefined>>;
      fullName: string;
    }>;
  }
> = new Map();

ws.get(
  '/join/:code',
  upgradeWebSocket((c) => {
    const connectionCode = c.req.param('code');
    return {
      onOpen() {
        if (!connectionCode || !activeSessions.has(connectionCode)) {
          console.log('Wrong connection code');
          return;
        }

        console.log('Person joined the room');
      },
      onMessage(event, ws) {
        const fullName = event.data as string; // Student's full name

        const session = activeSessions.get(connectionCode);
        if (session) {
          session.clients.add({ ws, fullName });

          ws.send(
            JSON.stringify({
              message: `Welcome ${fullName}! You have joined the exam.`,
            })
          );

          session.clients.forEach((client) => {
            client.ws.send(
              JSON.stringify({
                message: `${fullName} has joined the exam.`,
              })
            );
          });

          if (session.clients.size == 2) {
            startExamTimer(session);
          }
        }
      },
      onClose() {
        console.log('Closing connection');
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
    })
    .from(Exam)
    .where(and(eq(Exam.id, examId)))
    .limit(1);

  if (!exam || exam.length === 0) {
    return c.json({ message: 'Unauthorized action' }, 403);
  }

  const connectionCode = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase(); //4 letter string code

  activeSessions.set(connectionCode, { examId, clients: new Set() });

  return c.json({ success: true, examId, connectionCode });
});

function startExamTimer(session: {
  examId: string;
  clients: Set<{
    ws: WSContext<ServerWebSocket<undefined>>;
    fullName: string;
  }>;
}) {
  const timerDuration = 60; //One minute
  let timeLeft = timerDuration;

  const timerInterval = setInterval(() => {
    timeLeft -= 1;

    session.clients.forEach((client) => {
      client.ws.send(
        JSON.stringify({
          message: `Time left: ${timeLeft} seconds`,
        })
      );
    });

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      session.clients.forEach((client) => {
        client.ws.send(
          JSON.stringify({
            message: 'Time is up! The exam has ended.',
          })
        );
      });
    }
  }, 1000);

  session.clients.forEach((client) => {
    client.ws.send(
      JSON.stringify({
        message: 'The exam has started!',
      })
    );
  });
}

export default ws;
