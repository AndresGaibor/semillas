/**
 * ============================================================
 * MÓDULO DE TEMAS
 * ============================================================
 *
 * Este módulo maneja las rutas relacionadas con temas bíblicos.
 * Un tema representa una lección completa con contenido CRECER
 * adaptada por grupo de edad.
 *
 * ENDPOINTS:
 * - GET /temas - Lista temas publicados
 * - GET /temas/:tema_id - Detalle de un tema
 * - GET /temas/:tema_id/pasos - Pasos CRECER del tema
 * - GET /temas/:tema_id/actividades - Actividades del tema
 * - GET /temas/:tema_id/portada - URL firmada de la portada
 *
 * @module modules/themes
 */

import { Hono } from "hono";
import { eq, asc, and } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { NotFoundError } from "../../shared/errors/http-error";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { db, schema, createSupabaseAdmin } from "../../db/client";

/**
 * Constantes del módulo
 */
const URL_FIRMA_EXPIRADA_SEGUNDOS = 300;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ============================================================
 * TIPOS DE SERIALIZACIÓN
 * ============================================================
 * Definen la estructura de datos que se devuelve al cliente.
 * Separar la lógica de serialización permite cambiar el formato
 * de la API sin modificar la lógica de negocio.
 */

interface TemaListado {
  id: string;
  titulo: string;
  slug: string;
  resumen: string | null;
  objetivo: string;
  xpRecompensa: number;
  minutosEstimados: number;
  versionContenido: number;
  estado: string;
  publicadoEn: string | null;
 enda: {
    id: string;
    nombre: string;
    codigo: string;
    colorHex: string;
  } | null;
  portada: {
    id: string;
    tipo: string | null;
    urlPublica: string;
    textoAlternativo: string | null;
    tipoMime: string | null;
    tamanoBytes: number | null;
    duracionSeg: number | null;
    anchoPx: number | null;
    altoPx: number | null;
  } | null;
}

/**
 * Serializa un tema para el listado público
 * Solo incluye campos seguros para exponer al cliente
 */
function serializarTemaParaListado(tema: typeof schema.tema.$inferSelect & {enda: typeof schema.enda.$inferSelect | null; portada: typeof schema.recursoMultimedia.$inferSelect | null}): TemaListado {
  return {
    id: tema.id,
    titulo: tema.titulo,
    slug: tema.slug,
    resumen: tema.resumen,
    objetivo: tema.objetivo,
    xpRecompensa: tema.xpRecompensa,
    minutosEstimados: tema.minutosEstimados,
    versionContenido: tema.versionContenido,
    estado: tema.estado,
    publicadoEn: tema.publicadoEn?.toISOString() ?? null,
    enda: tema.enda ? {
      id: tema.enda.id,
      nombre: tema.enda.nombre,
      codigo: tema.enda.codigo,
      colorHex: tema.enda.colorHex
    } : null,
    portada: tema.portada ? {
      id: tema.portada.id,
      tipo: tema.portada.tipo,
      urlPublica: tema.portada.urlPublica,
      textoAlternativo: tema.portada.textoAlternativo,
      tipoMime: tema.portada.tipoMime,
      tamanoBytes: tema.portada.tamanoBytes,
      duracionSeg: tema.portada.duracionSeg,
      anchoPx: tema.portada.anchoPx,
      altoPx: tema.portada.altoPx
    } : null
  };
}

/**
 * ============================================================
 * RUTAS
 * ============================================================
 */

export const themesRoutes = new Hono<AppBindings>();

/**
 * GET /temas
 *
 * Lista todos los temas publicados ordenados por fecha de publicación.
 * Opcionalmente filtra por senda_id.
 *
 * @query senda_id - Filtrar por ID de la senda (opcional)
 * @returns Lista de temas publicados
 */
