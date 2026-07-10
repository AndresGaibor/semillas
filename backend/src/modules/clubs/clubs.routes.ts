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
import { serializarClub, serializarMiembroClub, serializarRetoClub } from "./clubs.mapper";

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
  return responderExito(memberships.map((m) => serializarClub(m.club)));
});

clubsRoutes.get("/", async (c) => {
  const casos = crearCasos(c);
  const repositorio = crearClubsRepository(c.get("drizzle")!);
  const clubs = await casos.listar(c.req.query("q") ?? undefined);
  const miembros = await repositorio.contarMiembrosPorClub();
  const miembrosPorClub = new Map(miembros.map((fila) => [fila.clubId, Number(fila.total)]));
  return responderExito(clubs.map((club) => ({ ...serializarClub(club), member_count: miembrosPorClub.get(club.id) ?? 0 })));
});

clubsRoutes.get("/:clubId", async (c) => {
  const casos = crearCasos(c);
  const club = await casos.obtener(c.req.param("clubId"));
  if (!club) return responderError("Club no encontrado", "NOT_FOUND", 404);
  const creador = await casos.obtenerCreador(club.creadoPor);
  const members = await casos.listarMiembros(c.req.param("clubId"));
  return responderExito({ ...serializarClub(club), created_by: creador ?? null, members: members.map(serializarMiembroClub) });
});

clubsRoutes.post("/", zValidator("json", createClubSchema), async (c) => {
  const casos = crearCasos(c);
  const club = await casos.crear(c.req.valid("json"), c.get("user").id);
  return responderExito(serializarClub(club), 201);
});

clubsRoutes.post("/:clubId/unirse", zValidator("json", joinClubSchema), async (c) => {
  const casos = crearCasos(c);
  const resultado = await casos.unirse(c.req.param("clubId"), c.req.valid("json").inviteCode, c.get("user").id);
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  if ("alreadyMember" in resultado) return responderExito({ mensaje: "Ya eres miembro de este club" });
  return responderExito({ joined: true });
});

clubsRoutes.post("/:clubId/salir", async (c) => {
  const casos = crearCasos(c);
  const resultado = await casos.salir(c.req.param("clubId"), c.get("user").id);
  if (esResultadoConError(resultado)) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito(resultado);
});

clubsRoutes.get("/:clubId/ranking", async (c) => {
  const casos = crearCasos(c);
  return responderExito(await casos.ranking(c.req.param("clubId")));
});

clubsRoutes.get("/:clubId/retos", async (c) => {
  const casos = crearCasos(c);
  const data = await casos.listarRetos(c.req.param("clubId"));
  return responderExito(data.map(serializarRetoClub));
});

clubsRoutes.post("/:clubId/retos", zValidator("json", createChallengeSchema), async (c) => {
  const casos = crearCasos(c);
  const resultado = await casos.crearReto(c.req.param("clubId"), c.req.valid("json"), c.get("user").id);
  if ("error" in resultado) return responderError(resultado.error.mensaje, resultado.error.codigo, resultado.error.estado);
  return responderExito(serializarRetoClub(resultado), 201);
});
