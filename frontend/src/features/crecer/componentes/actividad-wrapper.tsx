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
import { ActividadAudio } from "../../../componentes/actividades/ActividadAudio";
import { AventuraDecisiones } from "../../../componentes/actividades/AventuraDecisiones";
import { ArrastrarSoltar } from "../../../componentes/actividades/ArrastrarSoltar";
import { CompletarVersiculo } from "../../../componentes/actividades/CompletarVersiculo";
import { ActividadVideo } from "../../../componentes/actividades/ActividadVideo";
import { ActividadCancion } from "../../../componentes/actividades/ActividadCancion";

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

interface InnerActividadProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void;
}

function InnerActividad({ actividad, onComplete }: InnerActividadProps) {
  const { tipo_actividad } = actividad;

  if (tipo_actividad?.codigo === "actividad_audio") {
    return (
      <ActividadAudio
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "aventura_decisiones") {
    return (
      <AventuraDecisiones
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "arrastrar_soltar") {
    return (
      <ArrastrarSoltar
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "completar_versiculo") {
    return (
      <CompletarVersiculo
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "video" || tipo_actividad?.codigo === "actividad_video") {
    return (
      <ActividadVideo
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "cancion") {
    return (
      <ActividadCancion
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (actividad.opciones.length > 0) {
    return <OpcionMultipleServidor actividad={actividad} />;
  }

  if (tipo_actividad?.codigo === "cuestionario") {
    return (
      <QuizActividad
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "verdadero_falso") {
    return (
      <VerdaderoFalsoActividad
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "relacionar_pares") {
    return (
      <RelacionarParesActividad
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "manualidad") {
    return (
      <ManualidadActividad
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "tarjetas_memoria") {
    return (
      <Flashcards
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "sopa_letras") {
    return (
      <SopaLetrasActividad
        actividad={actividad as any}
        onComplete={(actId, xp) => onComplete(actId, xp)}
      />
    );
  }

  if (tipo_actividad?.codigo === "rompecabezas") {
    const config = actividad.configuracion || {};
    const imgUrl = (config.imagen as string) || "/src/assets/images/Ilustraciones/Tema1.png";
    return (
      <Rompecabezas
        imagen={imgUrl}
        filas={(config.filas as number) || 3}
        columnas={(config.columnas as number) || 3}
        retroalimentacion={actividad.retroalimentacion ?? undefined}
        onComplete={() => onComplete(actividad.id, actividad.xp_recompensa || 0)}
      />
    );
  }

  return (
    <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 w-full max-w-4xl mx-auto my-8">
      <h3 className="text-yellow-800 font-bold mb-2 text-xl">Actividad no soportada o código incorrecto</h3>
      <p className="text-yellow-700 mb-4">
        El código de esta actividad es: <strong className="bg-yellow-200 px-2 py-1 rounded">{tipo_actividad?.codigo}</strong>
      </p>
      
      <div className="w-full bg-slate-900 text-emerald-400 p-6 rounded-3xl text-left text-sm font-mono overflow-x-auto shadow-inner border-[6px] border-slate-800">
        <div className="flex items-center gap-2 text-slate-400 mb-4 border-b border-slate-700 pb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          <span>Estructura JSON (Cópiala para integrarla)</span>
        </div>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(actividad, null, 2)}
        </pre>
      </div>
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

const METADATA_ACTIVIDADES: Record<string, { badge: string; bg: string; label: string }> = {
  actividad_audio: {
    badge: "text-emerald-700",
    bg: "bg-emerald-100",
    label: "Audio",
  },
  aventura_decisiones: {
    badge: "text-rose-700",
    bg: "bg-rose-100",
    label: "Aventura",
  },
  arrastrar_soltar: {
    badge: "text-blue-700",
    bg: "bg-blue-100",
    label: "Arrastrar",
  },
  completar_versiculo: {
    badge: "text-violet-700",
    bg: "bg-violet-100",
    label: "Versículo",
  },
  actividad_video: {
    badge: "text-red-700",
    bg: "bg-red-100",
    label: "Video",
  },
  cancion: {
    badge: "text-amber-700",
    bg: "bg-amber-100",
    label: "Canción",
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

  return <InnerActividad actividad={actividad} onComplete={onComplete} />;
}

interface ActividadWrapperProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void;
}

export function ActividadWrapper({ actividad, onComplete }: ActividadWrapperProps) {
  const codigo = actividad.tipo_actividad?.codigo ?? "";
  const meta = METADATA_ACTIVIDADES[codigo] || {
    badge: "text-emerald-700",
    bg: "bg-emerald-100",
    label: actividad.tipo_actividad?.nombre ?? "Actividad",
  };

  return (
    <ActividadCard
      actividad={actividad}
      badgeColor={meta.badge}
      badgeBgColor={meta.bg}
      tipoLabel={meta.label}
      onComplete={onComplete}
    />
  );
}
