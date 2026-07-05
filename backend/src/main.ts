import app from './index';

const port = Number(Bun.env.PORT ?? 8787);

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Semillas API escuchando en http://localhost:${port}`);
