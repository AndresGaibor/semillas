import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BookOpen,
  Download,
  Flame,
  LoaderCircle,
  Search,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { obtenerAuditoriaAdmin, obtenerReportesAdmin } from "@/features/admin/admin.api";

export const Route = createFileRoute("/admin/reportes")({ component: AdminReportesPage });

function fechaInput(date: Date) { return date.toISOString().slice(0, 10); }

function AdminReportesPage() {
  const hoy = useMemo(() => new Date(), []);
  const hace30 = useMemo(() => new Date(hoy.getTime() - 29 * 86_400_000), [hoy]);
  const [desde, setDesde] = useState(fechaInput(hace30));
  const [hasta, setHasta] = useState(fechaInput(hoy));
  const [qAudit, setQAudit] = useState("");
  const [entidad, setEntidad] = useState("");

  const reporteQuery = useQuery({
    queryKey: ["admin", "reportes", desde, hasta],
    queryFn: () => obtenerReportesAdmin(new Date(`${desde}T00:00:00`).toISOString(), new Date(`${hasta}T23:59:59`).toISOString()),
  });
  const auditoriaQuery = useQuery({
    queryKey: ["admin", "auditoria", qAudit, entidad],
    queryFn: () => obtenerAuditoriaAdmin({ q: qAudit, entidad, limit: 40 }),
  });

  const reporte = reporteQuery.data;
  const maxActividad = Math.max(1, ...(reporte?.actividad_diaria.map((item) => item.total) ?? [1]));

  function exportarCsv() {
    if (!reporte) return;
    const filas: Array<Array<string | number>> = [
      ["Métrica", "Valor"],
      ...Object.entries(reporte.metricas).map(([clave, valor]) => [clave, valor]),
      [],
      ["Fecha", "Eventos"],
      ...reporte.actividad_diaria.map((item) => [item.fecha, item.total]),
      [],
      ["Senda", "Temas", "Publicados"],
      ...reporte.temas_por_senda.map((item) => [item.nombre, item.total, item.publicados]),
    ];
    const csv = filas.map((fila) => fila.map((valor) => `"${String(valor ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `semillas-reporte-${desde}-${hasta}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="admin-extra-page">
      <header className="admin-extra-hero">
        <div className="admin-extra-hero__icon"><Activity aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <p className="admin-extra-eyebrow">Analítica y trazabilidad</p>
          <h1>Reportes</h1>
          <p>Consulta métricas reales de adopción, aprendizaje, contenido y administración. Los cálculos provienen del backend.</p>
        </div>
        <button type="button" className="admin-extra-primary" onClick={exportarCsv} disabled={!reporte}>
          <Download size={18} /> Exportar CSV
        </button>
      </header>

      <div className="admin-extra-toolbar admin-extra-panel">
        <label className="admin-form-field"><span>Desde</span><input type="date" value={desde} max={hasta} onChange={(event) => setDesde(event.target.value)} /></label>
        <label className="admin-form-field"><span>Hasta</span><input type="date" value={hasta} min={desde} max={fechaInput(hoy)} onChange={(event) => setHasta(event.target.value)} /></label>
        <p className="ml-auto text-sm text-slate-500">Los eventos offline aparecen cuando son sincronizados y validados por el servidor.</p>
      </div>

      {reporteQuery.isLoading ? <div className="admin-extra-panel"><Loading label="Calculando reportes..." /></div> : null}
      {reporteQuery.isError ? <div className="admin-extra-panel"><ErrorState onRetry={() => void reporteQuery.refetch()} /></div> : null}

      {reporte ? (
        <>
          <div className="admin-extra-metrics">
            <Metric label="Usuarios activos" value={reporte.metricas.usuarios_activos} detail={`de ${reporte.metricas.usuarios}`} icon={<Users />} />
            <Metric label="Temas publicados" value={reporte.metricas.temas_publicados} detail={`de ${reporte.metricas.temas}`} icon={<BookOpen />} />
            <Metric label="XP otorgada" value={reporte.metricas.xp_otorgada_periodo} detail="libro mayor" icon={<Flame />} />
            <Metric label="Progreso promedio" value={`${Math.round(reporte.metricas.progreso_promedio)}%`} detail={`${reporte.metricas.temas_completados} completados`} icon={<Target />} />
          </div>

          <div className="admin-report-grid">
            <article className="admin-extra-panel">
              <div className="admin-extra-panel__header"><div><h2>Actividad diaria</h2><p>Eventos de progreso recibidos y validados.</p></div></div>
              <div className="px-6 pb-6">
                {reporte.actividad_diaria.length ? (
                  <div className="admin-chart" aria-label="Gráfico de eventos diarios">
                    {reporte.actividad_diaria.map((item) => (
                      <div key={item.fecha} className="admin-chart__bar" title={`${item.fecha}: ${item.total}`}>
                        <strong>{item.total}</strong>
                        <i style={{ height: `${Math.max(4, (item.total / maxActividad) * 100)}%` }} />
                        <span>{new Date(`${item.fecha}T00:00:00`).toLocaleDateString("es-EC", { day: "2-digit", month: "short" })}</span>
                      </div>
                    ))}
                  </div>
                ) : <div className="admin-extra-empty"><Activity size={32} /><h3>Sin eventos en el periodo</h3></div>}
              </div>
            </article>

            <article className="admin-extra-panel">
              <div className="admin-extra-panel__header"><div><h2>Contenido por Senda</h2><p>Cobertura editorial actual.</p></div></div>
              <div className="admin-detail-list px-6 pb-5">
                {reporte.temas_por_senda.map((item) => (
                  <div key={item.nombre}>
                    <span><strong>{item.nombre}</strong><br />{item.publicados} publicados</span>
                    <strong>{item.total} temas</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </>
      ) : null}

      <article className="admin-extra-panel">
        <div className="admin-extra-panel__header">
          <div><p className="admin-extra-eyebrow">Seguridad operativa</p><h2>Auditoría administrativa</h2><p>Registro de cambios críticos realizados en contenido y administración.</p></div>
          <ShieldCheck size={28} className="text-violet-600" aria-hidden="true" />
        </div>
        <div className="admin-extra-toolbar">
          <label className="admin-extra-search"><Search size={18} /><input value={qAudit} onChange={(event) => setQAudit(event.target.value)} placeholder="Buscar acción o entidad" /></label>
          <select value={entidad} onChange={(event) => setEntidad(event.target.value)} aria-label="Filtrar auditoría por entidad">
            <option value="">Todas las entidades</option>
            <option value="tema">Temas</option>
            <option value="actividad">Actividades</option>
            <option value="club">Clubes</option>
            <option value="usuario">Usuarios</option>
            <option value="configuracion">Configuración</option>
          </select>
        </div>
        {auditoriaQuery.isLoading ? <Loading label="Cargando auditoría..." /> : null}
        {auditoriaQuery.isError ? <ErrorState onRetry={() => void auditoriaQuery.refetch()} /> : null}
        <div>
          {(auditoriaQuery.data?.items ?? []).map((item) => (
            <div key={item.id} className="admin-audit-row">
              <strong>{item.accion}</strong>
              <span>{item.tipo_entidad}{item.entidad_id ? ` · ${item.entidad_id.slice(0, 8)}` : ""}</span>
              <span>{item.actor}</span>
              <span>{new Date(item.creado_en).toLocaleString("es-EC")}</span>
            </div>
          ))}
          {!auditoriaQuery.isLoading && (auditoriaQuery.data?.items.length ?? 0) === 0 ? <div className="admin-extra-empty"><h3>Sin registros</h3><p>No hay acciones que coincidan con los filtros.</p></div> : null}
        </div>
      </article>
    </section>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: number | string; detail: string; icon: ReactNode }) {
  return <article className="admin-extra-metric"><span>{icon}</span><div><strong>{value}</strong><p>{label} · {detail}</p></div></article>;
}
function Loading({ label }: { label: string }) { return <div className="admin-extra-loading"><LoaderCircle className="animate-spin" /><span>{label}</span></div>; }
function ErrorState({ onRetry }: { onRetry: () => void }) { return <div className="admin-extra-empty"><h3>No se pudo cargar la información</h3><button className="admin-extra-primary" type="button" onClick={onRetry}>Reintentar</button></div>; }
