import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderExito } from "../../shared/http/respuesta";
import { serializarActividad } from "../../shared/serializers/actividad.serializer";
import { serializarTema } from "../../shared/serializers/tema.serializer";

function mapearPaso(paso: Record<string, unknown>) {
  const contenidos = Array.isArray(paso.contenidos)
    ? paso.contenidos.map((contenido) => ({
        id: String((contenido as Record<string, unknown>).id),
        grupo_edad_id: String((contenido as Record<string, unknown>).grupo_edad_id ?? ""),
        titulo: String((contenido as Record<string, unknown>).titulo ?? ""),
        cuerpo: String((contenido as Record<string, unknown>).cuerpo ?? ""),
        instruccion_corta: ((contenido as Record<string, unknown>).instruccion_corta ?? null) as string | null
      }))
    : [];

  return {
    id: String(paso.id),
    tema_id: String(paso.tema_id ?? ""),
    orden: Number(paso.orden ?? 0),
    tipo_paso: paso.tipo_paso
      ? {
          id: String((paso.tipo_paso as Record<string, unknown>).id ?? ""),
          codigo: String((paso.tipo_paso as Record<string, unknown>).codigo ?? ""),
          nombre: String((paso.tipo_paso as Record<string, unknown>).nombre ?? ""),
          orden: Number((paso.tipo_paso as Record<string, unknown>).orden ?? 0),
          color_hex: ((paso.tipo_paso as Record<string, unknown>).color_hex ?? null) as string | null
        }
      : null,
    contenidos
  };
}

export const themesRoutes = new Hono<AppBindings>();

themesRoutes.get("/", async (c) => {
  const db = c.get("db");
  const sendaId = c.req.query("senda_id");

  let query = db.from("v_temas_publicos").select("*").order("publicado_en", { ascending: false });

  if (sendaId) {
    query = query.eq("senda_id", sendaId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return responderExito((data ?? []).map((tema) => serializarTema(tema as unknown as Parameters<typeof serializarTema>[0])));
});

themesRoutes.get("/:tema_id", async (c) => {
  const db = c.get("db");
  const temaId = c.req.param("tema_id");

  const { data, error } = await db.from("tema").select("*").eq("id", temaId).single();

  if (error || !data) {
    throw new NotFoundError("Tema no encontrado");
  }

  return responderExito(serializarTema(data as unknown as Parameters<typeof serializarTema>[0]));
});

themesRoutes.get("/:tema_id/pasos", async (c) => {
  const db = c.get("db");
  const temaId = c.req.param("tema_id");
  const grupoEdadId = c.req.query("grupo_edad_id");

  const { data, error } = await db
    .from("paso_tema")
    .select("*, tipo_paso:tipo_paso_id(*), contenidos:contenido_paso_tema(*)")
    .eq("tema_id", temaId)
    .order("orden", { ascending: true });

  if (error) {
    throw error;
  }

  const pasos = (data ?? []).map((paso) => {
    const mapeado = mapearPaso(paso as Record<string, unknown>);

    if (!grupoEdadId) {
      return mapeado;
    }

    return {
      ...mapeado,
      contenidos: mapeado.contenidos.filter((contenido) => contenido.grupo_edad_id === grupoEdadId)
    };
  });

  return responderExito(pasos);
});

themesRoutes.get("/:tema_id/actividades", async (c) => {
  const db = c.get("db");
  const temaId = c.req.param("tema_id");
  const grupoEdadId = c.req.query("grupo_edad_id");

  let query = db.from("actividad").select("*").eq("tema_id", temaId).order("orden", { ascending: true });

  if (grupoEdadId) {
    query = query.eq("grupo_edad_id", grupoEdadId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return responderExito(
    (data ?? []).map((actividad) => serializarActividad(actividad as unknown as Parameters<typeof serializarActividad>[0]))
  );
});
