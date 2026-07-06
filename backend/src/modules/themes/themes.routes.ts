import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { NotFoundError } from "../../shared/errors/http-error";

export const themesRoutes = new Hono<AppBindings>();

themesRoutes.get("/", async (c) => {
  const db = c.get("db");

  const pathId = c.req.query("pathId");

  let query = db
    .from("v_theme_public")
    .select("*")
    .order("published_at", { ascending: false });

  if (pathId) {
    query = query.eq("path_id", pathId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return c.json({
    ok: true,
    data
  });
});

themesRoutes.get("/:themeId", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("themeId");

  const { data, error } = await db
    .from("theme")
    .select(
      `
      *,
      path:path_id(*),
      cover:cover_media_id(*),
      key_verse(*),
      bible_reference(*)
    `
    )
    .eq("id", themeId)
    .single();

  if (error || !data) {
    throw new NotFoundError("Tema no encontrado");
  }

  return c.json({
    ok: true,
    data
  });
});

themesRoutes.get("/:themeId/steps", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("themeId");
  const ageGroupId = c.req.query("ageGroupId");

  const { data: steps, error } = await db
    .from("theme_step")
    .select(
      `
      *,
      step_type:step_type_id(*),
      contents:theme_step_content(*)
    `
    )
    .eq("theme_id", themeId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  const filtered = ageGroupId
    ? steps?.map((step) => ({
        ...step,
        contents: step.contents?.filter(
          (content: { age_group_id: string }) => content.age_group_id === ageGroupId
        )
      }))
    : steps;

  return c.json({
    ok: true,
    data: filtered
  });
});

themesRoutes.get("/:themeId/activities", async (c) => {
  const db = c.get("db");
  const themeId = c.req.param("themeId");
  const ageGroupId = c.req.query("ageGroupId");

  let query = db
    .from("activity")
    .select(
      `
      *,
      activity_type:activity_type_id(*),
      options:activity_option(*)
    `
    )
    .eq("theme_id", themeId)
    .order("sort_order", { ascending: true });

  if (ageGroupId) {
    query = query.eq("age_group_id", ageGroupId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return c.json({
    ok: true,
    data
  });
});
