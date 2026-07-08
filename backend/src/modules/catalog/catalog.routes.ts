import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { responderExito } from "../../shared/http/respuesta";

const BUCKET_PUBLICO = "imagenes";
const RUTA_ONBOARDING = "onboarding";

export const catalogRoutes = new Hono<AppBindings>();

catalogRoutes.get("/grupos-etarios", async (c) => {
  const db = c.get("db");
  const supabaseUrl = c.env.SUPABASE_URL;

  const baseUrlStorage = `${supabaseUrl}/storage/v1/object/public/${BUCKET_PUBLICO}/${RUTA_ONBOARDING}`;

  const { data, error } = await db
    .from("grupo_edad")
    .select("id, codigo, nombre, edad_minima, edad_maxima, descripcion, orden")
    .order("orden", { ascending: true });

  if (error) throw error;

  const gruposConImagen = (data ?? []).map((g) => ({
    ...g,
    imagen_url: `${baseUrlStorage}/${g.codigo.toLowerCase()}.png`,
  }));

  return responderExito(gruposConImagen);
});

catalogRoutes.get("/tipos-actividad", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("tipo_actividad")
    .select("id, codigo, nombre, descripcion, es_juego")
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
    .select("id, codigo, nombre, dominio_publico")
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
