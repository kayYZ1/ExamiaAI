import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid"

import { db } from "../lib/db";

const user = new Hono();

user.get('/', async (c) => {
  const { rows } = await db.execute("SELECT * FROM USERS");
  return c.json({ rows })
})

user.post('/', async (c) => {
  const body = await c.req.json();
  const { email } = body;
  const id = uuidv4();
  const date = Date.now();

  await db.execute({
    sql: "INSERT INTO USERS values (?, ?, ?, ?)",
    args: [id, email, date, date]
  })

  return c.json(`User ${email} created.`, 201);
})

export default user