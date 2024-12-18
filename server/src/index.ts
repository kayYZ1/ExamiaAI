import { Hono } from 'hono';
import { cors } from 'hono/cors';

import user from './routes/user';
import auth from './routes/auth';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

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

app.route('/user', user);
app.route('/auth', auth);

export default {
  port: 7676,
  fetch: app.fetch,
};
