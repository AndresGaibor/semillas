import { FilaListaCompacta } from "@/componentes/ui/fila-lista-compacta";

type SummaryCounts = {
  total: number;
  publicados: number;
  revision: number;
  borradores: number;
  archivados: number;
};

type AdminThemesSummaryProps = {
  counts: SummaryCounts;
  onVerReportes?: () => void;
};

export function AdminThemesSummary({ counts, onVerReportes }: AdminThemesSummaryProps) {
  const getPercentage = (val: number) => {
    if (counts.total === 0) return 0;
    return Math.round((val / counts.total) * 100);
  };

  const items = [
    {
      label: "Publicados",
      count: counts.publicados,
      percentage: getPercentage(counts.publicados),
      icon: "fa-circle-check",
      iconColor: "text-[#2E9E5B]",
      iconBg: "bg-[#2E9E5B]/10",
    },
    {
      label: "En revisión",
      count: counts.revision,
      percentage: getPercentage(counts.revision),
      icon: "fa-clock",
      iconColor: "text-[#6C3AED]",
      iconBg: "bg-[#6C3AED]/10",
    },
    {
      label: "Borradores",
      count: counts.borradores,
      percentage: getPercentage(counts.borradores),
      icon: "fa-pen-to-square",
      iconColor: "text-[#F4B740]",
      iconBg: "bg-[#F4B740]/15",
    },
    {
      label: "Archivados",
      count: counts.archivados,
      percentage: getPercentage(counts.archivados),
      icon: "fa-box-archive",
      iconColor: "text-slate-400",
      iconBg: "bg-slate-100",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col text-left select-none">
      <h3 className="text-base md:text-lg font-black text-slate-800 mb-1">Resumen por estado</h3>
      <span className="text-xs text-slate-400 font-bold">Total de temas</span>

      {/* Big Total */}
      <div className="text-5xl font-black text-[#6C3AED] my-4 leading-none">{counts.total}</div>

      {/* Breakdown Rows */}
      <div className="flex flex-col gap-4 mt-2">
        {items.map((item) => (
          <FilaListaCompacta
            key={item.label}
            izquierda={
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                <i className={`fa-solid ${item.icon} text-sm`} />
              </span>
            }
            titulo={item.label}
            derecha={
              <div className="flex items-center gap-4 text-[13px] font-extrabold text-slate-800">
                <span>{item.count}</span>
                <span className="text-slate-400 font-semibold text-[11px] w-8 text-right">{item.percentage}%</span>
              </div>
            }
            className="rounded-none border-0 bg-transparent p-0 pb-3 last:pb-0"
            izquierdaClassName="self-start"
            contenidoClassName="self-center"
            derechaClassName="self-center"
          />
        ))}
      </div>

      {/* Button link */}
      <button
        type="button"
        onClick={onVerReportes}
        className="mt-6 flex items-center justify-between w-full rounded-2xl bg-[#eefcf4] hover:bg-[#e1f9ea] text-[#2E9E5B] py-3 px-4 text-xs font-bold transition-all border border-transparent shadow-xs cursor-pointer"
      >
        <span>Ver reportes de temas</span>
        <i className="fa-solid fa-chevron-right text-[10px]" />
      </button>
    </div>
  );
}
