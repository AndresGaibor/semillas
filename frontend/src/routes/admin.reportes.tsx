import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CalendarDays, Download, Flame, Loader2, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";

import { obtenerResumenAdminDetallado } from "@/features/admin/admin.api";

export const Route = createFileRoute("/admin/reportes")({ component: AdminReportesPage });

const periodos = [
  { id: "7", label: "7 días" },
  { id: "30", label: "30 días" },
  { id: "90", label: "90 días" },
  { id: "custom", label: "Personalizado" },
];

function AdminReportesPage() {
  const [periodo, setPeriodo] = useState("30");
  const query = useQuery({ queryKey: ["admin", "dashboard", "detallado"], queryFn: obtenerResumenAdminDetallado });

  const resumen = query.data;
  const series = resumen?.publicaciones_semana ?? [];

  const maxSerie = useMemo(() => Math.max(...series.map((item) => item.total), 1), [series]);

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__intro">
        <div>
          <span className="admin-eyebrow">Análisis editorial</span>
          <h2>Reportes</h2>
          <p>Consulta métricas de contenido, revisión y actividad del equipo.</p>
        </div>
        <div className="admin-dashboard__intro-actions">
          <select value={periodo} onChange={(event) => setPeriodo(event.target.value)} className="admin-secondary-button min-w-36">
            {periodos.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          <button type="button" className="admin-primary-button">
            <Download size={17} /> Exportar CSV
          </button>
        </div>
      </section>

      {query.isLoading ? (
        <div className="admin-dashboard-state">
          <span><Loader2 className="animate-spin" /></span>
          <h2>Cargando reportes</h2>
          <p>Calculando métricas reales de la plataforma.</p>
        </div>
      ) : query.isError || !resumen ? (
        <div className="admin-dashboard-state">
          <span><ShieldCheck /></span>
          <h2>No se pudieron cargar los reportes</h2>
          <p>Vuelve a intentar la consulta.</p>
        </div>
      ) : (
        <>
          <section className="admin-metrics-grid">
            <MetricCard icon={<Users size={22} />} label="Usuarios activos" value={resumen.metricas.usuarios_activos} detail="Cuentas con acceso habilitado" />
            <MetricCard icon={<BarChart3 size={22} />} label="Temas publicados" value={resumen.metricas.publicados} detail="Dentro del rango seleccionado" />
            <MetricCard icon={<ShieldCheck size={22} />} label="Pendientes de revisión" value={resumen.metricas.pendientes_revision} detail="Requieren decisión editorial" />
            <MetricCard icon={<Flame size={22} />} label="Actividades" value={resumen.metricas.actividades} detail="Experiencias creadas" />
          </section>

          <div className="admin-dashboard__grid">
            <div className="admin-dashboard__main-column">
              <section className="admin-panel-card">
                <PanelHeader title="Actividad diaria" description="Serie de publicaciones recientes del backend." />
                <div className="admin-week-chart" aria-label="Publicaciones por día">
                  {series.map((item) => (
                    <div key={item.fecha} className="admin-week-chart__item">
                      <span>{item.total}</span>
                      <div>
                        <i style={{ height: `${Math.max((item.total / maxSerie) * 100, item.total ? 12 : 3)}%` }} />
                      </div>
                      <small>{item.etiqueta.replace(".", "")}</small>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel-card">
                <PanelHeader title="Temas recientes" description="Últimas lecciones modificadas por el equipo." />
                <div className="admin-recent-list">
                  {resumen.temas_recientes.map((tema) => (
                    <div key={tema.id} className="admin-recent-row">
                      <span className="admin-recent-row__icon"><CalendarDays size={18} /></span>
                      <div>
                        <strong>{tema.titulo}</strong>
                        <small>{tema.senda} · {tema.autor}</small>
                      </div>
                      <span className="admin-state-pill bg-slate-100 text-slate-600">{tema.estado}</span>
                      <time>{formatRelative(tema.actualizado_en)}</time>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="admin-dashboard__side-column">
              <section className="admin-panel-card admin-panel-card--sticky">
                <PanelHeader title="Editorial" description="Resumen del flujo de revisión." />
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Publicados: {resumen.metricas.publicados.toLocaleString("es-EC")}</li>
                  <li>Temas totales: {resumen.metricas.temas.toLocaleString("es-EC")}</li>
                  <li>Actividades: {resumen.metricas.actividades.toLocaleString("es-EC")}</li>
                  <li>Clubes activos: {resumen.metricas.clubes_activos.toLocaleString("es-EC")}</li>
                </ul>
              </section>

              <section className="admin-panel-card">
                <PanelHeader title="Últimas revisiones" description="Contenido que todavía necesita decisión." />
                <div className="admin-review-list">
                  {resumen.revisiones.map((revision) => (
                    <div key={revision.id} className="admin-review-item">
                      <span><ShieldCheck size={17} /></span>
                      <div>
                        <strong>{revision.titulo}</strong>
                        <small>{revision.senda} · {revision.enviado_por}</small>
                      </div>
                      <time>{formatRelative(revision.creado_en)}</time>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: number; detail: string; }) {
  return (
    <article className="admin-metric-card">
      <span className="admin-metric-card__icon admin-tone--violet">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value.toLocaleString("es-EC")}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function PanelHeader({ title, description }: { title: string; description: string }) {
  return <header className="admin-panel-header"><div><h3>{title}</h3><p>{description}</p></div></header>;
}

function formatRelative(value: string | null) {
  if (!value) return "Sin fecha";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60_000));
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}
