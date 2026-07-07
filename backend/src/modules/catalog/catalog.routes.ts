import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { responderExito } from "../../shared/http/respuesta";

export const catalogRoutes = new Hono<AppBindings>();

catalogRoutes.get("/grupos-etarios", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("grupo_edad")
    .select("codigo, nombre, edad_minima, edad_maxima, descripcion, orden, dominio_publico, es_juego")
    .order("orden", { ascending: true });

  if (error) throw error;

  return responderExito(data ?? []);
});

catalogRoutes.get("/tipos-actividad", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("tipo_actividad")
    .select("codigo, nombre, descripcion, es_juego")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) throw error;

  return responderExito(data ?? []);
});

catalogRoutes.get("/libros-biblicos", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("libro_biblico")
    .select("codigo, nombre, orden, testamento_id")
    .order("orden", { ascending: true });

  if (error) throw error;

  return responderExito(data ?? []);
});

catalogRoutes.get("/versiones-biblicas", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("version_biblica")
    .select("codigo, nombre, dominio_publico")
    .order("codigo", { ascending: true });

  if (error) throw error;

  return responderExito(data ?? []);
});

catalogRoutes.get("/pasos-crecer", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("tipo_paso_crecer")
    .select("codigo, nombre, descripcion, orden, color_hex")
    .order("orden", { ascending: true });

  if (error) throw error;

  return responderExito(data ?? []);
});
