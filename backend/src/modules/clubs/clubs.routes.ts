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

clubsRoutes.get("/mine", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: memberships, error } = await db
    .from("club_member")
    .select("*, club:club_id(*)")
    .eq("user_id", user.id);

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
    .select("*, member_count:club_member(count)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
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
    .select("*, created_by(id, display_name), members:club_member(*)")
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
      .eq("invite_code", inviteCode)
      .maybeSingle();
    if (!existing) break;
    inviteCode = generateInviteCode();
    attempts++;
  }

  const { data: club, error } = await db
    .from("club")
    .insert({
      name: body.name,
      description: body.description ?? null,
      invite_code: inviteCode,
      created_by: user.id
    })
    .select("*")
    .single();

  if (error || !club) throw error;

  await db.from("club_member").insert({
    club_id: club.id,
    user_id: user.id,
    member_role: "leader"
  });

  return c.json({ ok: true, data: club }, 201);
});

clubsRoutes.post("/:clubId/join", zValidator("json", joinClubSchema), async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const clubId = c.req.param("clubId");
  const body = c.req.valid("json");

  const { data: club, error: clubError } = await db
    .from("club")
    .select("id, invite_code, is_active")
    .eq("id", clubId)
    .single();

  if (clubError || !club) throw new NotFoundError("Club no encontrado");
  if (!club.is_active) throw new ForbiddenError("Club inactivo");
  if (club.invite_code !== body.inviteCode) {
    return c.json({ ok: false, error: { message: "Código de invitación incorrecto" } }, 403);
  }

  const { data: existing } = await db
    .from("club_member")
    .select("id")
    .eq("club_id", clubId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return c.json({ ok: true, message: "Ya eres miembro de este club" });
  }

  const { error: joinError } = await db.from("club_member").insert({
    club_id: clubId,
    user_id: user.id,
    member_role: "member"
  });

  if (joinError) throw joinError;

  return c.json({ ok: true, data: { joined: true } });
});

clubsRoutes.post("/:clubId/leave", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const clubId = c.req.param("clubId");

  const { data: membership } = await db
    .from("club_member")
    .select("member_role")
    .eq("club_id", clubId)
    .eq("user_id", user.id)
    .single();

  if (!membership) throw new NotFoundError("No eres miembro de este club");

  if (membership.member_role === "leader") {
    const { count } = await db
      .from("club_member")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId);

    if (count && count > 1) {
      return c.json({
        ok: false,
        error: { message: "Transfiere el liderazgo antes de salir" }
      }, 400);
    }
  }

  await db.from("club_member").delete()
    .eq("club_id", clubId)
    .eq("user_id", user.id);

  const { count } = await db
    .from("club_member")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId);

  if (count === 0) {
    await db.from("club").update({ is_active: false }).eq("id", clubId);
  }

  return c.json({ ok: true, data: { left: true } });
});

clubsRoutes.get("/:clubId/ranking", async (c) => {
  const db = c.get("db");
  const clubId = c.req.param("clubId");

  const { data, error } = await db
    .from("v_club_ranking")
    .select("*")
    .eq("club_id", clubId)
    .order("rank_no", { ascending: true });

  if (error) throw error;

  return c.json({ ok: true, data });
});

clubsRoutes.get("/:clubId/challenges", async (c) => {
  const db = c.get("db");
  const clubId = c.req.param("clubId");

  const { data, error } = await db
    .from("club_challenge")
    .select("*")
    .eq("club_id", clubId)
    .order("starts_on", { ascending: false });

  if (error) throw error;

  return c.json({ ok: true, data });
});

clubsRoutes.post(
  "/:clubId/challenges",
  zValidator("json", createChallengeSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const clubId = c.req.param("clubId");
    const body = c.req.valid("json");

    const { data: membership } = await db
      .from("club_member")
      .select("member_role")
      .eq("club_id", clubId)
      .eq("user_id", user.id)
      .single();

    if (!membership || membership.member_role !== "leader") {
      throw new ForbiddenError("Solo el líder puede crear retos");
    }

    const { data, error } = await db
      .from("club_challenge")
      .insert({
        club_id: clubId,
        name: body.name,
        description: body.description ?? null,
        metric_code: body.metricCode,
        target_value: body.targetValue,
        reward_xp: body.rewardXp,
        starts_on: body.startsOn,
        ends_on: body.endsOn,
        created_by: user.id
      })
      .select("*")
      .single();

    if (error || !data) throw error;

    return c.json({ ok: true, data }, 201);
  }
);
