export { db } from "./db";
export type {
  TemaLocal,
  PasoLocal,
  ActividadLocal,
  ProgresoUsuarioLocal,
  EventoOutbox,
  SyncState,
  PerfilLocal,
  MediaCache,
} from "./db";

export {
  queueEventoProgreso,
  getEventosPendientes,
  getEventosFallidos,
  markEventoProcesado,
  getPendingCount,
  clearEventosProcesados,
} from "./outbox";

export {
  syncFull,
  pushPendingEvents,
  pullCambios,
  getSyncStatus,
  startAutoSync,
  stopAutoSync,
} from "./syncEngine";
export type { SyncStatus, SyncResult } from "./syncEngine";

export {
  useSyncStatus,
  useEventosPendientes,
  useTemasLocales,
  useTemaLocal,
  usePasosLocales,
  useActividadesLocales,
  useProgresoLocal,
  useProgresosLocales,
  useRegistrarEventoProgreso,
  useAutoSync,
} from "./hooks";

export { useDescargarTema } from "./useDescargarTema";
