import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito } from "../../shared/http/respuesta";
import {
  createActivitySchema,
  createThemeSchema,
  updateActivitySchema,
  updateThemeSchema,
  updateUserSchema,
  upsertStepContentSchema
} from "./admin.schemas";
import { crearAdminRepository } from "./admin.repository";
import { crearCasosUsoAdmin } from "./admin.use-cases";

export function crearModuloAdmin() {
  const adminRoutes = new Hono<AppBindings>();

  adminRoutes.use("*", authMiddleware);
  adminRoutes.use("*", requireRole("administrador"));

  adminRoutes.get("/resumen", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).obtenerResumen()));
  adminRoutes.get("/actividades", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).listarActividades({ temaId: c.req.query("tema_id") ?? undefined, tipoId: c.req.query("tipo_actividad_id") ?? undefined, grupoEdadId: c.req.query("grupo_edad_id") ?? undefined, estado: c.req.query("estado") ?? undefined, limit: Math.min(Math.max(Number(c.req.query("limit") ?? "100"), 1), 500), offset: Math.max(Number(c.req.query("offset") ?? "0"), 0) })));
  adminRoutes.get("/temas", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).listarTemas(c.req.query("status") ?? undefined)));
  adminRoutes.get("/temas/:tema_id", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).obtenerTema(c.req.param("tema_id"))));
  adminRoutes.post("/temas", zValidator("json", createThemeSchema), async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).crearTema(c.req.valid("json"), c.get("user").id), 201));
  adminRoutes.patch("/temas/:tema_id", zValidator("json", updateThemeSchema), async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).actualizarTema(c.req.param("tema_id"), c.req.valid("json"))));
  adminRoutes.delete("/temas/:tema_id", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).borrarTema(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/pasos", zValidator("json", upsertStepContentSchema), async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).crearPasoTema(c.req.param("tema_id"), c.req.valid("json"))));
  adminRoutes.get("/temas/:tema_id/pasos", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).listarPasosTema(c.req.param("tema_id"))));
  adminRoutes.delete("/temas/:tema_id/pasos/:tipo_paso_id", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).borrarPasoTema(c.req.param("tema_id"), c.req.param("tipo_paso_id"))));
  adminRoutes.post("/actividades", zValidator("json", createActivitySchema), async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).crearActividad(c.req.valid("json")), 201));
  adminRoutes.patch("/actividades/:actividad_id", zValidator("json", updateActivitySchema), async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).actualizarActividad(c.req.param("actividad_id"), c.req.valid("json"))));
  adminRoutes.delete("/actividades/:actividad_id", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).borrarActividad(c.req.param("actividad_id"))));
  adminRoutes.post("/temas/:tema_id/publicar", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).publicarTema(c.req.param("tema_id"), c.get("user").id)));
  adminRoutes.post("/temas/:tema_id/borrador", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).guardarBorradorTema(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/archivar", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).archivarTema(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/duplicar", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).duplicarTema(c.req.param("tema_id"), c.get("user")), 201));
  adminRoutes.get("/usuarios", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).listarUsuarios({ q: c.req.query("q") ?? undefined, rol: c.req.query("rol") ?? undefined, limit: Math.min(Math.max(Number(c.req.query("limit") ?? "20"), 1), 100), offset: Math.max(Number(c.req.query("offset") ?? "0"), 0) })));
  adminRoutes.get("/usuarios/:usuario_id", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).obtenerUsuario(c.req.param("usuario_id"))));
  adminRoutes.patch("/usuarios/:usuario_id", zValidator("json", updateUserSchema), async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).actualizarUsuario(c.req.param("usuario_id"), c.req.valid("json"))));
  adminRoutes.delete("/usuarios/:usuario_id", async (c) => responderExito(await crearCasosUsoAdmin(crearAdminRepository(c.get("db"))).eliminarUsuario(c.req.param("usuario_id"))));

  return adminRoutes;
}

export const adminRoutes = crearModuloAdmin();
