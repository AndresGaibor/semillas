import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

export const gamificationRoutes = new Hono<AppBindings>();

gamificationRoutes.use("*", authMiddleware);

gamificationRoutes.get("/me", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: level, error: levelError } = await db
    .from("v_user_level")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (levelError) {
    throw levelError;
  }

  const { data: achievements, error: achievementsError } = await db
    .from("user_achievement")
    .select("*, achievement(*)")
    .eq("user_id", user.id);

  if (achievementsError) {
    throw achievementsError;
  }

  return c.json({
    ok: true,
    data: {
      level,
      achievements
    }
  });
});
