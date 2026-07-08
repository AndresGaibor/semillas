import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { serializarActividad } from "../../shared/serializers/actividad.serializer";
import { serializarTema, serializarTemaDetalle } from "../../shared/serializers/tema.serializer";

const SIGNED_URL_EXPIRES_IN_SECONDS = 300;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

  const preguntas = Array.isArray(paso.preguntas)
    ? paso.preguntas.map((pregunta) => ({
        id: String((pregunta as Record<string, unknown>).id),
        grupo_edad_id: String((pregunta as Record<string, unknown>).grupo_edad_id ?? ""),
        pregunta: String((pregunta as Record<string, unknown>).pregunta ?? ""),
        orden: Number((pregunta as Record<string, unknown>).orden ?? 0)
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
    contenidos,
    preguntas
  };
}

export const themesRoutes = new Hono<AppBindings>();

themesRoutes.get("/", async (c) => {
  const db = c.get("db");
  const sendaId = c.req.query("senda_id");

  const { data, error } = await db
    .from("v_temas_publicos")
    .select("*, portada_recurso:portada_recurso_id(id, tipo, url_publica, texto_alternativo, titulo, tipo_mime, tamano_bytes, duracion_seg, ancho_px, alto_px)")
    .order("publicado_en", { ascending: false });

  if (error) {
    throw error;
  }

  const temas = (data ?? []) as unknown as Array<Record<string, unknown>>;
  const filtrados = sendaId ? temas.filter((t) => t.senda_id === sendaId) : temas;

  return responderExito(filtrados.map((tema) => serializarTema(tema as unknown as Parameters<typeof serializarTema>[0])));
});

themesRoutes.get("/:tema_id/portada", async (c) => {
  const db = c.get("db");
  const temaId = c.req.param("tema_id");

  if (!UUID_REGEX.test(temaId)) {
    return responderError("El ID del tema debe ser un UUID válido", "VALIDATION_ERROR", 400);
  }

  const { data, error } = await db
    .from("tema")
    .select("estado, portada_recurso:portada_recurso_id(id, bucket_almacenamiento, clave_almacenamiento, activo)")
    .eq("id", temaId)
    .eq("estado", "publicado")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new NotFoundError("Tema no encontrado");
  }

  const portada = Array.isArray((data as Record<string, unknown>).portada_recurso)
    ? ((data as Record<string, unknown>).portada_recurso as Array<Record<string, unknown>>)[0]
    : ((data as Record<string, unknown>).portada_recurso as Record<string, unknown> | null);

  if (!portada?.clave_almacenamiento || portada.activo === false) {
    throw new NotFoundError("El tema no tiene portada activa");
  }

  const bucket = (portada.bucket_almacenamiento as string | null) ?? "media";
  const clave = portada.clave_almacenamiento as string;

  const { data: firmada, error: signedError } = await db.storage
    .from(bucket)
    .createSignedUrl(clave, SIGNED_URL_EXPIRES_IN_SECONDS);

  if (signedError || !firmada?.signedUrl) {
    console.error("Error al crear URL firmada de portada:", signedError);
    return responderError("No se pudo generar URL firmada de la portada", "STORAGE_ERROR", 500);
  }

  return responderExito({ url: firmada.signedUrl, expira_en_segundos: SIGNED_URL_EXPIRES_IN_SECONDS });
});

themesRoutes.get("/:tema_id", async (c) => {
  const db = c.get("db");
  const temaId = c.req.param("tema_id");

  const { data, error } = await db
    .from("tema")
    .select("*, senda:senda_id(*), portada_recurso:portada_recurso_id(*), versiculo_clave:versiculo_clave(*), referencias_biblicas:referencia_biblica(*)")
    .eq("id", temaId)
    .single();

  if (error || !data) {
    throw new NotFoundError("Tema no encontrado");
  }

  return responderExito(serializarTemaDetalle(data as unknown as Parameters<typeof serializarTemaDetalle>[0]));
});

themesRoutes.get("/:tema_id/pasos", async (c) => {
  const db = c.get("db");
  const temaId = c.req.param("tema_id");
  const grupoEdadId = c.req.query("grupo_edad_id");

  const { data, error } = await db
    .from("paso_tema")
    .select("*, tipo_paso:tipo_paso_id(*), contenidos:contenido_paso_tema(*), preguntas:pregunta_reflexion(*)")
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
      contenidos: mapeado.contenidos.filter((contenido) => contenido.grupo_edad_id === grupoEdadId),
      preguntas: mapeado.preguntas.filter((pregunta) => pregunta.grupo_edad_id === grupoEdadId)
    };
  });

  return responderExito(pasos);
});

themesRoutes.get("/:tema_id/actividades", async (c) => {
  const db = c.get("db");
  const temaId = c.req.param("tema_id");
  const grupoEdadId = c.req.query("grupo_edad_id");

  let query = db
    .from("actividad")
    .select("*, tipo_actividad:tipo_actividad_id(*), opciones:opcion_actividad(*)")
    .eq("tema_id", temaId)
    .order("orden", { ascending: true });

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