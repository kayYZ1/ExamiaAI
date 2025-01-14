import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import type { ServerWebSocket } from 'bun';

const ws = new Hono();

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

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

export default ws;