themesRoutes.get("/", async (c) => {
  const endaId = c.req.query("senda_id");

  // Query con Drizzle: selecciona temas con su sendas y portada
  const resultados = await db
    .select({
      tema: schema.tema,
      enda: schema.enda,
      portada: schema.recursoMultimedia
    })
    .from(schema.tema)
    .leftJoin(schema.enda, eq(schema.tema.endaId, schema.enda.id))
    .leftJoin(schema.recursoMultimedia, eq(schema.tema.portadaRecursoId, schema.recursoMultimedia.id))
    .where(eq(schema.tema.estado, "publicado"))
    .orderBy(asc(schema.tema.publicadoEn));

  // Combina los resultados en un solo objeto
  const temasCombinados = resultados.map((r) => ({
    ...r.tema,
    enda: r.enda,
    portada: r.portada
  }));

  // Filtra por sendaid si se proporcionó
  const temasFiltrados =endaId
    ? temasCombinados.filter((t) => t.endaId ===endaId)
    : temasCombinados;

  return responderExito(temasFiltrados.map(serializarTemaParaListado));
});

/**
 * GET /temas/:tema_id/portada
 *
 * Genera una URL firmada para la imagen de portada del tema.
 * Las URLs firmadas expiran en 5 minutos por seguridad.
 *
 * @param tema_id - ID del tema
 * @returns URL firmada y tiempo de expiración
 */
themesRoutes.get("/:tema_id/portada", async (c) => {
  const temaId = c.req.param("tema_id");

  // Validación del formato UUID
  if (!UUID_REGEX.test(temaId)) {
    return responderError("El ID del tema debe ser un UUID válido", "VALIDATION_ERROR", 400);
  }

  // Busca el tema con su portada usando Drizzle
  const [tema] = await db
    .select({
      estado: schema.tema.estado,
      portada: schema.recursoMultimedia
    })
    .from(schema.tema)
    .leftJoin(schema.recursoMultimedia, eq(schema.tema.portadaRecursoId, schema.recursoMultimedia.id))
    .where(
      and(
        eq(schema.tema.id, temaId),
        eq(schema.tema.estado, "publicado")
      )
    )
    .limit(1);

  if (!tema) {
    throw new NotFoundError("Tema no encontrado");
  }

  // Verifica que la portada exista y esté activa
  if (!tema.portada?.claveAlmacenamiento || !tema.portada.activo) {
    throw new NotFoundError("El tema no tiene portada activa");
  }

  // Genera URL firmada usando Supabase Storage
  const supabaseAdmin = createSupabaseAdmin(c.env);
  const bucket = tema.portada.bucketAlmacenamiento ?? "media";
  const clave = tema.portada.claveAlmacenamiento;

  const { data: firmada, error: errorFirma } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(clave, URL_FIRMA_EXPIRADA_SEGUNDOS);

  if (errorFirma || !firmada?.signedUrl) {
    console.error("Error al crear URL firmada de portada:", errorFirma);
    return responderError("No se pudo generar URL firmada de la portada", "STORAGE_ERROR", 500);
  }

  return responderExito({
    url: firmada.signedUrl,
    expiraEnSegundos: URL_FIRMA_EXPIRADA_SEGUNDOS
  });
});

/**
 * GET /temas/:tema_id
 *
 * Obtiene el detalle completo de un tema.
 * Incluye sendas, portada, versículo clave y referencias bíblicas.
 *
 * @param tema_id - ID del tema
 * @returns Detalle del tema
 */
themesRoutes.get("/:tema_id", async (c) => {
  const temaId = c.req.param("tema_id");

  // Busca el tema completo
  const [resultado] = await db
    .select({
      tema: schema.tema,
      enda: schema.enda,
      portada: schema.recursoMultimedia
    })
    .from(schema.tema)
    .leftJoin(schema.enda, eq(schema.tema.endaId, schema.enda.id))
    .leftJoin(schema.recursoMultimedia, eq(schema.tema.portadaRecursoId, schema.recursoMultimedia.id))
    .where(eq(schema.tema.id, temaId))
    .limit(1);

  if (!resultado) {
    throw new NotFoundError("Tema no encontrado");
  }

  // Por ahora devolvemos el tema con su estructura básica
  // La serialización completa incluiría versículos, referencias, etc.
  return responderExito({
    ...serializarTemaParaListado({ ...resultado.tema, enda: resultado.enda, portada: resultado.portada })
  });
});

/**
 * GET /temas/:tema_id/pasos
 *
 * Lista los pasos/tempos CRECER del tema ordenados.
 * Opcionalmente filtra por grupo_edad_id.
 *
 * @param tema_id - ID del tema
 * @query grupo_edad_id - Filtrar contenidos por grupo de edad (opcional)
 * @returns Lista de pasos con sus contenidos
 */
