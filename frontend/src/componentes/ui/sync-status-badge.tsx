import { CloudOff, RefreshCw, Check, AlertCircle } from "lucide-react";
import { useSyncStatus, useEventosPendientes } from "@/lib/offline";

export function SyncStatusBadge() {
  const { data: status } = useSyncStatus();
  const { data: pendingCount = 0 } = useEventosPendientes();

  if (!status?.isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
        <CloudOff size={12} />
        <span>Sin conexión</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
        <RefreshCw size={12} className="animate-spin" />
        <span>{pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}</span>
      </div>
    );
  }

  if (status.lastSyncExito) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
        <Check size={12} />
        <span>Sincronizado</span>
      </div>
    );
  }

  return null;
}

export function OfflineBanner() {
  const { data: isOnline } = useSyncStatus();

  if (!isOnline) {
    return (
      <div className="w-full bg-slate-800 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
        <CloudOff size={14} />
        Estás sin conexión. El progreso se guardará localmente.
      </div>
    );
  }

  return null;
}
