import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import type { Json } from "../../db/database.types";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import {
  createActivitySchema,
  createThemeSchema,
  upsertStepContentSchema
} from "./admin.schemas";
import { NotFoundError } from "../../shared/errors/http-error";

export const adminRoutes = new Hono<AppBindings>();

adminRoutes.use("*", authMiddleware);
adminRoutes.use("*", requireRole("admin"));

adminRoutes.get("/dashboard", async (c) => {
  const db = c.get("db");

  const [themes, users, activities] = await Promise.all([
    db.from("theme").select("id", { count: "exact", head: true }),
    db.from("app_user").select("id", { count: "exact", head: true }),
    db.from("activity").select("id", { count: "exact", head: true })
  ]);

  return c.json({
    ok: true,
    data: {
      themes: themes.count ?? 0,
      users: users.count ?? 0,
      activities: activities.count ?? 0
    }
  });
});

adminRoutes.post(
  "/themes",
  zValidator("json", createThemeSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const body = c.req.valid("json");

    const { data: theme, error } = await db
      .from("theme")
      .insert({
        path_id: body.pathId,
        title: body.title,
        slug: body.slug,
        objective: body.objective,
        summary: body.summary,
        bible_version_id: body.bibleVersionId,
        status: "draft",
        xp_reward: body.xpReward,
        estimated_minutes: body.estimatedMinutes,
        created_by: user.id
      })
      .select("*")
      .single();

    if (error || !theme) throw error;

    const rows = body.ageGroupIds.map((ageGroupId) => ({
      theme_id: theme.id,
      age_group_id: ageGroupId
    }));

    const { error: ageError } = await db.from("theme_age_group").insert(rows);

    if (ageError) throw ageError;

    return c.json(
      {
        ok: true,
        data: theme
      },
      201
    );
  }
);

adminRoutes.post(
  "/themes/:themeId/steps",
  zValidator("json", upsertStepContentSchema),
  async (c) => {
    const db = c.get("db");
    const themeId = c.req.param("themeId");
    const body = c.req.valid("json");

    const { data: step, error: stepError } = await db
      .from("theme_step")
      .upsert(
        {
          theme_id: themeId,
          step_type_id: body.stepTypeId,
          sort_order: 1
        },
        {
          onConflict: "theme_id,step_type_id"
        }
      )
      .select("*")
      .single();

    if (stepError || !step) throw stepError;

    const { data: content, error: contentError } = await db
      .from("theme_step_content")
      .upsert(
        {
          step_id: step.id,
          age_group_id: body.ageGroupId,
          title: body.title,
          body: body.body,
          short_instruction: body.shortInstruction ?? null
        },
        {
          onConflict: "step_id,age_group_id"
        }
      )
      .select("*")
      .single();

    if (contentError) throw contentError;

    return c.json({
      ok: true,
      data: {
        step,
        content
      }
    });
  }
);

adminRoutes.post(
  "/activities",
  zValidator("json", createActivitySchema),
  async (c) => {
    const db = c.get("db");
    const body = c.req.valid("json");

    const { data: activity, error } = await db
      .from("activity")
      .insert({
        theme_id: body.themeId,
        step_id: body.stepId,
        age_group_id: body.ageGroupId,
        activity_type_id: body.activityTypeId,
        title: body.title,
        prompt: body.prompt,
        feedback: body.feedback ?? null,
        sort_order: body.sortOrder,
        xp_reward: body.xpReward,
        difficulty: body.difficulty,
        config: body.config as Json
      })
      .select("*")
      .single();

    if (error || !activity) throw error;

    if (body.options.length > 0) {
      const rows = body.options.map((option) => ({
        activity_id: activity.id,
        label: option.label,
        text: option.text,
        is_correct: option.isCorrect,
        sort_order: option.sortOrder,
        feedback: option.feedback ?? null
      }));

      const { error: optionsError } = await db
        .from("activity_option")
        .insert(rows);

      if (optionsError) throw optionsError;
    }

    return c.json(
      {
        ok: true,
        data: activity
      },
      201
    );
  }
);

adminRoutes.post("/themes/:themeId/publish", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const themeId = c.req.param("themeId");

  const { data: theme, error: themeError } = await db
    .from("theme")
    .select("id")
    .eq("id", themeId)
    .single();

  if (themeError || !theme) {
    throw new NotFoundError("Tema no encontrado");
  }

  const { data, error } = await db
    .from("theme")
    .update({
      status: "published",
      published_by: user.id,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", themeId)
    .select("*")
    .single();

  if (error) throw error;

  return c.json({
    ok: true,
    data
  });
});
