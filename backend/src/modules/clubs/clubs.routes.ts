import { Hono } from "hono";
import type { Context } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { esResultadoConError } from "../../shared/errors/result-helpers";
import { createChallengeSchema, createClubSchema, joinClubSchema } from "./clubs.schemas";
import { crearClubsRepository } from "./clubs.repository";
import { crearCasosUsoClubs } from "./casos-uso/clubs";
import { serializarClub, serializarClubPublico, serializarMiembroClub, serializarRetoClub } from "./clubs.mapper";

export const clubsRoutes = new Hono<AppBindings>();

clubsRoutes.use("*", authMiddleware);

function crearCasos(c: Context<AppBindings>) {
  const cliente = c.get("drizzle");
  if (!cliente) throw new Error("Cliente Drizzle no disponible");
  const repositorio = crearClubsRepository(cliente);
  return crearCasosUsoClubs(repositorio);
}

clubsRoutes.get("/mios", async (c) => {
  const casos = crearCasos(c);
  const memberships = await casos.listarMios(c.get("user").id);
  const repositorio = crearClubsRepository(c.get("drizzle")!);
  const conteos = await repositorio.contarMiembrosPorClub();
  const miembrosPorClub = new Map(conteos.map((fila) => [fila.clubId, Number(fila.total)]));
  return responderExito(memberships.map((m) => ({
    ...serializarClub(m.club),
    member_count: miembrosPorClub.get(m.club.id) ?? 0
  })));
});

clubsRoutes.get("/", async (c) => {
  const casos = crearCasos(c);
  const repositorio = crearClubsRepository(c.get("drizzle")!);
  const clubs = await casos.listar(c.req.query("q") ?? undefined);
  const miembros = await repositorio.contarMiembrosPorClub();
  const miembrosPorClub = new Map(miembros.map((fila) => [fila.clubId, Number(fila.total)]));
  return responderExito(clubs.map((club) => ({ ...serializarClubPublico(club), member_count: miembrosPorClub.get(club.id) ?? 0 })));
});

clubsRoutes.get("/:clubId", async (c) => {
  const casos = crearCasos(c);
  const clubId = c.req.param("clubId");
  const membresia = await casos.esMiembro(clubId, c.get("user").id);
  if (!membresia) return responderError("No perteneces a este club", "FORBIDDEN", 403);
  const club = await casos.obtener(clubId);
  if (!club) return responderError("Club no encontrado", "NOT_FOUND", 404);
  const creador = await casos.obtenerCreador(club.creadoPor);
  const members = await casos.listarMiembros(clubId);
  return responderExito({ ...serializarClub(club), created_by: creador ?? null, members: members.map(serializarMiembroClub) });
});

clubsRoutes.post("/", zValidator("json", createClubSchema), async (c) => {
  const casos = crearCasos(c);
  const club = await casos.crear(c.req.valid("json"), c.get("user").id);
  return responderExito(serializarClub(club), 201);
});

clubsRoutes.post("/unirse", zValidator("json", joinClubSchema), async (c) => {
  const casos = crearCasos(c);
  const resultado = await casos.unirsePorCodigo(c.req.valid("json").codigo_acceso, c.get("user").id);
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito({
    unido: !("alreadyMember" in resultado),
    ya_era_miembro: "alreadyMember" in resultado,
    club: serializarClub(resultado.club)
  });
});

clubsRoutes.post("/:clubId/unirse", zValidator("json", joinClubSchema), async (c) => {
  const casos = crearCasos(c);
  const resultado = await casos.unirse(c.req.param("clubId"), c.req.valid("json").codigo_acceso, c.get("user").id);
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito({
    unido: !("alreadyMember" in resultado),
    ya_era_miembro: "alreadyMember" in resultado,
    club: serializarClub(resultado.club)
  });
});

clubsRoutes.post("/:clubId/salir", async (c) => {
  const casos = crearCasos(c);
  const resultado = await casos.salir(c.req.param("clubId"), c.get("user").id);
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito(resultado);
});

clubsRoutes.get("/:clubId/ranking", async (c) => {
  const casos = crearCasos(c);
  const clubId = c.req.param("clubId");
  const membresia = await casos.esMiembro(clubId, c.get("user").id);
  if (!membresia) return responderError("No perteneces a este club", "FORBIDDEN", 403);
  return responderExito(await casos.ranking(clubId));
});

clubsRoutes.get("/:clubId/retos", async (c) => {
  const casos = crearCasos(c);
  const clubId = c.req.param("clubId");
  const membresia = await casos.esMiembro(clubId, c.get("user").id);
  if (!membresia) return responderError("No perteneces a este club", "FORBIDDEN", 403);
  const data = await casos.listarRetos(clubId);
  return responderExito(data.map(serializarRetoClub));
});

clubsRoutes.post("/:clubId/retos", zValidator("json", createChallengeSchema), async (c) => {
  const casos = crearCasos(c);
  const resultado = await casos.crearReto(c.req.param("clubId"), c.req.valid("json"), c.get("user").id);
  if ("error" in resultado) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito(serializarRetoClub(resultado), 201);
});
