import { Hono } from "hono";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { NotFoundError, ForbiddenError } from "../../shared/errors/http-error";
import {
  createChallengeSchema,
  createClubSchema,
  joinClubSchema
} from "./clubs.schemas";
import { db, schema } from "../../db/client";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function serializarClub(fila: typeof schema.club.$inferSelect) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    codigo_invitacion: fila.codigoInvitacion,
    creado_por: fila.creadoPor,
    activo: fila.activo,
    creado_en: fila.creadoEn.toISOString()
  };
}

function serializarMiembroClub(fila: typeof schema.miembroClub.$inferSelect) {
  return {
    club_id: fila.clubId,
    usuario_id: fila.usuarioId,
    rol_miembro: fila.rolMiembro,
    unido_en: fila.unidoEn.toISOString()
  };
}

function serializarRetoClub(fila: typeof schema.retoClub.$inferSelect) {
  return {
    id: fila.id,
    club_id: fila.clubId,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    codigo_metrica: fila.codigoMetrica,
    valor_objetivo: fila.valorObjetivo,
    xp_reto: fila.xpReto,
    fecha_inicio: fila.fechaInicio.toISOString(),
    fecha_fin: fila.fechaFin.toISOString(),
    creado_por: fila.creadoPor,
    creado_en: fila.creadoEn.toISOString()
  };
}

export const clubsRoutes = new Hono<AppBindings>();

clubsRoutes.use("*", authMiddleware);

clubsRoutes.get("/mios", async (c) => {
  const user = c.get("user");

  const memberships = await db
    .select({ club: schema.club })
    .from(schema.miembroClub)
    .innerJoin(schema.club, eq(schema.miembroClub.clubId, schema.club.id))
    .where(eq(schema.miembroClub.usuarioId, user.id));

  return responderExito(memberships.map((m) => serializarClub(m.club)));
});

clubsRoutes.get("/", async (c) => {
  const search = c.req.query("q");

  const condiciones = [eq(schema.club.activo, true)];
  if (search) {
    condiciones.push(ilike(schema.club.nombre, `%${search}%`));
  }

  const clubs = await db
    .select()
    .from(schema.club)
    .where(and(...condiciones))
    .orderBy(desc(schema.club.creadoEn));

  const miembros = await db
    .select({ clubId: schema.miembroClub.clubId, total: sql<number>`count(*)` })
    .from(schema.miembroClub)
    .groupBy(schema.miembroClub.clubId);

  const miembrosPorClub = new Map(miembros.map((fila) => [fila.clubId, Number(fila.total)]));

  return responderExito(
    clubs.map((club) => ({
      ...serializarClub(club),
      member_count: miembrosPorClub.get(club.id) ?? 0
    }))
  );
});

clubsRoutes.get("/:clubId", async (c) => {
  const clubId = c.req.param("clubId");

  const [club] = await db
    .select()
    .from(schema.club)
    .where(eq(schema.club.id, clubId))
    .limit(1);

  if (!club) throw new NotFoundError("Club no encontrado");

  const [creador] = await db
    .select({ id: schema.usuarioApp.id, nombre_visible: schema.usuarioApp.nombreVisible })
    .from(schema.usuarioApp)
    .where(eq(schema.usuarioApp.id, club.creadoPor))
    .limit(1);

  const members = await db
    .select()
    .from(schema.miembroClub)
    .where(eq(schema.miembroClub.clubId, clubId));

  return responderExito({
    ...serializarClub(club),
    created_by: creador ?? null,
    members: members.map(serializarMiembroClub)
  });
});

clubsRoutes.post("/", zValidator("json", createClubSchema), async (c) => {
  const user = c.get("user");
  const body = c.req.valid("json");

  let inviteCode = generateInviteCode();
  let attempts = 0;

  while (attempts < 5) {
    const [existing] = await db
      .select({ id: schema.club.id })
      .from(schema.club)
      .where(eq(schema.club.codigoInvitacion, inviteCode))
      .limit(1);

    if (!existing) break;

    inviteCode = generateInviteCode();
    attempts++;
  }

  const [club] = await db
    .insert(schema.club)
    .values({
      nombre: body.name,
      descripcion: body.description ?? null,
      codigoInvitacion: inviteCode,
      creadoPor: user.id
    })
    .returning();

  await db.insert(schema.miembroClub).values({
    clubId: club.id,
    usuarioId: user.id,
    rolMiembro: "lider"
  });

  return responderExito(serializarClub(club), 201);
});

