import { Hono } from "hono";
import type { AppBindings } from "../../config/env";

export const sendasRoutes = new Hono<AppBindings>();

sendasRoutes.get("/", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("path")
    .select("id, code, name, description, color_hex, icon_name, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return c.json({
    ok: true,
    data
  });
});
