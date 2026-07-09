import { BookOpen, CheckCircle, Flame } from "lucide-react";
import type { ReactNode } from "react";

export interface ResumenTemasCardProps {
  totales: number;
  completados: number;
  enProgreso: number;
}

interface MetricaResumen {
  titulo: string;
  valor: number;
  icono: ReactNode;
  fondoIcono: string;
  textoIcono: string;
}

function ItemResumen({ titulo, valor, icono, fondoIcono, textoIcono }: MetricaResumen) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 px-3 text-center sm:px-4">
      <div
        className="flex size-12 items-center justify-center rounded-full shadow-inner sm:size-14"
        style={{ background: fondoIcono }}
      >
        <span className={textoIcono}>{icono}</span>
      </div>
      <strong className="text-[1.65rem] font-black leading-none text-slate-900 sm:text-[1.85rem]">
        {valor}
      </strong>
      <span className="text-[0.72rem] font-extrabold leading-tight text-slate-500 sm:text-[0.8rem]">
        {titulo}
      </span>
    </div>
  );
}

export function ResumenTemasCard({
  totales,
  completados,
  enProgreso,
}: ResumenTemasCardProps) {
  const metricas: MetricaResumen[] = [
    {
      titulo: "Temas totales",
      valor: totales,
      icono: <BookOpen className="size-6" strokeWidth={2.4} />,
      fondoIcono: "#efe3ff",
      textoIcono: "text-violet-600",
    },
    {
      titulo: "Completados",
      valor: completados,
      icono: <CheckCircle className="size-6" strokeWidth={2.4} />,
      fondoIcono: "#ddf8e7",
      textoIcono: "text-green-700",
    },
    {
      titulo: "En progreso",
      valor: enProgreso,
      icono: <Flame className="size-6" strokeWidth={2.4} />,
      fondoIcono: "#eaf2ff",
      textoIcono: "text-blue-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="m-0 w-full text-left text-[1.05rem] font-extrabold leading-none tracking-[-0.01em] text-slate-800 sm:text-[1.12rem]">
          Resumen de temas
        </h3>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {metricas.map((metrica) => (
          <ItemResumen key={metrica.titulo} {...metrica} />
        ))}
      </div>
    </div>
  );
}
