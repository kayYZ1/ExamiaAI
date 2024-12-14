import { Hono } from 'hono';

import user from './routes/user';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/user', user)

export default {
  port: 7676,
  fetch: app.fetch,
};
