import { AdminWidgetCard } from "./admin-widget-card";
import { StatRow } from "./stat-row";

export type ActivitySummaryStats = {
  total: number;
  publicadas: number;
  revision: number;
  borradores: number;
  archivadas: number;
  pubPct: number;
  revPct: number;
  borPct: number;
  arcPct: number;
};

export type AdminActivitiesSummaryProps = {
  stats: ActivitySummaryStats;
};

export function AdminActivitiesSummary({ stats }: AdminActivitiesSummaryProps) {
  return (
    <AdminWidgetCard title="Resumen de actividades" subtitle="Total de actividades">
      <div className="text-5xl font-black text-violet-600 mt-4 mb-5 select-none">{stats.total}</div>
      <div className="flex flex-col gap-4 text-xs font-semibold text-emerald-200/70">
        <StatRow
          icon={<i className="fa-solid fa-check text-[10px]" />}
          iconBg="bg-emerald-900/30 text-emerald-400"
          label="Publicadas"
          value={stats.publicadas}
          percentage={stats.pubPct}
        />
        <StatRow
          icon={<i className="fa-solid fa-clock text-[10px]" />}
          iconBg="bg-orange-900/30 text-orange-400"
          label="En revisión"
          value={stats.revision}
          percentage={stats.revPct}
        />
        <StatRow
          icon={<i className="fa-solid fa-pencil text-[9px]" />}
          iconBg="bg-[#1a3a2a] text-emerald-300/60"
          label="Borradores"
          value={stats.borradores}
          percentage={stats.borPct}
        />
        <StatRow
          icon={<i className="fa-solid fa-archive text-[10px]" />}
          iconBg="bg-violet-900/30 text-violet-400"
          label="Archivadas"
          value={stats.archivadas}
          percentage={stats.arcPct}
        />
      </div>
    </AdminWidgetCard>
  );
}
