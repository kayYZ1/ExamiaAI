import { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { decode } from 'hono/jwt';

export const getUserIdFromCookie = (c: Context) => {
  const authCookie = getCookie(c, 'auth') as string;
  const { payload } = decode(authCookie);

  return payload.id as string;
};
