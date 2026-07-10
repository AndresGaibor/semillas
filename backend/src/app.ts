/**
 * ============================================================
 * PUNTO DE ENTRADA DE LA API - SEMILLAS
 * ============================================================
 *
 * Este archivo configura la aplicación Hono con:
 * - Middlewares (CORS, logger, manejo de errores)
 * - Rutas de la API
 * - Documentación OpenAPI con Scalar
 * - Health check
 *
 * La API sigue el patrón de respuestas:
 * - Éxito: { exito: true, datos: {...} }
 * - Error: { exito: false, error: {...} }
 *
 * @module app
 */

import { Hono } from "hono";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { AppBindings } from "./config/env";
import { APP_NAME, APP_VERSION } from "./config/constants";
import { createSupabaseAdmin } from "./db/client";
import { openApiSpec } from "./openapi/spec";
import { errorHandler } from "./shared/middleware/error-handler";
import { requestIdMiddleware } from "./shared/middleware/request-id.middleware";

/**
 * Rutas de la API
 * Cada módulo maneja un grupo de endpoints relacionados
 */
import { authRoutes } from "./modules/auth/auth.routes";
import { crearModuloCatalogo } from "./modules/catalog/catalog.routes";
import { crearModuloSendas } from "./modules/sendas/sendas.routes";
import { themesRoutes } from "./modules/themes/themes.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { progressRoutes } from "./modules/progress/progress.routes";
import { activitiesRoutes } from "./modules/activities/activities.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { clubsRoutes } from "./modules/clubs/clubs.routes";
import { gamificationRoutes } from "./modules/gamification/gamification.routes";
import { mediaRoutes } from "./modules/media/media.routes";
import { syncRoutes } from "./modules/sync/sync.routes";

/**
 * Aplicación principal de Hono
 * @see https://hono.dev/
 */
const app = new Hono<AppBindings>();

/**
 * ============================================================
 * MIDDLEWARES GLOBALES
 * ============================================================
 */

/**
 * Logger para todas las peticiones
 * Muestra método, ruta, status y tiempo de respuesta
 */
app.use("*", logger());
app.use("*", requestIdMiddleware());

/**
 * Configuración de CORS
 * Permite peticiones desde el frontend y apps móviles
 */
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

/**
 * Middleware que inyecta el cliente de Supabase en el contexto
 * Usado por los módulos legacy que aún usan Supabase JS directamente
 *
 * NOTA: Los nuevos módulos deben usar Drizzle importando `db` desde db/client.ts
 * Este cliente de Supabase se mantiene para:
 * - Auth (crear usuarios, etc.)
 * - Storage (subir archivos)
 * - Edge functions de Supabase
 */
app.use("*", async (c, next) => {
  c.set("db", createSupabaseAdmin(c.env));
  await next();
});

/**
 * ============================================================
 * ENDPOINTS PÚBLICOS
 * ============================================================
 */

/**
 * GET /
 *
 * Información básica de la API
 */
app.get("/", (c) => {
  return c.json({
    exito: true,
    datos: {
      nombre: APP_NAME,
      version: APP_VERSION
    }
  });
});

/**
 * GET /openapi.json
 *
 * Especificación OpenAPI 3.0 en formato JSON
 * Usada por Scalar para generar la documentación
 */
app.get("/openapi.json", (c) => {
  return c.json(openApiSpec);
});

/**
 * GET /docs
 *
 * Documentación interactiva de la API usando Scalar
 * Accesible desde el navegador en entorno de desarrollo
 */
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

/**
 * GET /health
 *
 * Endpoint de salud para verificar que el servicio está activo
 * Útil para load balancers y monitoring
 */
app.get("/health", (c) => {
  return c.json({
    exito: true,
    datos: {
      estado: "healthy",
      entorno: c.env.APP_ENV
    }
  });
});

/**
 * ============================================================
 * REGISTRO DE RUTAS
 * ============================================================
 * Cada módulo se monta en una ruta base:
 * - /autenticacion - Login y registro
 * - /catalogo - Catálogos estáticos (grupos de edad, tipos de actividad, etc.)
 * - /sendas - Sendas espirituales (Padre, Hijo, Espíritu Santo)
 * - /temas - Temas bíblicos
 * - /perfil - Perfil del usuario
 * - /progreso - Progreso y eventos
 * - /actividades - Actividades y quiz
 * - /administracion - CMS para admins
 * - /clubes - Clubes y retos cooperativos
 * - /gamificacion - Logros, niveles y XP
 * - /media - Carga y gestión de archivos
 * - /sync - Sincronización offline
 */

app.route("/autenticacion", authRoutes);
app.route("/catalogo", crearModuloCatalogo());
app.route("/sendas", crearModuloSendas());
app.route("/temas", themesRoutes);
app.route("/perfil", usersRoutes);
app.route("/progreso", progressRoutes);
app.route("/actividades", activitiesRoutes);
app.route("/administracion", adminRoutes);
app.route("/clubes", clubsRoutes);
app.route("/gamificacion", gamificationRoutes);
app.route("/media", mediaRoutes);
app.route("/sync", syncRoutes);

/**
 * ============================================================
 * MANEJO DE ERRORES
 * ============================================================
 * El handler de errores captura excepciones y las convierte
 * a respuestas JSON consistentes
 */
app.onError(errorHandler);

export default app;
