import { ArrowRight, Clock, Cloud, List, Sparkles, Star } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Card } from "./card-base";
import { Chip, type ColorDisenoKey } from "./chip";
import { IlustracionCard } from "./ilustraciones-card";
import { unirClases } from "@/lib/utilidades";
import { obtenerClasesSenda } from "@/features/themes/utils";

export type ThemeCardVariant = "default" | "compact";

export type ThemeCardState =
  | "porDefecto"
  | "enProgreso"
  | "completada"
  | "descargada"
  | "bloqueada"
  | "error";

export interface ThemeCardProps {
  titulo: string;
  descripcion: string;
  senda: string;
  duracion?: string;
  xp?: number;
  progreso?: number;
  favorito?: boolean;
  imagenUrl?: string;
  estado?: ThemeCardState;
  variante?: ThemeCardVariant;
  mostrarSendaBadge?: boolean;
  onFavorito?: () => void;
  onAccion?: () => void;
  clase?: string;
}

export function ThemeCard({
  estado = "porDefecto",
  variante = "default",
  senda,
  titulo,
  descripcion,
  duracion,
  xp,
  progreso = 0,
  favorito = false,
  imagenUrl,
  onFavorito,
  onAccion,
  mostrarSendaBadge = true,
  clase,
}: ThemeCardProps) {
  const esBloqueada = estado === "bloqueada";
  const esError = estado === "error";
  const esCompacta = variante === "compact";
  const { esPadre, esHijo, esEspiritu, texto: claseSenda, relleno: claseRellenoBarra } = obtenerClasesSenda(senda);
  const esInteractiva = Boolean(onAccion) && !esBloqueada && !esError;
  const colorSenda: ColorDisenoKey = esPadre ? "amarillo" : esHijo ? "azul" : esEspiritu ? "verde" : "gris";

  const contenedorTecla = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (!esInteractiva) return;

    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      onAccion?.();
    }
  };

  const estadoEtiqueta =
    estado === "completada"
      ? "Completado"
      : estado === "enProgreso"
        ? "Continuar"
        : estado === "bloqueada"
          ? "Bloqueado"
          : estado === "error"
            ? "Error"
            : "Empezar tema";

  return (
    <Card
      sombra="sm"
      hoverEffect={esInteractiva ? "elevate" : "none"}
      clase={unirClases(
        "group flex w-full flex-col overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition-all duration-200",
        esInteractiva && "cursor-pointer",
        esBloqueada && "opacity-75",
        clase,
      )}
      style={{ opacity: esBloqueada ? 0.75 : 1 }}
      onClick={esInteractiva ? onAccion : undefined}
      onKeyDown={contenedorTecla}
      role={esInteractiva ? "button" : undefined}
      tabIndex={esInteractiva ? 0 : undefined}
    >
      <div className={unirClases("relative w-full flex-shrink-0 overflow-hidden bg-slate-50", esCompacta ? "h-[152px]" : "h-[176px]")}>
        <IlustracionCard
          esError={esError}
          esBloqueada={esBloqueada}
          esSendaPadre={esPadre}
          esSendaHijo={esHijo}
          esSendaEspiritu={esEspiritu}
          imagenUrl={imagenUrl}
          titulo={titulo}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-70" />

        {mostrarSendaBadge && !esError && (
          <div className="absolute left-3 top-3 z-10">
            <Chip color={colorSenda} forma="badgePildora" clase="!px-2.5 !py-1 text-[10px] shadow-sm">
              {senda}
            </Chip>
          </div>
        )}

        {!esError && !esBloqueada && onFavorito && (
          <button
            type="button"
            onClick={(evento) => {
              evento.stopPropagation();
              onFavorito();
            }}
            className="absolute right-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/92 shadow-lg backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
            aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-pressed={favorito}
          >
            <Star
              className={unirClases(
                "size-4 transition-colors",
                favorito ? "fill-amber-400 text-amber-400" : "text-slate-300",
              )}
            />
          </button>
        )}
      </div>

      <div className={unirClases("flex flex-1 flex-col justify-between text-left", esCompacta ? "p-4 sm:p-[18px]" : "p-4 sm:p-5")}>
        <div className={unirClases("flex flex-col", esCompacta ? "gap-2" : "gap-2.5")}>
          <span
            className={unirClases(
              "inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]",
              claseSenda,
            )}
          >
            <List className="size-3.5" />
            {senda}
          </span>

          <h3
            className={unirClases(
              "line-clamp-2 font-black tracking-[-0.035em] text-slate-900",
              esCompacta ? "text-[1.35rem] leading-[1.1]" : "text-[1.55rem] leading-[1.08] md:text-[1.65rem]",
            )}
          >
            {titulo}
          </h3>

          <p className={unirClases("line-clamp-2 font-semibold leading-relaxed text-slate-500", esCompacta ? "min-h-[32px] text-[12px]" : "min-h-[38px] text-[13px]")}>
            {descripcion}
          </p>

          {(duracion || xp) && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-black text-slate-500">
              {duracion && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1">
                  <Clock className="size-3.5" />
                  {duracion}
                </span>
              )}
              {xp && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                  <Sparkles className="size-3.5" />
                  {xp} XP
                </span>
              )}
            </div>
          )}
        </div>

        <div className={unirClases("mt-5 flex flex-col gap-3", esCompacta && "mt-4")}>
          {!esError && !esBloqueada && (
            <div className="flex w-full items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={unirClases("h-full rounded-full transition-all duration-300", claseRellenoBarra)}
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <span className="min-w-[30px] text-right text-xs font-black text-slate-700">
                {progreso}%
              </span>
            </div>
          )}

          {estado === "descargada" && (
            <div className="flex items-center justify-center gap-1 rounded-lg border border-blue-500/20 bg-blue-50 py-1 text-[10px] font-bold text-blue-500">
              <Cloud className="size-3.5 fill-blue-500" />
              <span>Disponible sin conexión</span>
            </div>
          )}

          {esError ? (
            <span className="self-center rounded-full border border-red-200 bg-red-50 px-5 py-1.5 text-[10px] font-black text-red-500">
              Error
            </span>
          ) : esBloqueada ? (
            <span className="self-center rounded-full bg-slate-100 px-5 py-1.5 text-[10px] font-black text-slate-400">
              Bloqueado
            </span>
          ) : estado === "completada" ? (
            <span className="self-center rounded-full bg-purple-100 px-5 py-1.5 text-[10px] font-black text-purple-600">
              Completado
            </span>
          ) : (
            <span
              className={unirClases(
                "inline-flex w-full max-w-[240px] items-center justify-center gap-2 self-center rounded-full px-5 py-3 text-[13px] font-black transition-colors sm:w-auto sm:max-w-none sm:py-2 sm:text-[10px]",
                estado === "enProgreso" ? "bg-sky-100 text-sky-600" : "bg-slate-900 text-white group-hover:bg-primario",
              )}
            >
              {estadoEtiqueta}
              <ArrowRight className="size-3" />
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
