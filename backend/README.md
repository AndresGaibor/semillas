# Semillas API

API base de Semillas construida con Hono para Cloudflare Workers.

## Stack

- Bun
- Hono
- TypeScript
- Cloudflare Workers
- Wrangler

## Instalación

```bash
bun install
```

## Desarrollo

```bash
bun run start:dev
```

Para ejecutar localmente con Bun:

```bash
bun run start
```

Por defecto la API local escucha en `http://localhost:8787`.

## Pruebas

```bash
bun run test
bun run test:e2e
```

## Build

```bash
bun run build
```

## Deploy

```bash
bun run deploy
```

La entrada del Worker es `src/index.ts` y la configuración está en `wrangler.jsonc`.
