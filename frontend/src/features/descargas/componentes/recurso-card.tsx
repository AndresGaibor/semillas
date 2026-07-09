import * as React from "react";
import { Download, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";

export interface RecursoCardProps {
  id: string;
  titulo: string;
  tipo: "Historia" | "Actividad" | "Imprimible" | "Canción";
  edad: string;
  sizeMB: number;
  descripcion: string;
  imagen: string;
  isDownloaded: boolean;
  progress?: number; // progress percentage if downloading
  onDownload: () => void;
  onDelete: () => void;
}

export const RecursoCard: React.FC<RecursoCardProps> = ({
  id,
  titulo,
  tipo,
  edad,
  sizeMB,
  descripcion,
  imagen,
  isDownloaded,
  progress,
  onDownload,
  onDelete,
}) => {
  const isDownloading = progress !== undefined;

  // Etiqueta de tipo color
  let tagBg = "bg-purple-50 text-purple-700 border-purple-100";
  if (tipo === "Actividad") tagBg = "bg-blue-50 text-blue-700 border-blue-100";
  else if (tipo === "Imprimible") tagBg = "bg-pink-50 text-pink-700 border-pink-100";
  else if (tipo === "Canción") tagBg = "bg-indigo-50 text-indigo-700 border-indigo-100";

  return (
    <Card
      className="p-4 flex flex-row items-center gap-4 bg-white border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow relative"
    >
      {/* Imagen Portada */}
      <div className="w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm relative">
        <img
          src={imagen}
          alt={titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido / Info */}
      <div className="flex-1 flex flex-col justify-center text-left min-w-0 pr-12">
        <h3 className="text-base font-black text-slate-800 leading-tight mb-1 truncate">
          {titulo}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${tagBg}`}>
            {tipo}
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            Para {edad} años • {sizeMB} MB
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed truncate-2-lines">
          {descripcion}
        </p>
      </div>

      {/* Botón de Acción (Flotante a la Derecha) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {isDownloading ? (
          <div className="w-11 h-11 bg-slate-50 border border-slate-200 rounded-full flex flex-col items-center justify-center relative">
            <Loader2 size={20} className="text-[#7E57C2] animate-spin" />
            <span className="text-[8px] font-bold text-[#7E57C2] mt-0.5">{progress}%</span>
          </div>
        ) : isDownloaded ? (
          <button
            onClick={onDelete}
            className="w-11 h-11 border-0 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-sm"
            title="Eliminar descarga"
          >
            <Trash2 size={18} />
          </button>
        ) : (
          <button
            onClick={onDownload}
            className="w-11 h-11 border border-slate-200 hover:border-[#7E57C2] bg-white text-[#7E57C2] hover:bg-[#EDE7F6] rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-sm"
            title="Descargar"
          >
            <Download size={18} />
          </button>
        )}
      </div>
    </Card>
  );
};
