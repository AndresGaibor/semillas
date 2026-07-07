import * as React from "react";
import { Star, Cloud } from "lucide-react";
import { unirClases } from "@/lib/utilidades";
import { Card } from "./card-base";
import { IlustracionCard } from "./ilustraciones-card";

export interface PropiedadesCardLeccion {
  estado?: "porDefecto" | "enProgreso" | "completada" | "descargada" | "bloqueada" | "error";
  senda: string;
  titulo: string;
  descripcion: string;
  duracion?: string;
  xp?: number;
  progreso?: number;
  favorito?: boolean;
  imagenUrl?: string;
  onFavorito?: () => void;
  onAccion?: () => void;
  clase?: string;
}

export const CardLeccion: React.FC<PropiedadesCardLeccion> = ({
  estado = "porDefecto",
  senda,
  titulo,
  descripcion,
  progreso = 0,
  favorito = false,
  imagenUrl,
  onFavorito,
  onAccion,
  clase,
}) => {
  const esBloqueada = estado === "bloqueada";
  const esError = estado === "error";

  // Determinar color de la senda en base al nombre
  const esSendaPadre = senda.toLowerCase().includes("padre");
  const esSendaHijo = senda.toLowerCase().includes("hijo");
  const esSendaEspiritu = senda.toLowerCase().includes("espíritu") || senda.toLowerCase().includes("espiritu");

  const claseSenda =
    esSendaPadre ? "text-amber-600" :
    esSendaHijo ? "text-blue-600" :
    esSendaEspiritu ? "text-violet-600" : "text-slate-600";

  // Determinar color de relleno de la barra de progreso
  const claseRellenoBarra =
    estado === "completada" ? "bg-emerald-500" :
    esSendaHijo ? "bg-blue-600" :
    esSendaEspiritu ? "bg-violet-600" : "bg-emerald-500";

  return (
    <Card
      sombra="sm"
      hoverEffect={esBloqueada ? "none" : "elevate"}
      clase={unirClases("w-full max-w-[290px] overflow-hidden flex flex-col bg-white border border-slate-100 rounded-3xl", clase)}
      style={{
        opacity: esBloqueada ? 0.75 : 1,
      }}
      onClick={!esBloqueada && !esError ? onAccion : undefined}
    >
      {/* Portada / Imagen */}
      <div className="relative w-full h-[160px] bg-slate-50 overflow-hidden flex-shrink-0">
        <IlustracionCard
            esError={esError}
            esBloqueada={esBloqueada}
            esSendaPadre={esSendaPadre}
            esSendaHijo={esSendaHijo}
            esSendaEspiritu={esSendaEspiritu}
            imagenUrl={imagenUrl}
            titulo={titulo}
          />

        {/* Botón de Favorito Flotante */}
        {!esError && !esBloqueada && onFavorito && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFavorito();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            aria-label="Agregar a favoritos"
          >
            <Star
              className={unirClases(
                "size-4 transition-colors",
                favorito ? "text-[#fbbf24] fill-[#fbbf24]" : "text-slate-300"
              )}
            />
          </button>
        )}
      </div>

      {/* Contenido / Textos */}
      <div className="p-5 flex flex-col flex-1 text-left justify-between">
        <div className="flex flex-col gap-1.5">
          {/* Senda indicator */}
          <span className={unirClases("text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5", claseSenda)}>
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75h12m-12 5.25h12m-12 5.25h12M3 6.75h.008v.008H3V6.75zm0 5.25h.008v.008H3V12zm0 5.25h.008v.008H3v-.008z" />
            </svg>
            {senda}
          </span>

          {/* Título */}
          <h3 className="text-[15px] font-black text-slate-800 leading-tight">
            {titulo}
          </h3>

          {/* Descripción */}
          <p className="text-[11px] text-slate-400 font-semibold leading-normal line-clamp-2 h-[34px]">
            {descripcion}
          </p>
        </div>

        {/* Progreso y Badge de Estado */}
        <div className="flex flex-col gap-3 mt-4">
          {!esError && !esBloqueada && (
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={unirClases("h-full rounded-full transition-all duration-300", claseRellenoBarra)}
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <span className="text-[11px] font-black text-slate-700 min-w-[28px] text-right">
                {progreso}%
              </span>
            </div>
          )}

          {estado === "descargada" && (
            <div className="flex items-center gap-1 text-[10px] text-[#3D8BD4] font-bold py-1 justify-center rounded-lg bg-[#EFF6FF] border border-[#3D8BD4]/20">
              <Cloud className="size-3.5 fill-[#3D8BD4]" />
              <span>Disponible sin conexión</span>
            </div>
          )}

          {/* Badge de estado en la parte inferior */}
          {esError ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-red-50 text-red-500 border border-red-200">
              Error
            </span>
          ) : esBloqueada ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-400">
              Bloqueado
            </span>
          ) : estado === "completada" ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-[#f3e8ff] text-[#9333ea]">
              Completado
            </span>
          ) : estado === "enProgreso" ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-[#e0f2fe] text-[#0284c7]">
              En progreso
            </span>
          ) : (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-[#f3f4f6] text-[#6b7280]">
              No iniciado
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
