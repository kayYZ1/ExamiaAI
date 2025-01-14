import { Hono } from 'hono';
import { cors } from 'hono/cors';

import user from './routes/user';
import auth from './routes/auth';
import set from './routes/set';
import question from './routes/question';
import exam from './routes/exam';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173/',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
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

export default {
  port: 7676,
  fetch: app.fetch,
  idleTimeout: 15,
};
