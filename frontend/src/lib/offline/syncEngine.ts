import { db } from "./db";
import {
  getEventosPendientes,
  markEventoProcesado,
  markEventoError,
  getPendingCount,
} from "./outbox";
import type { EventoOutbox } from "./db";

export type SyncStatus = "idle" | "syncing" | "error" | "offline";

export interface SyncResult {
  exito: boolean;
  procesados: number;
  errores: number;
  timestamp: string;
}

const SYNC_INTERVAL_MS = 30_000;
const PUSH_BATCH_SIZE = 50;

let syncIntervalId: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;

export function getSyncStatus(): SyncStatus {
  if (!navigator.onLine) return "offline";
  return "idle";
}

export async function pushPendingEvents(): Promise<{
  procesados: number;
  errores: number }> {
  if (isSyncing) return { procesados: 0, errores: 0 };
  isSyncing = true;

  const eventos = await getEventosPendientes();
  let procesados = 0;
  let errores = 0;

  const batches = chunkArray(eventos, PUSH_BATCH_SIZE);

  for (const batch of batches) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sync/push`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ eventos: batch }),
      });

      if (response.ok) {
        for (const evento of batch) {
          await markEventoProcesado(evento.localId);
          procesados++;
        }
      } else if (response.status === 409) {
        for (const evento of batch) {
          await markEventoError(evento.localId, "Conflicto de versión");
          errores++;
        }
      } else {
        const errorText = await response.text();
        for (const evento of batch) {
          await markEventoError(evento.localId, errorText);
          errores++;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de red";
      for (const evento of batch) {
        await markEventoError(evento.localId, msg);
        errores++;
      }
    }
  }

  isSyncing = false;
  await updateSyncStateTimestamp(procesados > 0);

  return { procesados, errores };
}

export async function pullCambios(): Promise<void> {
  const syncState = await db.syncState.get("main");
  const since = syncState?.lastSyncTimestamp;

  const params = new URLSearchParams();
  if (since) params.set("since", since);

  const url = `${import.meta.env.VITE_API_URL}/sync/pull${params.toString() ? `?${params}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Pull failed: ${response.status}`);
  }

  const resultado = await response.json();

  if (!resultado.exito) {
    throw new Error(resultado.error ?? "Error en pull");
  }

  await db.transaction("rw", [db.progresoUsuario, db.syncState], async () => {
    if (resultado.datos?.progresos_actualizados) {
      for (const progreso of resultado.datos.progresos_actualizados) {
        await upsertProgreso(progreso);
      }
    }

    await db.syncState.update("main", {
      lastSyncTimestamp: resultado.datos.timestamp_servidor ?? new Date().toISOString(),
      lastSyncExito: true,
      pendingCount: await getPendingCount(),
      updatedAt: new Date().toISOString(),
    });
  });
}

async function upsertProgreso(serverProgreso: {
  id: string;
  tema_id: string;
  estado: string;
  porcentaje: number;
  iniciado_en: string | null;
  completado_en: string | null;
}): Promise<void> {
  const existing = await db.progresoUsuario
    .where("serverId")
    .equals(serverProgreso.id)
    .first();

  const now = new Date().toISOString();

  if (existing) {
    await db.progresoUsuario.update(existing.localId, {
      estado: serverProgreso.estado as "en_progreso" | "completado",
      porcentaje: serverProgreso.porcentaje,
      iniciadoEn: serverProgreso.iniciado_en,
      completadoEn: serverProgreso.completado_en,
      updatedAt: now,
      syncStatus: "synced",
    });
  }
}

export async function syncFull(): Promise<SyncResult> {
  if (!navigator.onLine) {
    return { exito: false, procesados: 0, errores: 0, timestamp: new Date().toISOString() };
  }

  try {
    const pushResult = await pushPendingEvents();
    await pullCambios();
    return {
      exito: true,
      procesados: pushResult.procesados,
      errores: pushResult.errores,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      exito: false,
      procesados: 0,
      errores: 1,
      timestamp: new Date().toISOString(),
    };
  }
}

export function startAutoSync(): void {
  if (syncIntervalId) return;

  syncIntervalId = setInterval(async () => {
    if (navigator.onLine) {
      const count = await getPendingCount();
      if (count > 0) {
        await pushPendingEvents();
      }
    }
  }, SYNC_INTERVAL_MS);

  window.addEventListener("online", onOnline);
}

export function stopAutoSync(): void {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
  window.removeEventListener("online", onOnline);
}

async function onOnline(): Promise<void> {
  const count = await getPendingCount();
  if (count > 0) {
    await pushPendingEvents();
  }
}

async function updateSyncStateTimestamp(exito: boolean): Promise<void> {
  const now = new Date().toISOString();
  const pendingCount = await getPendingCount();
  const existing = await db.syncState.get("main");

  if (existing) {
    await db.syncState.update("main", {
      lastSyncTimestamp: now,
      lastSyncExito: exito,
      pendingCount,
      updatedAt: now,
    });
  } else {
    await db.syncState.add({
      id: "main",
      lastSyncTimestamp: now,
      lastSyncExito: exito,
      pendingCount,
      updatedAt: now,
    });
  }
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

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
