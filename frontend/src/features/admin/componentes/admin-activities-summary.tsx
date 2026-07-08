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
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
      <h3 className="font-extrabold text-slate-800 text-sm">Resumen de actividades</h3>
      <span className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider select-none">Total de actividades</span>
      <div className="text-5xl font-black text-[#6c3aed] mt-4 mb-5 select-none">{stats.total}</div>
      <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-check text-[10px]" />
            </div>
            <span>Publicadas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">{stats.publicadas}</span>
            <span className="text-slate-400 text-[10px]">{stats.pubPct}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#fff8eb] text-[#ea580c] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-clock text-[10px]" />
            </div>
            <span>En revisión</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">{stats.revision}</span>
            <span className="text-slate-400 text-[10px]">{stats.revPct}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-pencil text-[9px]" />
            </div>
            <span>Borradores</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">{stats.borradores}</span>
            <span className="text-slate-400 text-[10px]">{stats.borPct}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#6c3aed]/10 text-[#6c3aed] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-archive text-[10px]" />
            </div>
            <span>Archivadas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">{stats.archivadas}</span>
            <span className="text-slate-400 text-[10px]">{stats.arcPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
