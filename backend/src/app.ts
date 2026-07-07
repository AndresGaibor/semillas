import { Hono } from "hono";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { AppBindings } from "./config/env";
import { APP_NAME, APP_VERSION } from "./config/constants";
import { createSupabaseAdmin } from "./db/client";
import { openApiSpec } from "./openapi/spec";
import { errorHandler } from "./shared/middleware/error-handler";

import { authRoutes } from "./modules/auth/auth.routes";
import { catalogRoutes } from "./modules/catalog/catalog.routes";
import { sendasRoutes } from "./modules/sendas/sendas.routes";
import { themesRoutes } from "./modules/themes/themes.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { progressRoutes } from "./modules/progress/progress.routes";
import { activitiesRoutes } from "./modules/activities/activities.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { clubsRoutes } from "./modules/clubs/clubs.routes";
import { gamificationRoutes } from "./modules/gamification/gamification.routes";

const app = new Hono<AppBindings>();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowed = c.env.CORS_ORIGIN;
      if (!origin) return allowed;
      if (origin?.startsWith("http://localhost")) return origin;
      return origin === allowed ? origin : allowed;
    },
    allowHeaders: ["Content-Type", "Authorization", "X-Guest-User-Id"],
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use("*", async (c, next) => {
  c.set("db", createSupabaseAdmin(c.env));
  await next();
});

app.get("/", (c) => {
  return c.json({
    exito: true,
    datos: {
      nombre: APP_NAME,
      version: APP_VERSION
    }
  });
});

app.get("/openapi.json", (c) => {
  return c.json(openApiSpec);
});

app.get(
  "/docs",
  Scalar({
    spec: { url: "/openapi.json" },
    theme: "kepler",
    layout: "modern",
    defaultHttpClient: { targetKey: "javascript", clientKey: "fetch" },
    metaData: { title: `${APP_NAME} — API Docs` }
  })
);

app.get("/health", (c) => {
  return c.json({
    exito: true,
    datos: {
      estado: "healthy",
      entorno: c.env.APP_ENV
    }
  });
});

app.route("/autenticacion", authRoutes);
app.route("/catalogo", catalogRoutes);
app.route("/sendas", sendasRoutes);
app.route("/temas", themesRoutes);
app.route("/perfil", usersRoutes);
app.route("/progreso", progressRoutes);
app.route("/actividades", activitiesRoutes);
app.route("/administracion", adminRoutes);
app.route("/clubes", clubsRoutes);
app.route("/gamificacion", gamificationRoutes);

app.onError(errorHandler);

export default app;
