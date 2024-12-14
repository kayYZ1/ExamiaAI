import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid"

import { db } from "../db/turso";
import { Users } from "../db/schema";

const user = new Hono();

user.get('/', async (c) => {
  const result = await db.select().from(Users).all();
  return c.json(result, 200)
})

user.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuidv4();
  const { email } = body;

  await db.insert(Users).values({ id, email });

  return c.json(`User ${email} created.`, 201);
})

export default user