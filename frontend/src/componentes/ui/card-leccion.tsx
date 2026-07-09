import { Star, Cloud, List } from "lucide-react";
import { unirClases } from "@/lib/utilidades";
import { Card } from "./card-base";
import { IlustracionCard } from "./ilustraciones-card";
import { obtenerClasesSenda } from "@/features/themes/utils";

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
  const { esPadre, esHijo, esEspiritu, texto: claseSenda, relleno: claseRellenoBarra } = obtenerClasesSenda(senda);

  return (
    <Card
      sombra="sm"
      hoverEffect={esBloqueada ? "none" : "elevate"}
      clase={unirClases("w-full max-w-[290px] overflow-hidden flex flex-col bg-white border border-slate-100 rounded-3xl", clase)}
      style={{ opacity: esBloqueada ? 0.75 : 1 }}
      onClick={!esBloqueada && !esError ? onAccion : undefined}
    >
      <div className="relative w-full h-[160px] bg-slate-50 overflow-hidden flex-shrink-0">
        <IlustracionCard
          esError={esError}
          esBloqueada={esBloqueada}
          esSendaPadre={esPadre}
          esSendaHijo={esHijo}
          esSendaEspiritu={esEspiritu}
          imagenUrl={imagenUrl}
          titulo={titulo}
        />

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
                favorito ? "text-amber-400 fill-amber-400" : "text-slate-300",
              )}
            />
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 text-left justify-between">
        <div className="flex flex-col gap-1.5">
          <span className={unirClases("text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5", claseSenda)}>
            <List className="size-3.5" />
            {senda}
          </span>

          <h3 className="text-[15px] font-black text-slate-800 leading-tight">
            {titulo}
          </h3>

          <p className="text-[11px] font-semibold text-slate-400 leading-normal line-clamp-2 h-[34px]">
            {descripcion}
          </p>
        </div>

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
            <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold py-1 justify-center rounded-lg bg-blue-50 border border-blue-500/20">
              <Cloud className="size-3.5 fill-blue-500" />
              <span>Disponible sin conexión</span>
            </div>
          )}

          {esError ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-red-50 text-red-500 border border-red-200">
              Error
            </span>
          ) : esBloqueada ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-400">
              Bloqueado
            </span>
          ) : estado === "completada" ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-600">
              Completado
            </span>
          ) : estado === "enProgreso" ? (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-600">
              En progreso
            </span>
          ) : (
            <span className="self-center px-5 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500">
              No iniciado
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
