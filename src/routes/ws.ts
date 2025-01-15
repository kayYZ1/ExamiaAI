import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import { eq, and } from 'drizzle-orm';
import type { ServerWebSocket } from 'bun';
import { WSEvents } from 'hono/ws';

import { db } from '../db/turso';
import { getUserIdFromCookie } from '../shared/utils';
import { User, Exam } from '../db/schema';

const ws = new Hono();

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

const activeSessions: Map<string, { examId: string; clients: Set<any> }> =
  new Map();

ws.get(
  '/',
  upgradeWebSocket((c) => {
    return {
      onOpen() {
        console.log('WebSocket connection opened');
      },
      onMessage(event, ws) {
        console.log(`Message received: ${event.data}`);
        ws.send(`Server echo: ${event.data}`);
      },
      onClose() {
        console.log('WebSocket connection closed');
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
    .toUpperCase();

  activeSessions.set(connectionCode, { examId, clients: new Set() });

  return c.json({ success: true, examId, connectionCode });
});

ws.get(
  '/session',
  upgradeWebSocket((c) => {
    const url = new URL(c.req.url);
    const joinCode = url.searchParams.get('code');

    if (!joinCode || !activeSessions.has(joinCode)) {
      return {};
    }

    const session = activeSessions.get(joinCode)!;

    return {
      onOpen(ws: ServerWebSocket) {
        console.log(`Participant joined session: ${joinCode}`);
        session.clients.add(ws);
      },
      onMessage(event: MessageEvent, ws: ServerWebSocket) {
        console.log(`Message from participant: ${event.data}`);
        session.clients.forEach((client) => {
          if (client !== ws) {
            client.send(`Participant: ${event.data}`);
          }
        });
      },
      onClose(ws: ServerWebSocket) {
        console.log(`Participant left session: ${joinCode}`);
        session.clients.delete(ws);

        if (session.clients.size === 0) {
          console.log(`Closing session: ${joinCode}`);
          activeSessions.delete(joinCode);
        }
      },
    };
  })
);

export default ws;
