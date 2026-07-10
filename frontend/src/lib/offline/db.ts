import Dexie, { type EntityTable } from "dexie";

export interface TemaLocal {
  localId: string;
  serverId?: string;
  titulo: string;
  slug: string;
  objetivo: string;
  resumen: string | null;
  portadaUrl: string | null;
  estado: string;
  xpRecompensa: number;
  minutosEstimados: number;
  versionContenido: number;
  publicadoEn: string | null;
  grupoEdadId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus: "synced" | "pending" | "error";
}

export interface PasoLocal {
  localId: string;
  serverId?: string;
  temaLocalId: string;
  orden: number;
  tipoPasoCodigo: string | null;
  tipoPasoNombre: string | null;
  tipoPasoColorHex: string | null;
  contenidos: Array<{
    grupoEdadId: string;
    titulo: string;
    cuerpo: string;
    instruccionCorta: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus: "synced" | "pending" | "error";
}

export interface ActividadLocal {
  localId: string;
  serverId?: string;
  temaLocalId: string;
  pasoLocalId: string | null;
  grupoEdadId: string;
  tipoActividadCodigo: string;
  titulo: string;
  consigna: string;
  orden: number;
  xpRecompensa: number;
  dificultad: string;
  limiteTiempoSeg: number | null;
  obligatorio: boolean;
  retroalimentacion: string | null;
  configuracion: Record<string, unknown>;
  opciones: Array<{
    id: string;
    etiqueta: string | null;
    texto: string;
    correcta: boolean;
    orden: number;
    retroalimentacion: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus: "synced" | "pending" | "error";
}

export interface ProgresoUsuarioLocal {
  localId: string;
  serverId?: string;
  temaLocalId: string;
  pasoLocalId: string | null;
  actividadLocalId: string | null;
  estado: "en_progreso" | "completado";
  porcentaje: number;
  iniciadoEn: string | null;
  completadoEn: string | null;
  mejorPuntaje: number | null;
  intentos: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus: "synced" | "pending" | "error";
}

export interface EventoOutbox {
  id?: number;
  localId: string;
  tipoEvento:
    | "tema_iniciado"
    | "tema_completado"
    | "bloque_iniciado"
    | "bloque_completado"
    | "actividad_iniciada"
    | "actividad_respondida"
    | "actividad_completada"
    | "recompensa_reclamada"
    | "tema_descargado"
    | "marcador_sincronizacion";
  temaLocalId?: string;
  pasoLocalId?: string;
  actividadLocalId?: string;
  correcta?: boolean;
  puntaje?: number;
  xpOtorgada?: number;
  datos?: Record<string, unknown>;
  ocurridoEnCliente: string;
  dispositivoId: string;
  retries: number;
  lastError?: string;
  createdAt: number;
}

export interface SyncState {
  id: string;
  lastSyncTimestamp: string | null;
  lastSyncExito: boolean;
  pendingCount: number;
  updatedAt: string;
}

export interface PerfilLocal {
  localId: string;
  serverId?: string;
  apodo: string;
  grupoEdadId: string | null;
  urlAvatar: string | null;
  claveAvatar: string | null;
  prefiereAudio: boolean;
  tamanoTextoPreferido: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: "synced" | "pending" | "error";
}

export interface MediaCache {
  id?: number;
  serverId: string;
  tipo: "imagen" | "audio" | "video";
  urlOriginal: string;
  urlLocal?: string;
  textoAlternativo: string | null;
  tamanoBytes: number | null;
  duracionSeg: number | null;
  anchoPx: number | null;
  altoPx: number | null;
  cachedAt: number;
  accessedAt: number;
}

class SemillasDatabase extends Dexie {
  temas!: EntityTable<TemaLocal, "localId">;
  pasos!: EntityTable<PasoLocal, "localId">;
  actividades!: EntityTable<ActividadLocal, "localId">;
  progresoUsuario!: EntityTable<ProgresoUsuarioLocal, "localId">;
  eventosOutbox!: EntityTable<EventoOutbox, "id">;
  syncState!: EntityTable<SyncState, "id">;
  perfil!: EntityTable<PerfilLocal, "localId">;
  mediaCache!: EntityTable<MediaCache, "id">;

  constructor() {
    super("semillas_offline_db");

    this.version(1).stores({
      temas: "localId, serverId, slug, estado, syncStatus, updatedAt",
      pasos: "localId, serverId, temaLocalId, orden, syncStatus",
      actividades: "localId, serverId, temaLocalId, pasoLocalId, grupoEdadId, tipoActividadCodigo, syncStatus",
      progresoUsuario: "localId, serverId, temaLocalId, pasoLocalId, actividadLocalId, syncStatus, updatedAt",
      eventosOutbox: "++id, localId, tipoEvento, createdAt, retries",
      syncState: "id",
      perfil: "localId, serverId, syncStatus",
      mediaCache: "++id, serverId, tipo, urlOriginal, cachedAt, accessedAt",
    });
  }
}

export const db = new SemillasDatabase();
