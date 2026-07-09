import { DonutChart, LeyendaDonut } from "@/componentes/ui/donut-chart";
import { Boton } from "@/componentes/ui/boton";
import { Card } from "@/componentes/ui/card-base";

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
      {/* Summary Card */}
      <Card sombra="sm" className="p-6 flex flex-col text-left">
        <h3 className="font-extrabold text-slate-800 text-sm">Resumen de usuarios</h3>
        <span className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider select-none">
          Total usuarios
        </span>
        <div className="text-5xl font-black text-[#6c3aed] mt-4 mb-5 select-none">{stats.total}</div>

        <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600">
          <FilaResumen
            icono={<i className="fa-solid fa-circle-check text-[10px]" />}
            fondoIcono="bg-[#eefcf4] text-[#2e9e5b]"
            label="Activos"
            valor={stats.activos}
            porcentaje={stats.actPct}
          />
          <FilaResumen
            icono={<i className="fa-solid fa-clock text-[10px]" />}
            fondoIcono="bg-[#fff8eb] text-[#ea580c]"
            label="Invitados/Pendientes"
            valor={stats.pendientes}
            porcentaje={stats.pendPct}
          />
          <FilaResumen
            icono={<i className="fa-solid fa-user-group text-[9px]" />}
            fondoIcono="bg-purple-100 text-[#6c3aed]"
            label="Padres vinculados"
            valor={stats.padres}
            porcentaje={stats.padresPct}
          />
          <FilaResumen
            icono={<i className="fa-solid fa-shield-halved text-[9px]" />}
            fondoIcono="bg-blue-100 text-blue-600"
            label="Administradores"
            valor={stats.administradores}
            porcentaje={stats.adminPct}
          />
        </div>

        <Boton variante="secundario" tamano="pequeno" forma="cuadrado" className="mt-5 w-full justify-between px-4 py-3 text-xs">
          <span>Ver reporte completo</span>
          <i className="fa-solid fa-chevron-right text-[9px]" />
        </Boton>
      </Card>

      {/* Donut Chart Card */}
      <Card sombra="sm" className="p-6 flex flex-col text-left">
        <h3 className="font-extrabold text-slate-800 text-sm">Distribución por rol</h3>

        <DonutChart sectores={sectoresDonut} etiquetaTotal="Usuarios" className="mt-4 mb-5" />
        <LeyendaDonut sectores={leyendaDonut} />

        <Boton variante="secundario" tamano="pequeno" forma="cuadrado" className="mt-5 w-full justify-between px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user-group text-[10px]" />
            <span>Ver detalles por rol</span>
          </div>
          <i className="fa-solid fa-chevron-right text-[9px]" />
        </Boton>
      </Card>
    </div>
  );
}

function FilaResumen({
  icono,
  fondoIcono,
  label,
  valor,
  porcentaje,
}: {
  icono: React.ReactNode;
  fondoIcono: string;
  label: string;
  valor: number;
  porcentaje: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${fondoIcono}`}
        >
          {icono}
        </div>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-slate-800">{valor}</span>
        <span className="text-slate-400 text-[10px]">{porcentaje}%</span>
      </div>
    </div>
  );
}
