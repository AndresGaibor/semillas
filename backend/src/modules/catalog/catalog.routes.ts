import { Hono } from "hono";
import type { AppBindings } from "../../config/env";

export const catalogRoutes = new Hono<AppBindings>();

catalogRoutes.get("/age-groups", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("age_group")
    .select("id, code, name, min_age, max_age, description, sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return c.json({
    ok: true,
    data
  });
});

catalogRoutes.get("/activity-types", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("activity_type")
    .select("id, code, name, description, is_game")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return c.json({
    ok: true,
    data
  });
});

catalogRoutes.get("/crecer-steps", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("crecer_step_type")
    .select("id, code, name, description, sort_order, color_hex")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return c.json({
    ok: true,
    data
  });
});
