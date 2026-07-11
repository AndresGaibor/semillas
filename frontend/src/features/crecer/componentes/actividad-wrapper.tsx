import type { ReactNode } from "react";
import type { Actividad } from "../../../shared/api/api";
import { QuizActividad } from "../../../componentes/actividades/QuizActividad";
import { VerdaderoFalsoActividad } from "../../../componentes/actividades/VerdaderoFalsoActividad";
import { RelacionarParesActividad } from "../../../componentes/actividades/RelacionarParesActividad";
import { ManualidadActividad } from "../../../componentes/actividades/ManualidadActividad";
import { Flashcards } from "../../../componentes/actividades/Flashcards";
import { SopaLetrasActividad } from "../../../componentes/actividades/SopaLetrasActividad";
import { Rompecabezas } from "../../../componentes/actividades/Rompecabezas";
import { OpcionMultipleServidor } from "./opcion-multiple-servidor";
import { obtenerColoresActividad } from "./actividad-colores";

interface ActividadCardProps {
  actividad: Actividad;
  badgeColor: string;
  badgeBgColor: string;
  tipoLabel: string;
  onComplete: (actividadId: string, xp?: number) => void;
}

function ActividadCard({
  actividad,
  badgeColor,
  badgeBgColor,
  tipoLabel,
  onComplete,
}: ActividadCardProps) {
  return (
    <div className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
      <div className="mb-6 flex flex-col items-center">
        <div className="w-full text-left mb-2">
          <span
            className={`${badgeBgColor} ${badgeColor} px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest`}
          >
            {tipoLabel}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-700 text-center">
          {actividad.titulo}
        </h2>
        <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
      </div>
      <ContenidoActividad actividad={actividad} onComplete={onComplete} />
    </div>
  );
}

function SinModoJuego({ nombre }: { nombre: string }) {
  return (
    <div className="w-full bg-slate-100 p-8 rounded-3xl border border-slate-200 text-center opacity-70">
      <span className="text-4xl mb-4 block">🚧</span>
      <h3 className="text-xl font-bold text-slate-700">
        Modo de juego en construcción
      </h3>
      <p className="text-slate-500 mt-2">Próximamente: {nombre}</p>
    </div>
  );
}

type RendererActividad = (
  actividad: Actividad,
  onComplete: (actividadId: string, xp?: number) => void,
) => ReactNode;

const REGENERADORES: Record<string, RendererActividad> = {
  cuestionario: (act, onComplete) => (
    <QuizActividad actividad={act as any} onComplete={onComplete} />
  ),
  verdadero_falso: (act, onComplete) => (
    <VerdaderoFalsoActividad actividad={act as any} onComplete={onComplete} />
  ),
  relacionar_pares: (act, onComplete) => (
    <RelacionarParesActividad actividad={act as any} onComplete={onComplete} />
  ),
  manualidad: (act, onComplete) => (
    <ManualidadActividad actividad={act as any} onComplete={onComplete} />
  ),
  tarjetas_memoria: (act, onComplete) => (
    <Flashcards actividad={act as any} onComplete={onComplete} />
  ),
  sopa_letras: (act, onComplete) => (
    <SopaLetrasActividad actividad={act as any} onComplete={onComplete} />
  ),
  rompecabezas: (act, onComplete) => {
    const config = act.configuracion || {};
    const imgUrl = (config.imagen as string) || "/src/assets/images/Ilustraciones/Tema1.png";
    return (
      <Rompecabezas
        imagen={imgUrl}
        filas={(config.filas as number) || 3}
        columnas={(config.columnas as number) || 3}
        retroalimentacion={act.retroalimentacion ?? undefined}
        onComplete={() => onComplete(act.id, act.xp_recompensa || 0)}
      />
    );
  },
};

interface ContenidoActividadProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void;
}

function ContenidoActividad({ actividad, onComplete }: ContenidoActividadProps) {
  if (actividad.opciones.length > 0) {
    return <OpcionMultipleServidor actividad={actividad} />;
  }

  const codigo = actividad.tipo_actividad?.codigo ?? "";
  const regenerador = REGENERADORES[codigo];

  if (regenerador) {
    return <>{regenerador(actividad, onComplete)}</>;
  }

  return <SinModoJuego nombre={actividad.tipo_actividad?.nombre ?? "Desconocida"} />;
}

interface ActividadWrapperProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void;
}

export function ActividadWrapper({ actividad, onComplete }: ActividadWrapperProps) {
  const colores = obtenerColoresActividad(actividad);

  return (
    <ActividadCard
      actividad={actividad}
      badgeColor={colores.badge}
      badgeBgColor={colores.bg}
      tipoLabel={colores.label}
      onComplete={onComplete}
    />
  );
}
