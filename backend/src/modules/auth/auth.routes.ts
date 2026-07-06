import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { createGuestSchema } from "./auth.schemas";

export const authRoutes = new Hono<AppBindings>();

authRoutes.post("/guest", zValidator("json", createGuestSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");

  const { data: user, error: userError } = await db
    .from("app_user")
    .insert({
      provider: "guest",
      role: "guest",
      display_name: body.nickname,
      email: null
    })
    .select("id, role, provider, display_name, email")
    .single();

  if (userError || !user) {
    throw userError;
  }

  const { data: profile, error: profileError } = await db
    .from("profile")
    .insert({
      user_id: user.id,
      nickname: body.nickname,
      age_group_id: body.ageGroupId ?? null,
      avatar_url: body.avatarUrl ?? null
    })
    .select("*")
    .single();

  if (profileError) {
    throw profileError;
  }

  return c.json(
    {
      ok: true,
      data: {
        user,
        profile,
        auth: {
          type: "guest",
          headerName: "X-Guest-User-Id",
          headerValue: user.id
        }
      }
    },
    201
  );
});
