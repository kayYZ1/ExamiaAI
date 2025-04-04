import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

import user from './routes/user';
import auth from './routes/auth';
import set from './routes/set';
import question from './routes/question';
import exam from './routes/exam';
import ws from './routes/ws';

const app = new Hono();

const { websocket } = createBunWebSocket<ServerWebSocket>();

app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'https://examia-ai.netlify.app',
      'https://examia.xyz',
      'https://www.examia.xyz',
    ],
    allowHeaders: [
      'X-Custom-Header',
      'Upgrade-Insecure-Requests',
      'Content-Type',
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'DELETE'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/user', user);
app.route('/auth', auth);
app.route('/set', set);
app.route('/question', question);
app.route('/exam', exam);
app.route('/ws', ws);

export const appInstance = app;

export default {
  fetch: app.fetch,
  port: 7676,
  websocket,
};
