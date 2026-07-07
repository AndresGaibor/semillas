import * as React from "react";
import { Book, Download, Flame } from "lucide-react";
import { unirClases } from "@/lib/utilidades";
import { Card } from "./card-base";

export interface PropiedadesCardMetrica {
  titulo: string;
  valor: string | number;
  subtexto: string;
  tipo: "xp" | "racha" | "lecciones" | "offline";
  clase?: string;
}

export const CardMetrica: React.FC<PropiedadesCardMetrica> = ({
  titulo,
  valor,
  subtexto,
  tipo,
  clase,
}) => {
  const configs = {
    xp: {
      gradiente: "linear-gradient(135deg, #2E9E5B, #16A34A)",
      textoIcono: "XP",
      icono: null,
      subColor: "text-[#2E9E5B]",
    },
    racha: {
      gradiente: "linear-gradient(135deg, #6C3AED, #5B30C8)",
      textoIcono: "",
      icono: <Flame className="size-5 text-white fill-white" />,
      subColor: "text-[#6C3AED]",
    },
    lecciones: {
      gradiente: "linear-gradient(135deg, #F4B740, #D97706)",
      textoIcono: "",
      icono: <Book className="size-5 text-white" />,
      subColor: "text-[#D97706]",
    },
    offline: {
      gradiente: "linear-gradient(135deg, #3D8BD4, #2563EB)",
      textoIcono: "",
      icono: <Download className="size-5 text-white" />,
      subColor: "text-[#3D8BD4]",
    },
  };

  const config = configs[tipo] || configs.xp;

  return (
    <Card sombra="sm" clase={unirClases("p-4 flex items-center gap-4 bg-white w-full", clase)}>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-extrabold text-sm shadow-inner"
        style={{ background: config.gradiente }}
      >
        {config.textoIcono || config.icono}
      </div>

      <div className="text-left">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block leading-none mb-1">
          {titulo}
        </span>
        <h3 className="text-lg font-black text-slate-800 leading-none">{valor}</h3>
        <p className={unirClases("text-[10px] font-bold mt-1", config.subColor)}>{subtexto}</p>
      </div>
    </Card>
  );
};
