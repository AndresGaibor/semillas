import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db, type TemaLocal } from "./db";
import { cachearMediosPaqueteOffline, eliminarMedioDeCache } from "./media-cache";
import { mapearPaqueteOfflineARegistros, type PaqueteOfflineRespuesta } from "./offline-package";
import { queueEventoProgreso } from "./outbox";
import { obtenerMiPerfil } from "@/features/profile/profile.api";
import { peticion } from "@/shared/api/api";

type DescargaTemaParams = {
  temaId: string;
  grupoEdadId?: string;
  onProgress?: (progreso: number) => void;
};

export function useDescargarTema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: descargarTemaOffline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offline"] });
      queryClient.invalidateQueries({ queryKey: ["sync"] });
      queryClient.invalidateQueries({ queryKey: ["temas"] });
    },
  });
}

export async function descargarTemaOffline({ temaId, grupoEdadId: grupoSolicitado, onProgress }: DescargaTemaParams) {
      const perfil = await obtenerMiPerfil();
      const grupoEdadId = grupoSolicitado ?? perfil.perfil.grupo_edad_id;

      if (!grupoEdadId) {
        throw new Error("Completa tu franja de edad antes de descargar contenido.");
      }

      const paquete = await peticion<PaqueteOfflineRespuesta>(`/temas/${temaId}/paquete-offline`, {
        metodo: "POST",
        cuerpo: { grupo_edad_id: grupoEdadId },
      });

      const registros = mapearPaqueteOfflineARegistros(paquete);
      const temaLocalId = registros.tema.localId;
      const ahora = new Date().toISOString();

      const tema: TemaLocal = {
        ...registros.tema,
        localId: temaLocalId,
        serverId: paquete.tema.id,
        descargaEstado: "descargando",
        descargaProgreso: 0,
        descargadoEn: null,
        downloadedAt: registros.tema.downloadedAt,
        errorDescarga: null,
        syncStatus: "synced",
        createdAt: registros.tema.createdAt,
        updatedAt: ahora,
      };

      const pasos = registros.pasos.map((paso) => ({ ...paso, temaLocalId }));
      const actividades = registros.actividades.map((actividad) => ({
        ...actividad,
        temaLocalId,
      }));

      await db.transaction("rw", [db.temas, db.pasos, db.actividades, db.mediaCache], async () => {
        await db.pasos.where("temaLocalId").equals(temaLocalId).delete();
        await db.actividades.where("temaLocalId").equals(temaLocalId).delete();
        await db.mediaCache.where("temaLocalId").equals(temaLocalId).delete();
        await db.temas.put(tema);
        if (pasos.length > 0) await db.pasos.bulkPut(pasos);
        if (actividades.length > 0) await db.actividades.bulkPut(actividades);
      });

      await cachearMediosPaqueteOffline(paquete, temaLocalId, (progreso) => {
        if (onProgress) onProgress(Math.max(10, Math.min(95, progreso)));
        void db.temas.update(temaLocalId, {
          descargaProgreso: Math.max(10, Math.min(95, progreso)),
          descargaEstado: "descargando",
          updatedAt: new Date().toISOString(),
        });
      });

      await db.temas.update(temaLocalId, {
        descargaEstado: "descargado",
        descargaProgreso: 100,
        descargadoEn: ahora,
        errorDescarga: null,
        paqueteId: paquete.paquete_id,
        paqueteVersionContenido: paquete.tema.version_contenido,
        paqueteTamanoBytes: paquete.tamano_bytes,
        packageId: paquete.paquete_id,
        packageSizeBytes: paquete.tamano_bytes,
        mediaServerIds: paquete.medios.map((medio) => medio.id),
        downloadedAt: ahora,
        updatedAt: ahora,
      });

      await queueEventoProgreso("tema_descargado", {
        temaLocalId,
        datos: { tema_id: temaId, version_contenido: paquete.tema.version_contenido },
      });

      if (onProgress) onProgress(100);

      return {
        temaLocalId,
        pasosCount: pasos.length,
        actividadesCount: actividades.length,
        mediosCount: paquete.medios.length,
        paqueteId: paquete.paquete_id,
      };
}

export async function eliminarTemaDescargado(temaServerId: string): Promise<void> {
  const tema = await db.temas.where("serverId").equals(temaServerId).first();
  if (!tema) return;

  const [pasos, actividades, eventos] = await Promise.all([
    db.pasos.where("temaLocalId").equals(tema.localId).toArray(),
    db.actividades.where("temaLocalId").equals(tema.localId).toArray(),
    db.eventosOutbox.toArray(),
  ]);
  const pasoIds = new Set(pasos.map((paso) => paso.localId));
  const actividadIds = new Set(actividades.map((actividad) => actividad.localId));
  const tieneProgresoPendiente = eventos.some((evento) =>
    evento.tipoEvento !== "tema_descargado" && (
      evento.temaLocalId === tema.localId ||
      Boolean(evento.pasoLocalId && pasoIds.has(evento.pasoLocalId)) ||
      Boolean(evento.actividadLocalId && actividadIds.has(evento.actividadLocalId))
    ),
  );
  if (tieneProgresoPendiente) {
    throw new Error("Este tema tiene progreso pendiente. Conéctate y sincroniza antes de eliminarlo.");
  }

  const otrosTemas = await db.temas.filter((item) => item.localId !== tema.localId).toArray();
  const mediosCompartidos = new Set(otrosTemas.flatMap((item) => item.mediaServerIds ?? []));
  await db.transaction("rw", [db.temas, db.pasos, db.actividades, db.progresoUsuario, db.eventosOutbox, db.descargaJobs], async () => {
    await db.eventosOutbox.toCollection().filter((evento) => evento.temaLocalId === tema.localId && evento.tipoEvento === "tema_descargado").delete();
    await db.pasos.where("temaLocalId").equals(tema.localId).delete();
    await db.actividades.where("temaLocalId").equals(tema.localId).delete();
    await db.progresoUsuario.where("temaLocalId").equals(tema.localId).delete();
    await db.temas.delete(tema.localId);
    await db.descargaJobs.delete(temaServerId);
  });
  for (const mediaId of tema.mediaServerIds ?? []) {
    if (!mediosCompartidos.has(mediaId)) await eliminarMedioDeCache(mediaId);
  }
}
