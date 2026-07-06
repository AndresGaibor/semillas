import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { AppBindings } from "./config/env";
import { errorHandler } from "./shared/middleware/error-handler";
import { createSupabaseAdmin } from "./db/client";

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
    ok: true,
    name: "Semillas API",
    version: "0.1.0"
  });
});

app.get("/health", (c) => {
  return c.json({
    ok: true,
    status: "healthy",
    env: c.env.APP_ENV
  });
});

app.route("/auth", authRoutes);
app.route("/catalog", catalogRoutes);
app.route("/sendas", sendasRoutes);
app.route("/themes", themesRoutes);
app.route("/me", usersRoutes);
app.route("/progress", progressRoutes);
app.route("/activities", activitiesRoutes);
app.route("/admin", adminRoutes);
app.route("/clubs", clubsRoutes);
app.route("/gamification", gamificationRoutes);

app.onError(errorHandler);

export default app;
