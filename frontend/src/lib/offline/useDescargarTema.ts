import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../../shared/config/env";
import { sessionStorageApi } from "../../shared/api/session";
import type { Actividad, Paso, Tema } from "../../shared/api/api";
import { db } from "./db";
import type { TemaLocal, PasoLocal, ActividadLocal } from "./db";
import { queueEventoProgreso } from "./outbox";

type RespuestaApi<T> = { exito: true; datos: T } | { exito: false; error: string };

export function useDescargarTema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (temaId: string) => {
      const headers = getAuthHeaders();
      const [temaData, pasosData, actividadesData] = await Promise.all([
        obtener<Tema>(`/temas/${temaId}`, headers),
        obtener<Paso[]>(`/temas/${temaId}/pasos`, headers),
        obtener<Actividad[]>(`/temas/${temaId}/actividades`, headers),
      ]);

      const existente = await db.temas.where("serverId").equals(temaId).first();
      const temaLocalId = existente?.localId ?? crypto.randomUUID();
      const now = new Date().toISOString();

      const tema: TemaLocal = {
        localId: temaLocalId,
        serverId: temaData.id,
        titulo: temaData.titulo,
        slug: temaData.slug,
        objetivo: temaData.objetivo,
        resumen: temaData.resumen,
        portadaUrl: temaData.portada_recurso?.url_publica ?? null,
        estado: temaData.estado,
        xpRecompensa: temaData.xp_recompensa,
        minutosEstimados: temaData.minutos_estimados,
        versionContenido: temaData.version_contenido,
        publicadoEn: temaData.publicado_en,
        grupoEdadId: existente?.grupoEdadId ?? null,
        createdAt: existente?.createdAt ?? now,
        updatedAt: now,
        syncStatus: "synced",
      };

      const pasoLocalPorServerId = new Map<string, string>();
      const pasos: PasoLocal[] = pasosData.map((paso) => {
        const localId = crypto.randomUUID();
        pasoLocalPorServerId.set(paso.id, localId);

        return {
          localId,
          serverId: paso.id,
          temaLocalId,
          orden: paso.orden,
          tipoPasoCodigo: paso.tipo_paso?.codigo ?? null,
          tipoPasoNombre: paso.tipo_paso?.nombre ?? null,
          tipoPasoColorHex: paso.tipo_paso?.color_hex ?? null,
          contenidos: paso.contenidos.map((contenido) => ({
            grupoEdadId: contenido.grupo_edad_id,
            titulo: contenido.titulo,
            cuerpo: contenido.cuerpo,
            instruccionCorta: contenido.instruccion_corta,
          })),
          createdAt: now,
          updatedAt: now,
          syncStatus: "synced" as const,
        };
      });

      const actividades: ActividadLocal[] = actividadesData.map((actividad) => ({
        localId: crypto.randomUUID(),
        serverId: actividad.id,
        temaLocalId,
        pasoLocalId: actividad.paso_id ? pasoLocalPorServerId.get(actividad.paso_id) ?? null : null,
        grupoEdadId: actividad.grupo_edad_id,
        tipoActividadCodigo: actividad.tipo_actividad?.codigo ?? "",
        titulo: actividad.titulo,
        consigna: actividad.consigna,
        orden: actividad.orden,
        xpRecompensa: actividad.xp_recompensa,
        dificultad: actividad.dificultad,
        limiteTiempoSeg: actividad.limite_tiempo_seg,
        obligatorio: actividad.obligatorio,
        retroalimentacion: actividad.retroalimentacion,
        configuracion: actividad.configuracion ?? {},
        opciones: (actividad.opciones ?? []).map((opcion) => ({
          id: opcion.id,
          etiqueta: opcion.etiqueta,
          texto: opcion.texto,
          // El paquete público nunca incluye claves de respuesta. Se conserva
          // el shape local por compatibilidad, pero no se premia XP offline.
          correcta: false,
          orden: opcion.orden,
          retroalimentacion: null,
        })),
        createdAt: now,
        updatedAt: now,
        syncStatus: "synced" as const,
      }));

      await db.transaction("rw", [db.temas, db.pasos, db.actividades], async () => {
        await db.pasos.where("temaLocalId").equals(temaLocalId).delete();
        await db.actividades.where("temaLocalId").equals(temaLocalId).delete();
        await db.temas.put(tema);
        if (pasos.length > 0) await db.pasos.bulkPut(pasos);
        if (actividades.length > 0) await db.actividades.bulkPut(actividades);
      });

      await queueEventoProgreso("tema_descargado", {
        temaLocalId,
        datos: { tema_id: temaId, version_contenido: tema.versionContenido },
      });

      return { temaLocalId, pasosCount: pasos.length, actividadesCount: actividades.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline", "temas"] });
      queryClient.invalidateQueries({ queryKey: ["sync", "status"] });
    },
  });
}

async function obtener<T>(ruta: string, headers: Record<string, string>): Promise<T> {
  const response = await fetch(`${env.apiUrl}${ruta}`, { headers });
  const resultado = await response.json().catch(() => null) as RespuestaApi<T> | null;

  if (!response.ok || !resultado?.exito) {
    throw new Error(resultado && !resultado.exito ? resultado.error : `Error al descargar contenido (${response.status})`);
  }

  return resultado.datos;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const guestId = sessionStorageApi.getGuestUserId();
  const guestToken = sessionStorageApi.getGuestToken();
  const token = sessionStorageApi.getAccessToken();
  if (guestId) headers["X-Guest-User-Id"] = guestId;
  if (guestToken) headers["X-Guest-Token"] = guestToken;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
