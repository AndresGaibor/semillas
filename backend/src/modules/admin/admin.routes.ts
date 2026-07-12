import { Hono } from "hono";
import type { Context } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito } from "../../shared/http/respuesta";
import { BadRequestError } from "../../shared/errors/http-error";
import {
  createActivitySchema,
  createThemeSchema,
  reorderActivitiesSchema,
  resolveReviewSchema,
  submitReviewSchema,
  updateActivitySchema,
  updateThemeSchema,
  updateUserSchema,
  upsertStepContentSchema
} from "./admin.schemas";
import { crearAdminRepository } from "./admin.repository";
import { crearAdminExtraRepository } from "./admin-extra.repository";
import { crearCasoObtenerResumen } from "./casos-uso/resumen";
import { crearCasosUsoActividades } from "./casos-uso/actividades";
import { crearCasosUsoTemas } from "./casos-uso/temas";
import { crearCasosUsoUsuarios } from "./casos-uso/usuarios";
import {
  achievementCreateSchema,
  achievementUpdateSchema,
  clubModerationSchema,
  levelCreateSchema,
  levelUpdateSchema,
  sendaCreateSchema,
  sendaUpdateSchema,
  sendasReorderSchema,
  settingUpdateSchema,
  xpAdjustmentSchema,
} from "./admin-extra.schemas";

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

  function obtenerExtra(c: Context<AppBindings>) {
    const cliente = c.get("drizzle");
    if (!cliente) throw new Error("Cliente Drizzle no disponible");
    return crearAdminExtraRepository(cliente);
  }

  adminRoutes.use("*", authMiddleware);
  adminRoutes.use("*", requireRole("administrador"));

  adminRoutes.get("/resumen", async (c) => {
    const casos = obtenerCasosUso(c);
    return responderExito(await casos.resumen.ejecutar());
  });
  adminRoutes.get("/resumen/detallado", async (c) => responderExito(await obtenerCasosUso(c).resumen.ejecutarDetallado()));
  adminRoutes.get("/actividades", async (c) => {
    const casos = obtenerCasosUso(c);
    return responderExito(await casos.actividades.listar({ temaId: c.req.query("tema_id") ?? undefined, tipoId: c.req.query("tipo_actividad_id") ?? undefined, grupoEdadId: c.req.query("grupo_edad_id") ?? undefined, estado: c.req.query("estado") ?? undefined, limit: Math.min(Math.max(Number(c.req.query("limit") ?? "100"), 1), 500), offset: Math.max(Number(c.req.query("offset") ?? "0"), 0) }));
  });
  adminRoutes.get("/actividades/:actividad_id", async (c) => responderExito(await obtenerCasosUso(c).actividades.obtener(c.req.param("actividad_id"))));
  adminRoutes.get("/temas", async (c) => responderExito(await obtenerCasosUso(c).temas.listar(c.req.query("status") ?? undefined)));
  adminRoutes.get("/temas-listado", async (c) => responderExito(await obtenerCasosUso(c).temas.listarPaginados({
    q: c.req.query("q") ?? undefined,
    estado: c.req.query("estado") ?? undefined,
    sendaId: c.req.query("senda_id") ?? undefined,
    grupoEdadId: c.req.query("grupo_edad_id") ?? undefined,
    limit: Math.min(Math.max(Number(c.req.query("limit") ?? "20"), 1), 100),
    offset: Math.max(Number(c.req.query("offset") ?? "0"), 0)
  })));
  adminRoutes.get("/temas/:tema_id/estudio", async (c) => responderExito(await obtenerCasosUso(c).temas.obtenerEstudio(c.req.param("tema_id"))));
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
  adminRoutes.post("/actividades/:actividad_id/duplicar", async (c) => responderExito(await obtenerCasosUso(c).actividades.duplicar(c.req.param("actividad_id")), 201));
  adminRoutes.post("/temas/:tema_id/actividades/reordenar", zValidator("json", reorderActivitiesSchema), async (c) => responderExito(await obtenerCasosUso(c).actividades.reordenar(c.req.param("tema_id"), c.req.valid("json"))));
  adminRoutes.post("/temas/:tema_id/enviar-revision", zValidator("json", submitReviewSchema), async (c) => responderExito(await obtenerCasosUso(c).temas.enviarRevision(c.req.param("tema_id"), c.req.valid("json"), c.get("user").id)));
  adminRoutes.post("/temas/:tema_id/resolver-revision", zValidator("json", resolveReviewSchema), async (c) => responderExito(await obtenerCasosUso(c).temas.resolverRevision(c.req.param("tema_id"), c.req.valid("json"), c.get("user").id)));
  adminRoutes.post("/temas/:tema_id/publicar", async (c) => responderExito(await obtenerCasosUso(c).temas.publicar(c.req.param("tema_id"), c.get("user").id)));
  adminRoutes.post("/temas/:tema_id/borrador", async (c) => responderExito(await obtenerCasosUso(c).temas.guardarBorrador(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/archivar", async (c) => responderExito(await obtenerCasosUso(c).temas.archivar(c.req.param("tema_id"))));
  adminRoutes.post("/temas/:tema_id/duplicar", async (c) => responderExito(await obtenerCasosUso(c).temas.duplicar(c.req.param("tema_id"), c.get("user")), 201));
  adminRoutes.get("/usuarios", async (c) => responderExito(await obtenerCasosUso(c).usuarios.listar({
    q: c.req.query("q") ?? undefined,
    rol: c.req.query("rol") ?? undefined,
    activo: c.req.query("activo") === undefined ? undefined : c.req.query("activo") === "true",
    limit: Math.min(Math.max(Number(c.req.query("limit") ?? "20"), 1), 100),
    offset: Math.max(Number(c.req.query("offset") ?? "0"), 0),
  })));
  adminRoutes.get("/usuarios/:usuario_id", async (c) => responderExito(await obtenerCasosUso(c).usuarios.obtener(c.req.param("usuario_id"))));
  adminRoutes.patch("/usuarios/:usuario_id", zValidator("json", updateUserSchema), async (c) => {
    const objetivo = c.req.param("usuario_id");
    if (objetivo === c.get("user").id && c.req.valid("json").activo === false) {
      throw new BadRequestError("No puedes desactivar tu propia cuenta administrativa");
    }
    return responderExito(await obtenerCasosUso(c).usuarios.actualizar(objetivo, c.req.valid("json"), c.get("user").id));
  });
  adminRoutes.delete("/usuarios/:usuario_id", async (c) => {
    const objetivo = c.req.param("usuario_id");
    if (objetivo === c.get("user").id) throw new BadRequestError("No puedes desactivar tu propia cuenta administrativa");
    return responderExito(await obtenerCasosUso(c).usuarios.eliminar(objetivo, c.get("user").id));
  });
  adminRoutes.post("/usuarios/:usuario_id/ajustar-xp", zValidator("json", xpAdjustmentSchema), async (c) =>
    responderExito(await obtenerExtra(c).ajustarXpUsuario(
      c.req.param("usuario_id"),
      c.req.valid("json"),
      c.get("user").id,
    ), 201),
  );

  // Sendas: catálogo editorial completo.
  adminRoutes.get("/sendas", async (c) => responderExito(await obtenerExtra(c).listarSendas()));
  adminRoutes.post("/sendas", zValidator("json", sendaCreateSchema), async (c) => responderExito(await obtenerExtra(c).crearSenda(c.req.valid("json"), c.get("user").id), 201));
  adminRoutes.patch("/sendas/:senda_id", zValidator("json", sendaUpdateSchema), async (c) => responderExito(await obtenerExtra(c).actualizarSenda(c.req.param("senda_id"), c.req.valid("json"), c.get("user").id)));
  adminRoutes.post("/sendas/reordenar", zValidator("json", sendasReorderSchema), async (c) => responderExito(await obtenerExtra(c).reordenarSendas(c.req.valid("json").senda_ids, c.get("user").id)));
  adminRoutes.delete("/sendas/:senda_id", async (c) => responderExito(await obtenerExtra(c).eliminarSenda(c.req.param("senda_id"), c.get("user").id)));

  // Moderación global de clubes.
  adminRoutes.get("/clubes", async (c) => responderExito(await obtenerExtra(c).listarClubes({
    q: c.req.query("q") ?? undefined,
    activo: c.req.query("activo") === undefined ? undefined : c.req.query("activo") === "true",
    limit: Math.min(Math.max(Number(c.req.query("limit") ?? "20"), 1), 100),
    offset: Math.max(Number(c.req.query("offset") ?? "0"), 0),
  })));
  adminRoutes.get("/clubes/:club_id", async (c) => responderExito(await obtenerExtra(c).obtenerClub(c.req.param("club_id"))));
  adminRoutes.patch("/clubes/:club_id", zValidator("json", clubModerationSchema), async (c) => responderExito(await obtenerExtra(c).moderarClub(c.req.param("club_id"), c.req.valid("json"), c.get("user").id)));

  // Reportes, auditoría y exportación desde una única fuente real.
  adminRoutes.get("/reportes", async (c) => {
    const hasta = c.req.query("hasta") ? new Date(c.req.query("hasta")!) : new Date();
    const desde = c.req.query("desde") ? new Date(c.req.query("desde")!) : new Date(hasta.getTime() - 29 * 86_400_000);
    return responderExito(await obtenerExtra(c).obtenerReportes(desde, hasta));
  });
  adminRoutes.get("/auditoria", async (c) => responderExito(await obtenerExtra(c).listarAuditoria({
    q: c.req.query("q") ?? undefined,
    entidad: c.req.query("entidad") ?? undefined,
    limit: Math.min(Math.max(Number(c.req.query("limit") ?? "30"), 1), 100),
    offset: Math.max(Number(c.req.query("offset") ?? "0"), 0),
  })));

  // Ajustes y reglas de gamificación gobernadas por backend.
  adminRoutes.get("/ajustes", async (c) => responderExito(await obtenerExtra(c).listarAjustes()));
  adminRoutes.put("/ajustes/:clave", zValidator("json", settingUpdateSchema), async (c) => responderExito(await obtenerExtra(c).guardarAjuste(c.req.param("clave"), c.req.valid("json"), c.get("user").id)));
  adminRoutes.get("/gamificacion", async (c) => responderExito(await obtenerExtra(c).listarConfiguracionGamificacion()));
  adminRoutes.post("/gamificacion/niveles", zValidator("json", levelCreateSchema), async (c) => responderExito(await obtenerExtra(c).crearNivel(c.req.valid("json"), c.get("user").id), 201));
  adminRoutes.patch("/gamificacion/niveles/:nivel_id", zValidator("json", levelUpdateSchema), async (c) => responderExito(await obtenerExtra(c).actualizarNivel(c.req.param("nivel_id"), c.req.valid("json"), c.get("user").id)));
  adminRoutes.post("/gamificacion/logros", zValidator("json", achievementCreateSchema), async (c) => responderExito(await obtenerExtra(c).crearLogro(c.req.valid("json"), c.get("user").id), 201));
  adminRoutes.patch("/gamificacion/logros/:logro_id", zValidator("json", achievementUpdateSchema), async (c) => responderExito(await obtenerExtra(c).actualizarLogro(c.req.param("logro_id"), c.req.valid("json"), c.get("user").id)));

  return adminRoutes;
}

export const adminRoutes = crearModuloAdmin();