clubsRoutes.post("/:clubId/unirse", zValidator("json", joinClubSchema), async (c) => {
  const user = c.get("user");
  const clubId = c.req.param("clubId");
  const body = c.req.valid("json");

  const [club] = await db
    .select({ id: schema.club.id, codigoInvitacion: schema.club.codigoInvitacion, activo: schema.club.activo })
    .from(schema.club)
    .where(eq(schema.club.id, clubId))
    .limit(1);

  if (!club) throw new NotFoundError("Club no encontrado");
  if (!club.activo) throw new ForbiddenError("Club inactivo");
  if (club.codigoInvitacion !== body.inviteCode) {
    return responderError("Código de invitación incorrecto", "CODIGO_INCORRECTO", 403);
  }

  const [existing] = await db
    .select({ usuarioId: schema.miembroClub.usuarioId })
    .from(schema.miembroClub)
    .where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, user.id)))
    .limit(1);

  if (existing) {
    return responderExito({ mensaje: "Ya eres miembro de este club" });
  }

  await db.insert(schema.miembroClub).values({
    clubId,
    usuarioId: user.id,
    rolMiembro: "miembro"
  });

  return responderExito({ joined: true });
});

clubsRoutes.post("/:clubId/salir", async (c) => {
  const user = c.get("user");
  const clubId = c.req.param("clubId");

  const [membership] = await db
    .select({ rolMiembro: schema.miembroClub.rolMiembro })
    .from(schema.miembroClub)
    .where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, user.id)))
    .limit(1);

  if (!membership) throw new NotFoundError("No eres miembro de este club");

  if (membership.rolMiembro === "lider") {
    const [countRow] = await db
      .select({ total: sql<number>`count(*)` })
      .from(schema.miembroClub)
      .where(eq(schema.miembroClub.clubId, clubId));

    if (Number(countRow?.total ?? 0) > 1) {
      return responderError("Transfiere el liderazgo antes de salir", "TRANSFERIR_LIDERAZGO", 400);
    }
  }

  await db
    .delete(schema.miembroClub)
    .where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, user.id)));

  const [countRow] = await db
    .select({ total: sql<number>`count(*)` })
    .from(schema.miembroClub)
    .where(eq(schema.miembroClub.clubId, clubId));

  if (Number(countRow?.total ?? 0) === 0) {
    await db.update(schema.club).set({ activo: false }).where(eq(schema.club.id, clubId));
  }

  return responderExito({ left: true });
});

clubsRoutes.get("/:clubId/ranking", async (c) => {
  const clubId = c.req.param("clubId");

  const data = await db.execute(sql`
    select club_id, usuario_id, apodo, numero_ranking, xp_total
    from v_ranking_club
    where club_id = ${clubId}
    order by numero_ranking asc
  `);

  return responderExito(data);
});

clubsRoutes.get("/:clubId/retos", async (c) => {
  const clubId = c.req.param("clubId");

  const data = await db
    .select()
    .from(schema.retoClub)
    .where(eq(schema.retoClub.clubId, clubId))
    .orderBy(desc(schema.retoClub.fechaInicio));

  return responderExito(data.map(serializarRetoClub));
});

clubsRoutes.post(
  "/:clubId/retos",
  zValidator("json", createChallengeSchema),
  async (c) => {
    const user = c.get("user");
    const clubId = c.req.param("clubId");
    const body = c.req.valid("json");

    const [membership] = await db
      .select({ rolMiembro: schema.miembroClub.rolMiembro })
      .from(schema.miembroClub)
      .where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, user.id)))
      .limit(1);

    if (!membership || membership.rolMiembro !== "lider") {
      throw new ForbiddenError("Solo el líder puede crear retos");
    }

    const [data] = await db
      .insert(schema.retoClub)
      .values({
        clubId,
        nombre: body.name,
        descripcion: body.description ?? null,
        codigoMetrica: body.metricCode,
        valorObjetivo: body.targetValue,
        xpReto: body.rewardXp,
        fechaInicio: new Date(body.startsOn),
        fechaFin: new Date(body.endsOn),
        creadoPor: user.id
      })
      .returning();

    return responderExito(serializarRetoClub(data), 201);
  }
);
