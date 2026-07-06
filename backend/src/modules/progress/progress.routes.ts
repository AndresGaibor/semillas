import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import type { Json } from "../../db/database.types";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { progressEventSchema } from "./progress.schemas";

export const progressRoutes = new Hono<AppBindings>();

progressRoutes.use("*", authMiddleware);

progressRoutes.get("/me", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: themes, error: themesError } = await db
    .from("user_theme_progress")
    .select("*")
    .eq("user_id", user.id);

  if (themesError) {
    throw themesError;
  }

  const { data: activities, error: activitiesError } = await db
    .from("user_activity_progress")
    .select("*")
    .eq("user_id", user.id);

  if (activitiesError) {
    throw activitiesError;
  }

  return c.json({
    ok: true,
    data: {
      themes,
      activities
    }
  });
});

progressRoutes.post(
  "/events",
  zValidator("json", progressEventSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const body = c.req.valid("json");

    const { data, error } = await db
      .from("progress_event")
      .insert({
        user_id: user.id,
        client_event_id: body.clientEventId,
        event_type: body.eventType,
        theme_id: body.themeId ?? null,
        step_id: body.stepId ?? null,
        activity_id: body.activityId ?? null,
        is_correct: body.isCorrect ?? null,
        score: body.score ?? null,
        xp_awarded: body.xpAwarded,
        payload: body.payload as Json,
        occurred_at_client: body.occurredAtClient ?? new Date().toISOString(),
        device_id: body.deviceId ?? null
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return c.json({
          ok: true,
          duplicated: true,
          message: "Evento ya procesado"
        });
      }

      throw error;
    }

    return c.json(
      {
        ok: true,
        duplicated: false,
        data
      },
      201
    );
  }
);
