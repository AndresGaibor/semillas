import { Hono } from "hono";
import { asc, eq } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { responderExito } from "../../shared/http/respuesta";
import { db, schema } from "../../db/client";

const BUCKET_PUBLICO = "imagenes";
const RUTA_ONBOARDING = "onboarding";

export const catalogRoutes = new Hono<AppBindings>();

catalogRoutes.get("/grupos-etarios", async (c) => {
  const supabaseUrl = c.env.SUPABASE_URL;

  const baseUrlStorage = `${supabaseUrl}/storage/v1/object/public/${BUCKET_PUBLICO}/${RUTA_ONBOARDING}`;

  // Consulta tipada con Drizzle para evitar strings mágicos en las columnas.
  const data = await db
    .select({
      id: schema.grupoEdad.id,
      codigo: schema.grupoEdad.codigo,
      nombre: schema.grupoEdad.nombre,
      edad_minima: schema.grupoEdad.edadMinima,
      edad_maxima: schema.grupoEdad.edadMaxima,
      descripcion: schema.grupoEdad.descripcion,
      orden: schema.grupoEdad.orden
    })
    .from(schema.grupoEdad)
    .orderBy(asc(schema.grupoEdad.orden));

  const gruposConImagen = (data ?? []).map((g) => ({
    ...g,
    imagen_url: `${baseUrlStorage}/${g.codigo.toLowerCase()}.png`,
  }));

  return responderExito(gruposConImagen);
});

catalogRoutes.get("/tipos-actividad", async (c) => {
  const data = await db
    .select({
      id: schema.tipoActividad.id,
      codigo: schema.tipoActividad.codigo,
      nombre: schema.tipoActividad.nombre,
      descripcion: schema.tipoActividad.descripcion,
      es_juego: schema.tipoActividad.esJuego
    })
    .from(schema.tipoActividad)
    .where(eq(schema.tipoActividad.activo, true))
    .orderBy(asc(schema.tipoActividad.nombre));

  return responderExito(data ?? []);
});

catalogRoutes.get("/libros-biblicos", async (c) => {
  const data = await db
    .select({
      id: schema.libroBiblico.id,
      nombre: schema.libroBiblico.nombre,
      orden: schema.libroBiblico.orden,
      testamento_id: schema.libroBiblico.testamentoId
    })
    .from(schema.libroBiblico)
    .orderBy(asc(schema.libroBiblico.orden));

  return responderExito(
    (data ?? []).map((libro) => ({
      codigo: String(libro.id),
      nombre: libro.nombre,
      orden: libro.orden,
      testamento_id: libro.testamento_id
    }))
  );
});

catalogRoutes.get("/versiones-biblicas", async (c) => {
  const data = await db
    .select({
      id: schema.versionBiblica.id,
      codigo: schema.versionBiblica.codigo,
      nombre: schema.versionBiblica.nombre,
      dominio_publico: schema.versionBiblica.dominioPublico
    })
    .from(schema.versionBiblica)
    .orderBy(asc(schema.versionBiblica.codigo));

  return responderExito(data ?? []);
});

catalogRoutes.get("/pasos-crecer", async (c) => {
  const data = await db
    .select({
      codigo: schema.tipoPasoCrecer.codigo,
      nombre: schema.tipoPasoCrecer.nombre,
      descripcion: schema.tipoPasoCrecer.descripcion,
      orden: schema.tipoPasoCrecer.orden,
      color_hex: schema.tipoPasoCrecer.colorHex
    })
    .from(schema.tipoPasoCrecer)
    .orderBy(asc(schema.tipoPasoCrecer.orden));

  return responderExito(data ?? []);
});
