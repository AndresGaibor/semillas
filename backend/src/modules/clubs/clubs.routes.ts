import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { NotFoundError, ForbiddenError } from "../../shared/errors/http-error";
import {
  createChallengeSchema,
  createClubSchema,
  joinClubSchema
} from "./clubs.schemas";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const clubsRoutes = new Hono<AppBindings>();

clubsRoutes.use("*", authMiddleware);

clubsRoutes.get("/mios", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: memberships, error } = await db
    .from("miembro_club")
    .select("*, club:club_id(*)")
    .eq("usuario_id", user.id);

  if (error) throw error;

  return c.json({
    ok: true,
    data: memberships.map((m) => m.club)
  });
});

clubsRoutes.get("/", async (c) => {
  const db = c.get("db");
  const search = c.req.query("q");

  let query = db
    .from("club")
    .select("*, member_count:miembro_club(count)")
    .eq("activo", true)
    .order("creado_en", { ascending: false });

  if (search) {
    query = query.ilike("nombre", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;

  return c.json({ ok: true, data });
});

clubsRoutes.get("/:clubId", async (c) => {
  const db = c.get("db");
  const clubId = c.req.param("clubId");

  const { data: club, error } = await db
    .from("club")
    .select("*, created_by:creado_por(id, nombre_visible), members:miembro_club(*)")
    .eq("id", clubId)
    .single();

  if (error || !club) throw new NotFoundError("Club no encontrado");

  return c.json({ ok: true, data: club });
});

clubsRoutes.post("/", zValidator("json", createClubSchema), async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = c.req.valid("json");

  let inviteCode = generateInviteCode();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing } = await db
      .from("club")
      .select("id")
      .eq("codigo_invitacion", inviteCode)
      .maybeSingle();
    if (!existing) break;
    inviteCode = generateInviteCode();
    attempts++;
  }

  const { data: club, error } = await db
    .from("club")
    .insert({
      nombre: body.name,
      descripcion: body.description ?? null,
      codigo_invitacion: inviteCode,
      creado_por: user.id
    })
    .select("*")
    .single();

  if (error || !club) throw error;

  await db.from("miembro_club").insert({
    club_id: club.id,
    usuario_id: user.id,
    rol_miembro: "lider"
  });

  return c.json({ ok: true, data: club }, 201);
});

clubsRoutes.post("/:clubId/unirse", zValidator("json", joinClubSchema), async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const clubId = c.req.param("clubId");
  const body = c.req.valid("json");

  const { data: club, error: clubError } = await db
    .from("club")
    .select("id, codigo_invitacion, activo")
    .eq("id", clubId)
    .single();

  if (clubError || !club) throw new NotFoundError("Club no encontrado");
  if (!club.activo) throw new ForbiddenError("Club inactivo");
  if (club.codigo_invitacion !== body.inviteCode) {
    return c.json({ ok: false, error: { message: "Código de invitación incorrecto" } }, 403);
  }

  const { data: existing } = await db
    .from("miembro_club")
    .select("id")
    .eq("club_id", clubId)
    .eq("usuario_id", user.id)
    .maybeSingle();

  if (existing) {
    return c.json({ ok: true, message: "Ya eres miembro de este club" });
  }

  const { error: joinError } = await db.from("miembro_club").insert({
    club_id: clubId,
    usuario_id: user.id,
    rol_miembro: "miembro"
  });

  if (joinError) throw joinError;

  return c.json({ ok: true, data: { joined: true } });
});

clubsRoutes.post("/:clubId/salir", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const clubId = c.req.param("clubId");

  const { data: membership } = await db
    .from("miembro_club")
    .select("rol_miembro")
    .eq("club_id", clubId)
    .eq("usuario_id", user.id)
    .single();

  if (!membership) throw new NotFoundError("No eres miembro de este club");

  if (membership.rol_miembro === "lider") {
    const { count } = await db
      .from("miembro_club")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId);

    if (count && count > 1) {
      return c.json({
        ok: false,
        error: { message: "Transfiere el liderazgo antes de salir" }
      }, 400);
    }
  }

  await db.from("miembro_club").delete()
    .eq("club_id", clubId)
    .eq("usuario_id", user.id);

  const { count } = await db
    .from("miembro_club")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId);

  if (count === 0) {
    await db.from("club").update({ activo: false }).eq("id", clubId);
  }

  return c.json({ ok: true, data: { left: true } });
});

clubsRoutes.get("/:clubId/ranking", async (c) => {
  const db = c.get("db");
  const clubId = c.req.param("clubId");

  const { data, error } = await db
    .from("v_ranking_club")
    .select("*")
    .eq("club_id", clubId)
    .order("numero_ranking", { ascending: true });

  if (error) throw error;

  return c.json({ ok: true, data });
});

clubsRoutes.get("/:clubId/retos", async (c) => {
  const db = c.get("db");
  const clubId = c.req.param("clubId");

  const { data, error } = await db
    .from("reto_club")
    .select("*")
    .eq("club_id", clubId)
    .order("fecha_inicio", { ascending: false });

  if (error) throw error;

  return c.json({ ok: true, data });
});

clubsRoutes.post(
  "/:clubId/retos",
  zValidator("json", createChallengeSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const clubId = c.req.param("clubId");
    const body = c.req.valid("json");

    const { data: membership } = await db
      .from("miembro_club")
      .select("rol_miembro")
      .eq("club_id", clubId)
      .eq("usuario_id", user.id)
      .single();

    if (!membership || membership.rol_miembro !== "lider") {
      throw new ForbiddenError("Solo el líder puede crear retos");
    }

    const { data, error } = await db
      .from("reto_club")
      .insert({
        club_id: clubId,
        nombre: body.name,
        descripcion: body.description ?? null,
        codigo_metrica: body.metricCode,
        valor_objetivo: body.targetValue,
        xp_reto: body.rewardXp,
        fecha_inicio: body.startsOn,
        fecha_fin: body.endsOn,
        creado_por: user.id
      })
      .select("*")
      .single();

    if (error || !data) throw error;

    return c.json({ ok: true, data }, 201);
  }
);
