import { unirClases } from "@/lib/utilidades";

interface Opcion {
  id: string;
  etiqueta?: string | null;
  texto: string;
}

interface OpcionesRespuestaProps {
  opciones: Opcion[];
  colorHover: string;
}

const CLASES_BORDE_HOVER: Record<string, string> = {
  "#2E9E5B": "hover:border-[#2E9E5B]",
  "#E9A23B": "hover:border-[#E9A23B]",
  "#EE6C4D": "hover:border-[#EE6C4D]",
  "#1565C0": "hover:border-[#1565C0]",
  "#8e44ad": "hover:border-[#8e44ad]",
  "#17A398": "hover:border-[#17A398]",
};

export function OpcionesRespuesta({ opciones, colorHover }: OpcionesRespuestaProps) {
  const clasesHover = CLASES_BORDE_HOVER[colorHover] ?? `hover:border-[${colorHover}]`;

  return (
    <div className="flex flex-col gap-3 mt-4">
      {opciones.map((opcion) => (
        <div 
          key={opcion.id} 
          className={unirClases(
            "flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50/30 cursor-pointer transition-all",
            clasesHover
          )}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
            {opcion.etiqueta}
          </span>
          <span className="text-slate-700 font-medium">{opcion.texto}</span>
        </div>
      ))}
    </div>
  );
}
