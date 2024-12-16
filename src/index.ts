import { Hono } from 'hono';

import user from './routes/user';
import auth from './routes/auth';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/user', user);
app.route('/auth', auth);

export default {
  port: 7676,
  fetch: app.fetch,
};
