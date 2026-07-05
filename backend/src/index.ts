import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) =>
  c.json({
    success: true,
    data: {
      message: 'Semillas API',
    },
  }),
);

app.get('/health', (c) =>
  c.json({
    success: true,
    data: {
      service: 'semillas-api',
      status: 'ok',
    },
  }),
);

export default app;