themesRoutes.get("/:tema_id/pasos", async (c) => {
  const temaId = c.req.param("tema_id");
  const grupoEdadId = c.req.query("grupo_edad_id");

  // Busca los pasos del tema con sus tipos, contenidos y preguntas
  const pasos = await db
    .select({
      paso: schema.pasoTema,
      tipoPaso: schema.tipoPasoCrecer
    })
    .from(schema.pasoTema)
    .leftJoin(schema.tipoPasoCrecer, eq(schema.pasoTema.tipoPasoId, schema.tipoPasoCrecer.id))
    .where(eq(schema.pasoTema.temaId, temaId))
    .orderBy(asc(schema.pasoTema.orden));

  // Busca los contenidos y preguntas para cada paso
  const pasosConContenido = await Promise.all(
    pasos.map(async (p) => {
      // Contenidos del paso
      let contenidos = await db
        .select()
        .from(schema.contenidoPasoTema)
        .where(eq(schema.contenidoPasoTema.pasoId, p.paso.id));

      // Preguntas de reflexión
      let preguntas = await db
        .select()
        .from(schema.preguntaReflexion)
        .where(eq(schema.preguntaReflexion.pasoId, p.paso.id));

      // Filtra por grupo de edad si se proporcionó
      if (grupoEdadId) {
        contenidos = contenidos.filter((c) => c.grupoEdadId === grupoEdadId);
        preguntas = preguntas.filter((p) => p.grupoEdadId === grupoEdadId);
      }

      return {
        id: p.paso.id,
        temaId: p.paso.temaId,
        orden: p.paso.orden,
        obligatorio: p.paso.obligatorio,
        tipoPaso: p.tipoPaso ? {
          id: p.tipoPaso.id,
          codigo: p.tipoPaso.codigo,
          nombre: p.tipoPaso.nombre,
          orden: p.tipoPaso.orden,
          colorHex: p.tipoPaso.colorHex
        } : null,
        contenidos,
        preguntas
      };
    })
  );

  return responderExito(pasosConContenido);
});

/**
 * GET /temas/:tema_id/actividades
 *
 * Lista las actividades del tema ordenadas por el campo orden.
 * Opcionalmente filtra por grupo_edad_id.
 *
 * @param tema_id - ID del tema
 * @query grupo_edad_id - Filtrar por grupo de edad (opcional)
 * @returns Lista de actividades
 */
themesRoutes.get("/:tema_id/actividades", async (c) => {
  const temaId = c.req.param("tema_id");
  const grupoEdadId = c.req.query("grupo_edad_id");

  // Condiciones de la query
  const condiciones = [
    eq(schema.actividad.temaId, temaId)
  ];

  if (grupoEdadId) {
    condiciones.push(eq(schema.actividad.grupoEdadId, grupoEdadId));
  }

  // Busca las actividades con sus opciones
  const actividades = await db
    .select({
      actividad: schema.actividad,
      tipoActividad: schema.tipoActividad
    })
    .from(schema.actividad)
    .leftJoin(schema.tipoActividad, eq(schema.actividad.tipoActividadId, schema.tipoActividad.id))
    .where(and(...condiciones))
    .orderBy(asc(schema.actividad.orden));

  // Obtiene las opciones para cada actividad
  const actividadesConOpciones = await Promise.all(
    actividades.map(async (a) => {
      const opciones = await db
        .select()
        .from(schema.opcionActividad)
        .where(eq(schema.opcionActividad.actividadId, a.actividad.id));

      return {
        id: a.actividad.id,
        titulo: a.actividad.titulo,
        consigna: a.actividad.consigna,
        dificultad: a.actividad.dificultad,
        xpRecompensa: a.actividad.xpRecompensa,
        obligatorio: a.actividad.obligatorio,
        limiteTiempoSeg: a.actividad.limiteTiempoSeg,
        retroalimentacion: a.actividad.retroalimentacion,
        configuracion: a.actividad.configuracion,
        orden: a.actividad.orden,
        tipoActividad: a.tipoActividad ? {
          id: a.tipoActividad.id,
          codigo: a.tipoActividad.codigo,
          nombre: a.tipoActividad.nombre,
          esJuego: a.tipoActividad.esJuego
        } : null,
        opciones
      };
    })
  );

  return responderExito(actividadesConOpciones);
});
