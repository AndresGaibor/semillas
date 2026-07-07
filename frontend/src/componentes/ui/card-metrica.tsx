import * as React from "react";
import { Book, Download, Flame } from "lucide-react";
import { unirClases } from "@/lib/utilidades";
import { Card } from "./card-base";

export interface TonoTarjetaMetrica {
  fondoIcono: string;
  colorSubtexto: string;
}

export interface TarjetaMetricaCompactaProps extends React.HTMLAttributes<HTMLDivElement> {
  titulo: React.ReactNode;
  valor: React.ReactNode;
  subtexto: React.ReactNode;
  icono?: React.ReactNode;
  etiquetaIcono?: React.ReactNode;
  tono?: TonoTarjetaMetrica;
  alineacion?: "izquierda" | "centrada";
  clase?: string;
}

export interface PropiedadesCardMetrica {
  titulo: string;
  valor: string | number;
  subtexto: string;
  tipo: "xp" | "racha" | "lecciones" | "offline";
  clase?: string;
}

export const TarjetaMetricaCompacta: React.FC<TarjetaMetricaCompactaProps> = ({
  titulo,
  valor,
  subtexto,
  icono,
  etiquetaIcono,
  tono,
  alineacion = "izquierda",
  className,
  clase,
  ...propiedades
}) => {
  const esCentrada = alineacion === "centrada";

  return (
    <Card
      sombra="sm"
      clase={unirClases(
        "w-full bg-white",
        esCentrada ? "p-4 sm:p-5" : "p-4 sm:p-5 flex items-center gap-4",
        className,
        clase,
      )}
      {...propiedades}
    >
      <div
        className={unirClases(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white font-extrabold text-sm shadow-inner",
          esCentrada ? "mx-auto" : "flex-shrink-0",
        )}
        style={tono?.fondoIcono ? { background: tono.fondoIcono } : undefined}
      >
        {etiquetaIcono ?? icono}
      </div>

      <div className={unirClases("min-w-0", esCentrada ? "mt-3 text-center" : "text-left")}>
        <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block leading-none mb-1">
          {titulo}
        </span>
        <h3 className="text-xl font-black text-slate-800 leading-none sm:text-lg">{valor}</h3>
        <p className={unirClases("text-[10px] font-bold mt-1", tono?.colorSubtexto ?? "text-slate-400")}>
          {subtexto}
        </p>
      </div>
    </Card>
  );
};

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
      icono: null,
      subColor: "text-[#2E9E5B]",
    },
    racha: {
      gradiente: "linear-gradient(135deg, #6C3AED, #5B30C8)",
      icono: <Flame className="size-5 text-white fill-white" />,
      subColor: "text-[#6C3AED]",
    },
    lecciones: {
      gradiente: "linear-gradient(135deg, #F4B740, #D97706)",
      icono: <Book className="size-5 text-white" />,
      subColor: "text-[#D97706]",
    },
    offline: {
      gradiente: "linear-gradient(135deg, #3D8BD4, #2563EB)",
      icono: <Download className="size-5 text-white" />,
      subColor: "text-[#3D8BD4]",
    },
  };

  const config = configs[tipo] || configs.xp;

  return (
    <TarjetaMetricaCompacta
      titulo={titulo}
      valor={valor}
      subtexto={subtexto}
      icono={config.icono}
      etiquetaIcono={tipo === "xp" ? "XP" : undefined}
      tono={{ fondoIcono: config.gradiente, colorSubtexto: config.subColor }}
      clase={clase}
    />
  );
};
