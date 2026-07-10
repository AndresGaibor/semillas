import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "./db";
import { getPendingCount, queueEventoProgreso } from "./outbox";
import { startAutoSync, stopAutoSync } from "./syncEngine";

export function useSyncStatus() {
  return useQuery({
    queryKey: ["sync", "status"],
    queryFn: async () => {
      const pendingCount = await getPendingCount();
      const syncState = await db.syncState.get("main");
      return {
        pendingCount,
        lastSyncTimestamp: syncState?.lastSyncTimestamp ?? null,
        lastSyncExito: syncState?.lastSyncExito ?? false,
        isOnline: navigator.onLine,
      };
    },
    refetchInterval: 5_000,
  });
}

export function useEventosPendientes() {
  return useQuery({
    queryKey: ["sync", "pending-events"],
    queryFn: () => getPendingCount(),
    refetchInterval: 10_000,
  });
}

export function useTemasLocales() {
  return useQuery({
    queryKey: ["offline", "temas"],
    queryFn: () =>
      db.temas.orderBy("updatedAt").reverse().toArray(),
  });
}

export function useTemaLocal(localId: string) {
  return useQuery({
    queryKey: ["offline", "tema", localId],
    queryFn: () => db.temas.get(localId),
    enabled: !!localId,
  });
}

export function usePasosLocales(temaLocalId: string) {
  return useQuery({
    queryKey: ["offline", "pasos", temaLocalId],
    queryFn: () =>
      db.pasos
        .where("temaLocalId")
        .equals(temaLocalId)
        .sortBy("orden"),
    enabled: !!temaLocalId,
  });
}

export function useActividadesLocales(temaLocalId: string, grupoEdadId: string) {
  return useQuery({
    queryKey: ["offline", "actividades", temaLocalId, grupoEdadId],
    queryFn: () =>
      db.actividades
        .where("temaLocalId")
        .equals(temaLocalId)
        .filter((a) => a.grupoEdadId === grupoEdadId)
        .toArray(),
    enabled: !!temaLocalId && !!grupoEdadId,
  });
}

export function useProgresoLocal(temaLocalId: string) {
  return useQuery({
    queryKey: ["offline", "progreso", temaLocalId],
    queryFn: () =>
      db.progresoUsuario
        .where("temaLocalId")
        .equals(temaLocalId)
        .first(),
    enabled: !!temaLocalId,
  });
}

export function useProgresosLocales() {
  return useQuery({
    queryKey: ["offline", "progresos"],
    queryFn: () =>
      db.progresoUsuario
        .where("syncStatus")
        .notEqual("deleted")
        .toArray(),
  });
}

export function useRegistrarEventoProgreso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tipoEvento: Parameters<typeof queueEventoProgreso>[0];
      temaLocalId?: string;
      pasoLocalId?: string;
      actividadLocalId?: string;
      correcta?: boolean;
      puntaje?: number;
      xpOtorgada?: number;
    }) => {
      const localId = await queueEventoProgreso(params.tipoEvento, {
        temaLocalId: params.temaLocalId,
        pasoLocalId: params.pasoLocalId,
        actividadLocalId: params.actividadLocalId,
        correcta: params.correcta,
        puntaje: params.puntaje,
        xpOtorgada: params.xpOtorgada,
      });
      return localId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync", "pending-events"] });
      queryClient.invalidateQueries({ queryKey: ["sync", "status"] });
    },
  });
}

export function useAutoSync(enabled: boolean = true) {
  if (enabled) {
    startAutoSync();
  } else {
    stopAutoSync();
  }
}
