import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, LoaderCircle, Trophy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
  obtenerNotificaciones,
  type NotificacionUsuario,
} from "@/features/perfil/profile.api";

export function AppNotifications() {
  const [abierto, setAbierto] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["perfil", "notificaciones"],
    queryFn: () => obtenerNotificaciones(30),
    refetchInterval: 60_000,
    enabled: typeof navigator === "undefined" || navigator.onLine,
  });
  const leerMutation = useMutation({
    mutationFn: marcarNotificacionLeida,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["perfil", "notificaciones"] }),
  });
  const todasMutation = useMutation({
    mutationFn: marcarTodasNotificacionesLeidas,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["perfil", "notificaciones"] }),
  });

  useEffect(() => {
    if (!abierto) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setAbierto(false);
    const onPointer = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setAbierto(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [abierto]);

  const noLeidas = query.data?.no_leidas ?? 0;

  return (
    <div className="app-notifications" ref={panelRef}>
      <button
        type="button"
        className="app-notifications__trigger"
        onClick={() => setAbierto((actual) => !actual)}
        aria-label={noLeidas ? `Notificaciones, ${noLeidas} sin leer` : "Notificaciones"}
        aria-expanded={abierto}
      >
        <Bell size={21} aria-hidden="true" />
        {noLeidas ? <span>{noLeidas > 9 ? "9+" : noLeidas}</span> : null}
      </button>

      {abierto ? (
        <section className="app-notifications__panel" role="dialog" aria-modal="false" aria-labelledby="notification-title">
          <header>
            <div><p>Centro de avisos</p><h2 id="notification-title">Notificaciones</h2></div>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar notificaciones"><X size={20} /></button>
          </header>
          <div className="app-notifications__actions">
            <span>{noLeidas} sin leer</span>
            <button type="button" disabled={!noLeidas || todasMutation.isPending} onClick={() => todasMutation.mutate()}>
              <CheckCheck size={16} /> Marcar todas como leídas
            </button>
          </div>
          <div className="app-notifications__list">
            {query.isLoading ? <div className="app-notifications__state"><LoaderCircle className="animate-spin" /> Cargando...</div> : null}
            {query.isError ? <div className="app-notifications__state">No se pudieron cargar los avisos.</div> : null}
            {(query.data?.notificaciones ?? []).map((item) => (
              <NotificationItem key={item.id} item={item} onRead={() => !item.leida_en && leerMutation.mutate(item.id)} />
            ))}
            {!query.isLoading && (query.data?.notificaciones.length ?? 0) === 0 ? (
              <div className="app-notifications__state"><Bell size={28} /><strong>Todo al día</strong><span>Aquí verás logros, sincronización y novedades de tus clubes.</span></div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function NotificationItem({ item, onRead }: { item: NotificacionUsuario; onRead: () => void }) {
  return (
    <button type="button" className={`app-notification-item ${item.leida_en ? "" : "app-notification-item--unread"}`} onClick={onRead}>
      <span className="app-notification-item__icon">{item.tipo.includes("logro") ? <Trophy size={19} /> : <Bell size={19} />}</span>
      <span className="app-notification-item__copy"><strong>{item.titulo}</strong><span>{item.mensaje}</span><time>{relativeTime(item.creado_en)}</time></span>
      {!item.leida_en ? <i aria-label="Sin leer" /> : null}
    </button>
  );
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60_000));
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}
