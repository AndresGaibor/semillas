import { Hono } from "hono";
import type { Context } from "hono";
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
import { crearCasoObtenerResumen } from "./casos-uso/resumen";
import { crearCasosUsoActividades } from "./casos-uso/actividades";
import { crearCasosUsoTemas } from "./casos-uso/temas";
import { crearCasosUsoUsuarios } from "./casos-uso/usuarios";

export function crearModuloAdmin() {
  const adminRoutes = new Hono<AppBindings>();

  function obtenerCasosUso(c: Context<AppBindings>) {
    const repositorio = crearAdminRepository({ supabase: c.get("db"), drizzle: c.get("drizzle") });

    return {
      resumen: crearCasoObtenerResumen(repositorio),
      actividades: crearCasosUsoActividades(repositorio),
      temas: crearCasosUsoTemas(repositorio),
      usuarios: crearCasosUsoUsuarios(repositorio)
    };
  }

  adminRoutes.use("*", authMiddleware);
  adminRoutes.use("*", requireRole("administrador"));

  adminRoutes.get("/resumen", async (c) => {
    const casos = obtenerCasosUso(c);
    return responderExito(await casos.resumen.ejecutar());
  });
  adminRoutes.get("/actividades", async (c) => {
    const casos = obtenerCasosUso(c);
    return responderExito(await casos.actividades.listar({ temaId: c.req.query("tema_id") ?? undefined, tipoId: c.req.query("tipo_actividad_id") ?? undefined, grupoEdadId: c.req.query("grupo_edad_id") ?? undefined, estado: c.req.query("estado") ?? undefined, limit: Math.min(Math.max(Number(c.req.query("limit") ?? "100"), 1), 500), offset: Math.max(Number(c.req.query("offset") ?? "0"), 0) }));
  });
  adminRoutes.get("/actividades/:actividad_id", async (c) => responderExito(await obtenerCasosUso(c).actividades.obtener(c.req.param("actividad_id"))));
  adminRoutes.get("/temas", async (c) => responderExito(await obtenerCasosUso(c).temas.listar(c.req.query("status") ?? undefined)));
  adminRoutes.get("/temas/:tema_id", async (c) => responderExito(await obtenerCasosUso(c).temas.obtener(c.req.param("tema_id"))));
  adminRoutes.post("/temas", zValidator("json", createThemeSchema), async (c) => responderExito(await obtenerCasosUso(c).temas.crear(c.req.valid("json"), c.get("user").id), 201));
  adminRoutes.patch("/temas/:tema_id", zValidator("json", updateThemeSchema), async (c) => responderExito(await obtenerCasosUso(c).temas.actualizar(c.req.param("tema_id"), c.req.valid("json"))));
  adminRoutes.delete("/temas/:tema_id", async (c) => responderExito(await obtenerCasosUso(c).temas.eliminar(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/pasos", zValidator("json", upsertStepContentSchema), async (c) => responderExito(await obtenerCasosUso(c).temas.crearPaso(c.req.param("tema_id"), c.req.valid("json"))));
  adminRoutes.get("/temas/:tema_id/pasos", async (c) => responderExito(await obtenerCasosUso(c).temas.listarPasos(c.req.param("tema_id"))));
  adminRoutes.delete("/temas/:tema_id/pasos/:tipo_paso_id", async (c) => responderExito(await obtenerCasosUso(c).temas.eliminarPaso(c.req.param("tema_id"), c.req.param("tipo_paso_id"))));
  adminRoutes.post("/actividades", zValidator("json", createActivitySchema), async (c) => responderExito(await obtenerCasosUso(c).actividades.crear(c.req.valid("json")), 201));
  adminRoutes.patch("/actividades/:actividad_id", zValidator("json", updateActivitySchema), async (c) => responderExito(await obtenerCasosUso(c).actividades.actualizar(c.req.param("actividad_id"), c.req.valid("json"))));
  adminRoutes.delete("/actividades/:actividad_id", async (c) => responderExito(await obtenerCasosUso(c).actividades.eliminar(c.req.param("actividad_id"))));
  adminRoutes.post("/temas/:tema_id/publicar", async (c) => responderExito(await obtenerCasosUso(c).temas.publicar(c.req.param("tema_id"), c.get("user").id)));
  adminRoutes.post("/temas/:tema_id/borrador", async (c) => responderExito(await obtenerCasosUso(c).temas.guardarBorrador(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/archivar", async (c) => responderExito(await obtenerCasosUso(c).temas.archivar(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/duplicar", async (c) => responderExito(await obtenerCasosUso(c).temas.duplicar(c.req.param("tema_id"), c.get("user")), 201));
  adminRoutes.get("/usuarios", async (c) => responderExito(await obtenerCasosUso(c).usuarios.listar({ q: c.req.query("q") ?? undefined, rol: c.req.query("rol") ?? undefined, limit: Math.min(Math.max(Number(c.req.query("limit") ?? "20"), 1), 100), offset: Math.max(Number(c.req.query("offset") ?? "0"), 0) })));
  adminRoutes.get("/usuarios/:usuario_id", async (c) => responderExito(await obtenerCasosUso(c).usuarios.obtener(c.req.param("usuario_id"))));
  adminRoutes.patch("/usuarios/:usuario_id", zValidator("json", updateUserSchema), async (c) => responderExito(await obtenerCasosUso(c).usuarios.actualizar(c.req.param("usuario_id"), c.req.valid("json"))));
  adminRoutes.delete("/usuarios/:usuario_id", async (c) => responderExito(await obtenerCasosUso(c).usuarios.eliminar(c.req.param("usuario_id"))));

  return adminRoutes;
}

export const adminRoutes = crearModuloAdmin();
