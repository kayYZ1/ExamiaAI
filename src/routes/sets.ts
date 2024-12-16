import { Hono } from 'hono';
import { JwtVariables } from 'hono/jwt';

const sets = new Hono<{ Variables: JwtVariables }>();

sets.use('*');
