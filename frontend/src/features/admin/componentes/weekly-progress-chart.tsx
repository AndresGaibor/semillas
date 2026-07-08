import { useState } from "react";

type BarData = {
  dia: string;
  valor: number;
};

type WeeklyProgressChartProps = {
  datos: BarData[];
  onPeriodoChange?: (periodo: string) => void;
};

export function WeeklyProgressChart({ datos, onPeriodoChange }: WeeklyProgressChartProps) {
  const [periodo, setPeriodo] = useState("esta_semana");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPeriodo(val);
    onPeriodoChange?.(val);
  };

  // Find max value to normalize heights
  const maxValor = Math.max(...datos.map((d) => d.valor), 1);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[17px] font-black text-neutro-oscuro-max">Progreso semanal</h3>
          <p className="text-xs text-neutro mt-0.5">Contenido publicado por semana</p>
        </div>
        <select
          value={periodo}
          onChange={handleSelect}
          className="rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primario"
        >
          <option value="esta_semana">Esta semana</option>
          <option value="mes_pasado">Mes pasado</option>
        </select>
      </div>

      {/* Bar Chart Container */}
      <div className="flex items-end justify-between h-[180px] pt-6 px-2 border-b border-slate-100 select-none">
        {datos.map((d, idx) => {
          // Normalize height to a percentage (max 80% to leave room for the value labels)
          const percentageHeight = Math.round((d.valor / maxValor) * 80);
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group">
              {/* Value Label */}
              <span className="text-[10px] font-bold text-neutro-oscuro-max mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                {d.valor}
              </span>
              {/* Bar */}
              <div
                className="w-4 sm:w-6 bg-primario rounded-t-lg transition-all duration-500 ease-out hover:bg-primario-oscuro cursor-pointer"
                style={{ height: `${percentageHeight}%` }}
              />
              {/* Label */}
              <span className="text-[10px] font-bold text-neutro mt-2 leading-none uppercase">
                {d.dia}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
