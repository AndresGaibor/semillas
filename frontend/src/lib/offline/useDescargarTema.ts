import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "./db";
import type { TemaLocal, PasoLocal, ActividadLocal } from "./db";
import { queueEventoProgreso } from "./outbox";

export function useDescargarTema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (temaId: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/temas/${temaId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error downloading tema: ${response.status}`);
      }

      const resultado = await response.json();
      const temaData = resultado.datos;

      const temaLocalId = crypto.randomUUID();
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
        grupoEdadId: null,
        createdAt: now,
        updatedAt: now,
        syncStatus: "synced",
      };

      const pasos: PasoLocal[] = (temaData.pasos ?? []).map((paso: {
        id: string;
        orden: number;
        tipo_paso: { codigo: string; nombre: string; color_hex: string | null } | null;
        contenidos: Array<{
          grupo_edad_id: string;
          titulo: string;
          cuerpo: string;
          instruccion_corta: string | null;
        }>;
      }) => ({
        localId: crypto.randomUUID(),
        serverId: paso.id,
        temaLocalId,
        orden: paso.orden,
        tipoPasoCodigo: paso.tipo_paso?.codigo ?? null,
        tipoPasoNombre: paso.tipo_paso?.nombre ?? null,
        tipoPasoColorHex: paso.tipo_paso?.color_hex ?? null,
        contenidos: paso.contenidos.map((c) => ({
          grupoEdadId: c.grupo_edad_id,
          titulo: c.titulo,
          cuerpo: c.cuerpo,
          instruccionCorta: c.instruccion_corta,
        })),
        createdAt: now,
        updatedAt: now,
        syncStatus: "synced" as const,
      }));

      const actividades: ActividadLocal[] = [];

      for (const paso of pasos) {
        const pasoServerId = paso.serverId;
        if (!pasoServerId) continue;

        const actsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/temas/${temaId}/actividades?paso_id=${pasoServerId}`,
          { headers: getAuthHeaders() }
        );

        if (actsRes.ok) {
          const actsResult = await actsRes.json();
          const grupoEdadId = paso.contenidos[0]?.grupoEdadId ?? "";

          for (const act of actsResult.datos ?? []) {
            actividades.push({
              localId: crypto.randomUUID(),
              serverId: act.id,
              temaLocalId,
              pasoLocalId: paso.localId,
              grupoEdadId,
              tipoActividadCodigo: act.tipo_actividad?.codigo ?? "",
              titulo: act.titulo,
              consigna: act.consigna,
              orden: act.orden,
              xpRecompensa: act.xp_recompensa,
              dificultad: act.dificultad,
              limiteTiempoSeg: act.limite_tiempo_seg,
              obligatorio: act.obligatorio,
              retroalimentacion: act.retroalimentacion,
              configuracion: act.configuracion ?? {},
              opciones: (act.opciones ?? []).map((o: {
                id: string;
                etiqueta: string | null;
                texto: string;
                correcta: boolean;
                orden: number;
                retroalimentacion: string | null;
              }) => ({
                id: o.id,
                etiqueta: o.etiqueta,
                texto: o.texto,
                correcta: o.correcta,
                orden: o.orden,
                retroalimentacion: o.retroalimentacion,
              })),
              createdAt: now,
              updatedAt: now,
              syncStatus: "synced" as const,
            });
          }
        }
      }

      await db.transaction("rw", [db.temas, db.pasos, db.actividades], async () => {
        await db.temas.add(tema);
        await db.pasos.bulkAdd(pasos);
        await db.actividades.bulkAdd(actividades);
      });

      await queueEventoProgreso("tema_descargado", {
        temaLocalId,
        datos: { temaId, versionContenido: tema.versionContenido },
      });

      return { temaLocalId, pasosCount: pasos.length, actividadesCount: actividades.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline", "temas"] });
      queryClient.invalidateQueries({ queryKey: ["sync", "status"] });
    },
  });
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const guestId = sessionStorage.getItem("semillas_guest_user_id");
  const token = sessionStorage.getItem("semillas_access_token");
  if (guestId) headers["X-Guest-User-Id"] = guestId;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
