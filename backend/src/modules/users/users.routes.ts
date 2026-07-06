import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { updateProfileSchema } from "./users.schemas";

export const usersRoutes = new Hono<AppBindings>();

usersRoutes.use("*", authMiddleware);

usersRoutes.get("/", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: profile, error } = await db
    .from("profile")
    .select(
      `
      *,
      age_group:age_group_id(
        id,
        code,
        name,
        min_age,
        max_age
      )
    `
    )
    .eq("user_id", user.id)
    .single();

  if (error) throw error;

  return c.json({
    ok: true,
    data: {
      user,
      profile
    }
  });
});

usersRoutes.patch(
  "/profile",
  zValidator("json", updateProfileSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const body = c.req.valid("json");

    const { data, error } = await db
      .from("profile")
      .update({
        nickname: body.nickname,
        age_group_id: body.ageGroupId,
        avatar_url: body.avatarUrl,
        preferred_audio: body.preferredAudio,
        preferred_text_size: body.preferredTextSize,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) throw error;

    return c.json({
      ok: true,
      data
    });
  }
);
