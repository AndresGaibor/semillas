import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { NotFoundError } from "../../shared/errors/http-error";
import { answerActivitySchema } from "./activities.schemas";

export const activitiesRoutes = new Hono<AppBindings>();

activitiesRoutes.get("/:activityId", async (c) => {
  const db = c.get("db");
  const activityId = c.req.param("activityId");

  const { data, error } = await db
    .from("activity")
    .select(
      `
      *,
      activity_type:activity_type_id(*),
      options:activity_option(*)
    `
    )
    .eq("id", activityId)
    .single();

  if (error || !data) {
    throw new NotFoundError("Actividad no encontrada");
  }

  return c.json({
    ok: true,
    data
  });
});

activitiesRoutes.post(
  "/:activityId/answer",
  authMiddleware,
  zValidator("json", answerActivitySchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const activityId = c.req.param("activityId");
    const body = c.req.valid("json");

    const { data: activity, error: activityError } = await db
      .from("activity")
      .select("id, theme_id, xp_reward")
      .eq("id", activityId)
      .single();

    if (activityError || !activity) {
      throw new NotFoundError("Actividad no encontrada");
    }

    let isCorrect = false;

    if (body.selectedOptionId) {
      const { data: option, error: optionError } = await db
        .from("activity_option")
        .select("id, is_correct")
        .eq("id", body.selectedOptionId)
        .eq("activity_id", activityId)
        .single();

      if (optionError || !option) {
        throw new NotFoundError("Opción no encontrada");
      }

      isCorrect = option.is_correct;
    }

    const xpAwarded = isCorrect ? activity.xp_reward : 0;

    const { error: eventError } = await db.from("progress_event").insert({
      user_id: user.id,
      client_event_id: body.clientEventId,
      event_type: "activity_answered",
      theme_id: activity.theme_id,
      activity_id: activityId,
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0,
      xp_awarded: xpAwarded,
      payload: {
        selectedOptionId: body.selectedOptionId ?? null,
        answerText: body.answerText ?? null
      },
      occurred_at_client: body.occurredAtClient ?? new Date().toISOString(),
      device_id: body.deviceId ?? null
    });

    if (eventError) {
      if (eventError.code === "23505") {
        return c.json({
          ok: true,
          duplicated: true,
          result: {
            isCorrect,
            xpAwarded: 0
          }
        });
      }

      throw eventError;
    }

    await db.from("user_activity_progress").upsert({
      user_id: user.id,
      activity_id: activityId,
      attempts: 1,
      best_score: isCorrect ? 100 : 0,
      is_completed: isCorrect,
      completed_at: isCorrect ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    });

    if (activity.theme_id && isCorrect) {
      await db.from("user_theme_progress").upsert({
        user_id: user.id,
        theme_id: activity.theme_id,
        status: "in_progress",
        started_at: new Date().toISOString(),
        percent: 0,
        updated_at: new Date().toISOString()
      });
    }

    if (activity.theme_id && isCorrect) {
      const { data: themeActivities, error: listError } = await db
        .from("activity")
        .select("id")
        .eq("theme_id", activity.theme_id);

      if (!listError && themeActivities && themeActivities.length > 0) {
        const activityIds = themeActivities.map((a: { id: string }) => a.id);

        const { count: completedCount } = await db
          .from("user_activity_progress")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .in("activity_id", activityIds)
          .eq("is_completed", true);

        const total = themeActivities.length;
        const completed = completedCount ?? 0;
        const percent = Math.round((completed / total) * 100);
        const status = completed >= total ? "completed" : "in_progress";

        await db.from("user_theme_progress").upsert({
          user_id: user.id,
          theme_id: activity.theme_id,
          status,
          percent,
          completed_at: status === "completed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });
      }
    }

    return c.json({
      ok: true,
      duplicated: false,
      result: {
        isCorrect,
        xpAwarded
      }
    });
  }
);
