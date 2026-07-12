import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  Eye,
  LoaderCircle,
  Search,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  moderarClubAdmin,
  obtenerClubAdmin,
  obtenerClubesAdmin,
  type ClubAdminResumen,
} from "@/features/admin/admin.api";

export const Route = createFileRoute("/admin/clubes")({ component: AdminClubesPage });

function AdminClubesPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [activo, setActivo] = useState("todos");
  const [pagina, setPagina] = useState(0);
  const [seleccionado, setSeleccionado] = useState<ClubAdminResumen | null>(null);
  const limit = 15;

  const clubesQuery = useQuery({
    queryKey: ["admin", "clubes", q, activo, pagina],
    queryFn: () => obtenerClubesAdmin({ q, activo, limit, offset: pagina * limit }),
  });
  const detalleQuery = useQuery({
    queryKey: ["admin", "clubes", seleccionado?.id, "detalle"],
    queryFn: () => obtenerClubAdmin(seleccionado!.id),
    enabled: Boolean(seleccionado),
  });

  const moderarMutation = useMutation({
    mutationFn: ({ id, nuevoEstado }: { id: string; nuevoEstado: boolean }) => moderarClubAdmin(id, { activo: nuevoEstado }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "clubes"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "clubes", variables.id, "detalle"] }),
      ]);
      setSeleccionado((actual) => actual ? { ...actual, activo: variables.nuevoEstado } : actual);
      toast.success(variables.nuevoEstado ? "Club reactivado" : "Club suspendido");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo moderar el club"),
  });

  const data = clubesQuery.data;
  const totalPaginas = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  return (
    <section className="admin-extra-page">
      <header className="admin-extra-hero">
        <div className="admin-extra-hero__icon"><Users aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <p className="admin-extra-eyebrow">Comunidad y moderación</p>
          <h1>Clubes</h1>
          <p>Supervisa grupos, membresías y retos sin exponer información innecesaria de sus participantes.</p>
        </div>
      </header>

      <div className="admin-extra-metrics">
        <Metric label="Clubes encontrados" value={data?.total ?? 0} icon={<Users />} />
        <Metric label="Activos en esta página" value={(data?.clubes ?? []).filter((item) => item.activo).length} icon={<CheckCircle2 />} />
        <Metric label="Miembros visibles" value={(data?.clubes ?? []).reduce((sum, item) => sum + item.miembros, 0)} icon={<ShieldCheck />} />
        <Metric label="Suspendidos" value={(data?.clubes ?? []).filter((item) => !item.activo).length} icon={<Ban />} />
      </div>

      <div className="admin-extra-panel">
        <div className="admin-extra-toolbar">
          <label className="admin-extra-search">
            <Search size={18} aria-hidden="true" />
            <input
              value={q}
              onChange={(event) => { setQ(event.target.value); setPagina(0); }}
              placeholder="Buscar por nombre o código"
              aria-label="Buscar clubes"
            />
          </label>
          <select value={activo} onChange={(event) => { setActivo(event.target.value); setPagina(0); }} aria-label="Filtrar por estado">
            <option value="todos">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Suspendidos</option>
          </select>
        </div>

        {clubesQuery.isLoading ? <Loading label="Cargando clubes..." /> : null}
        {clubesQuery.isError ? <ErrorState onRetry={() => void clubesQuery.refetch()} /> : null}
        {!clubesQuery.isLoading && !clubesQuery.isError && (data?.clubes.length ?? 0) === 0 ? (
          <div className="admin-extra-empty"><Users size={34} /><h3>No hay resultados</h3><p>Ajusta los filtros para encontrar otros clubes.</p></div>
        ) : null}

        <div className="admin-data-list">
          {(data?.clubes ?? []).map((club) => (
            <article key={club.id} className="admin-data-row">
              <div className="admin-data-row__primary">
                <strong>{club.nombre}</strong>
                <p>{club.descripcion || "Sin descripción"}</p>
              </div>
              <div className="admin-data-cell"><strong>{club.miembros}</strong><p>miembros</p></div>
              <div className="admin-data-cell"><span className={club.activo ? "admin-state admin-state--success" : "admin-state admin-state--danger"}>{club.activo ? "Activo" : "Suspendido"}</span><p>{club.codigo_invitacion}</p></div>
              <div className="admin-data-cell"><strong>{club.creador}</strong><p>{new Date(club.creado_en).toLocaleDateString("es-EC")}</p></div>
              <div className="admin-data-row__actions">
                <button type="button" className="admin-icon-button" onClick={() => setSeleccionado(club)} aria-label={`Ver ${club.nombre}`}><Eye size={18} /></button>
                <button
                  type="button"
                  className={`admin-icon-button ${club.activo ? "admin-icon-button--danger" : ""}`}
                  disabled={moderarMutation.isPending}
                  onClick={() => {
                    const accion = club.activo ? "suspender" : "reactivar";
                    if (window.confirm(`¿${accion} el club “${club.nombre}”?`)) moderarMutation.mutate({ id: club.id, nuevoEstado: !club.activo });
                  }}
                  aria-label={club.activo ? `Suspender ${club.nombre}` : `Reactivar ${club.nombre}`}
                >
                  {club.activo ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="admin-pagination">
          <span>{data?.total ?? 0} clubes · Página {pagina + 1} de {totalPaginas}</span>
          <div className="admin-pagination__buttons">
            <button type="button" className="admin-extra-secondary" disabled={pagina === 0} onClick={() => setPagina((actual) => Math.max(0, actual - 1))}>Anterior</button>
            <button type="button" className="admin-extra-secondary" disabled={pagina + 1 >= totalPaginas} onClick={() => setPagina((actual) => actual + 1)}>Siguiente</button>
          </div>
        </div>
      </div>

      {seleccionado ? (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSeleccionado(null)}>
          <section className="admin-modal admin-modal--wide" role="dialog" aria-modal="true" aria-labelledby="club-detail-title">
            <header className="admin-modal__header">
              <div>
                <p className="admin-extra-eyebrow">Moderación global</p>
                <h2 id="club-detail-title">{seleccionado.nombre}</h2>
              </div>
              <button type="button" className="admin-icon-button" onClick={() => setSeleccionado(null)} aria-label="Cerrar"><X size={20} /></button>
            </header>
            <div className="admin-modal__body">
              {detalleQuery.isLoading ? <Loading label="Cargando detalle..." /> : null}
              {detalleQuery.isError ? <ErrorState onRetry={() => void detalleQuery.refetch()} /> : null}
              {detalleQuery.data ? (
                <div className="admin-detail-grid">
                  <article className="admin-detail-card">
                    <h3><Users size={18} className="inline mr-2" />Miembros ({detalleQuery.data.miembros.length})</h3>
                    <div className="admin-detail-list">
                      {detalleQuery.data.miembros.map((miembro) => (
                        <div key={miembro.usuarioId}>
                          <span><strong>{miembro.nombre || "Usuario"}</strong><br />{miembro.correo || "Sin correo visible"}</span>
                          <span>{miembro.rol}<br />{miembro.activo ? "Activo" : "Bloqueado"}</span>
                        </div>
                      ))}
                      {detalleQuery.data.miembros.length === 0 ? <p>No hay miembros.</p> : null}
                    </div>
                  </article>
                  <div className="admin-settings-section">
                    <article className="admin-detail-card">
                      <h3><Target size={18} className="inline mr-2" />Retos ({detalleQuery.data.retos.length})</h3>
                      <div className="admin-detail-list">
                        {detalleQuery.data.retos.map((reto) => (
                          <div key={reto.id}>
                            <span><strong>{reto.nombre}</strong><br />{reto.codigoMetrica}: {reto.valorObjetivo}</span>
                            <span>{reto.xpReto} XP<br />hasta {new Date(reto.fechaFin).toLocaleDateString("es-EC")}</span>
                          </div>
                        ))}
                        {detalleQuery.data.retos.length === 0 ? <p>No hay retos configurados.</p> : null}
                      </div>
                    </article>
                    <article className="admin-detail-card">
                      <h3><CalendarDays size={18} className="inline mr-2" />Datos del club</h3>
                      <div className="admin-detail-list">
                        <div><span>Código</span><strong>{seleccionado.codigo_invitacion}</strong></div>
                        <div><span>Creado por</span><strong>{seleccionado.creador}</strong></div>
                        <div><span>Estado</span><strong>{seleccionado.activo ? "Activo" : "Suspendido"}</strong></div>
                      </div>
                      <button
                        type="button"
                        className={seleccionado.activo ? "admin-extra-secondary mt-4 text-red-600" : "admin-extra-primary mt-4"}
                        onClick={() => moderarMutation.mutate({ id: seleccionado.id, nuevoEstado: !seleccionado.activo })}
                      >
                        {seleccionado.activo ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                        {seleccionado.activo ? "Suspender club" : "Reactivar club"}
                      </button>
                    </article>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return <article className="admin-extra-metric"><span>{icon}</span><div><strong>{value}</strong><p>{label}</p></div></article>;
}
function Loading({ label }: { label: string }) { return <div className="admin-extra-loading"><LoaderCircle className="animate-spin" /><span>{label}</span></div>; }
function ErrorState({ onRetry }: { onRetry: () => void }) { return <div className="admin-extra-empty"><h3>No se pudo cargar la información</h3><button type="button" className="admin-extra-primary" onClick={onRetry}>Reintentar</button></div>; }
