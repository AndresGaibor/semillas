import { db } from "./db";
import type { EventoOutbox } from "./db";

const MAX_RETRIES = 3;

export async function queueEventoProgreso(
  tipoEvento: EventoOutbox["tipoEvento"],
  params: {
    temaLocalId?: string;
    pasoLocalId?: string;
    actividadLocalId?: string;
    correcta?: boolean;
    puntaje?: number;
    xpOtorgada?: number;
    datos?: Record<string, unknown>;
  }
): Promise<string> {
  const localId = crypto.randomUUID();
  const dispositivoId = await getDispositivoId();

  const evento: EventoOutbox = {
    localId,
    tipoEvento,
    temaLocalId: params.temaLocalId,
    pasoLocalId: params.pasoLocalId,
    actividadLocalId: params.actividadLocalId,
    correcta: params.correcta,
    puntaje: params.puntaje,
    xpOtorgada: params.xpOtorgada,
    datos: params.datos,
    ocurridoEnCliente: new Date().toISOString(),
    dispositivoId,
    retries: 0,
    createdAt: Date.now(),
  };

  await db.eventosOutbox.add(evento);
  await updateSyncStatePendingCount();

  return localId;
}

export async function getEventosPendientes(): Promise<EventoOutbox[]> {
  return db.eventosOutbox
    .where("retries")
    .below(MAX_RETRIES)
    .sortBy("createdAt");
}

export async function getEventosFallidos(): Promise<EventoOutbox[]> {
  return db.eventosOutbox.where("retries").above(MAX_RETRIES - 1).toArray();
}

export async function markEventoProcesado(eventoLocalId: string): Promise<void> {
  await db.eventosOutbox.where("localId").equals(eventoLocalId).delete();
  await updateSyncStatePendingCount();
}

export async function markEventoError(
  eventoLocalId: string,
  error: string
): Promise<void> {
  const evento = await db.eventosOutbox.where("localId").equals(eventoLocalId).first();
  if (evento) {
    await db.eventosOutbox.update(evento.id!, {
      retries: evento.retries + 1,
      lastError: error,
    });
    await updateSyncStatePendingCount();
  }
}

export async function getPendingCount(): Promise<number> {
  return db.eventosOutbox
    .where("retries")
    .below(MAX_RETRIES)
    .count();
}


export async function reintentarEventosFallidos(): Promise<number> {
  const fallidos = await getEventosFallidos();
  if (fallidos.length === 0) return 0;
  await db.transaction("rw", db.eventosOutbox, async () => {
    for (const evento of fallidos) {
      if (evento.id) {
        await db.eventosOutbox.update(evento.id, { retries: 0, lastError: undefined });
      }
    }
  });
  await updateSyncStatePendingCount();
  return fallidos.length;
}

export async function eliminarEventosFallidos(): Promise<void> {
  await db.eventosOutbox.toCollection().filter((e) => e.retries >= MAX_RETRIES).delete();
  await updateSyncStatePendingCount();
}

async function updateSyncStatePendingCount(): Promise<void> {
  const count = await getPendingCount();
  const existing = await db.syncState.get("main");
  if (existing) {
    await db.syncState.update("main", {
      pendingCount: count,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await db.syncState.add({
      id: "main",
      lastSyncTimestamp: null,
      lastSyncExito: false,
      pendingCount: count,
      updatedAt: new Date().toISOString(),
    });
  }
}

let cachedDispositivoId: string | null = null;

async function getDispositivoId(): Promise<string> {
  if (cachedDispositivoId) return cachedDispositivoId;

  const stored = localStorage.getItem("semillas_dispositivo_id");
  if (stored) {
    cachedDispositivoId = stored;
    return stored;
  }

  const newId = crypto.randomUUID();
  localStorage.setItem("semillas_dispositivo_id", newId);
  cachedDispositivoId = newId;
  return newId;
}
