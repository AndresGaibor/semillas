import { AdminWidgetCard } from "./admin-widget-card";
import { StatRow } from "./stat-row";
import { DonutChart, LeyendaDonut } from "@/componentes/ui/donut-chart";
import { Boton } from "@/componentes/ui/boton";

export type UserStats = {
  total: number;
  activos: number;
  bloqueados: number;
  pendientes: number;
  ninos: number;
  adolescentes: number;
  padres: number;
  moderadores: number;
  administradores: number;
  actPct: number;
  pendPct: number;
  blockPct: number;
  ninosPct: number;
  adolPct: number;
  padresPct: number;
  modPct: number;
  adminPct: number;
};

export type AdminUsersSummaryProps = {
  stats: UserStats;
};

const COLORES_ROL = {
  ninos: "#8b5cf6",
  adolescentes: "#0ea5e9",
  padres: "#f97316",
  moderadores: "#2563eb",
  administradores: "#10b981",
};

export function AdminUsersSummary({ stats }: AdminUsersSummaryProps) {
  const sectoresDonut = [
    { label: "Niños", valor: stats.ninos, color: COLORES_ROL.ninos },
    { label: "Adolescentes", valor: stats.adolescentes, color: COLORES_ROL.adolescentes },
    { label: "Padres/Madres", valor: stats.padres, color: COLORES_ROL.padres },
    { label: "Moderadores", valor: stats.moderadores, color: COLORES_ROL.moderadores },
    { label: "Administradores", valor: stats.administradores, color: COLORES_ROL.administradores },
  ];

  const leyendaDonut = sectoresDonut.map((s) => ({
    ...s,
    porcentaje:
      s.label === "Niños"
        ? stats.ninosPct
        : s.label === "Adolescentes"
          ? stats.adolPct
          : s.label === "Padres/Madres"
            ? stats.padresPct
            : s.label === "Moderadores"
              ? stats.modPct
              : stats.adminPct,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminWidgetCard title="Resumen de usuarios" subtitle="Total usuarios">
        <div className="text-5xl font-black text-violet-600 mt-4 mb-5 select-none">{stats.total}</div>
        <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600">
          <StatRow
            icon={<i className="fa-solid fa-circle-check text-[10px]" />}
            iconBg="bg-green-50 text-green-600"
            label="Activos"
            value={stats.activos}
            percentage={stats.actPct}
          />
          <StatRow
            icon={<i className="fa-solid fa-clock text-[10px]" />}
            iconBg="bg-orange-50 text-orange-600"
            label="Invitados/Pendientes"
            value={stats.pendientes}
            percentage={stats.pendPct}
          />
          <StatRow
            icon={<i className="fa-solid fa-user-group text-[9px]" />}
            iconBg="bg-purple-100 text-purple-600"
            label="Padres vinculados"
            value={stats.padres}
            percentage={stats.padresPct}
          />
          <StatRow
            icon={<i className="fa-solid fa-shield-halved text-[9px]" />}
            iconBg="bg-blue-100 text-blue-600"
            label="Administradores"
            value={stats.administradores}
            percentage={stats.adminPct}
          />
        </div>
        <Boton
          variante="secundario"
          tamano="pequeno"
          forma="cuadrado"
          className="mt-5 w-full justify-between px-4 py-3 text-xs"
        >
          <span>Ver reporte completo</span>
          <i className="fa-solid fa-chevron-right text-[9px]" />
        </Boton>
      </AdminWidgetCard>

      <AdminWidgetCard title="Distribución por rol">
        <DonutChart sectores={sectoresDonut} etiquetaTotal="Usuarios" className="mt-4 mb-5" />
        <LeyendaDonut sectores={leyendaDonut} />
        <Boton
          variante="secundario"
          tamano="pequeno"
          forma="cuadrado"
          className="mt-5 w-full justify-between px-4 py-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user-group text-[10px]" />
            <span>Ver detalles por rol</span>
          </div>
          <i className="fa-solid fa-chevron-right text-[9px]" />
        </Boton>
      </AdminWidgetCard>
    </div>
  );
}
