import type { Actividad } from "../../../shared/api/api";
import { QuizActividad } from "../../../componentes/actividades/QuizActividad";
import { VerdaderoFalsoActividad } from "../../../componentes/actividades/VerdaderoFalsoActividad";
import { RelacionarParesActividad } from "../../../componentes/actividades/RelacionarParesActividad";
import { ManualidadActividad } from "../../../componentes/actividades/ManualidadActividad";
import { Flashcards } from "../../../componentes/actividades/Flashcards";
import { SopaLetrasActividad } from "../../../componentes/actividades/SopaLetrasActividad";
import { Rompecabezas } from "../../../componentes/actividades/Rompecabezas";
import { OpcionMultipleServidor } from "./opcion-multiple-servidor";

interface ActividadCardProps {
  actividad: Actividad;
  badgeColor: string;
  badgeBgColor: string;
  tipoLabel: string;
  onComplete: (actividadId: string, xp?: number) => void;
}

export function ActividadCard({
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
      <InnerActividad actividad={actividad} onComplete={onComplete} />
    </div>
  );
}

interface InnerActividadProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void;
}

function InnerActividad({ actividad, onComplete }: InnerActividadProps) {
  const { tipo_actividad } = actividad;

  // Las actividades con opciones se verifican siempre en el backend. Así la
  // respuesta correcta y el XP nunca dependen de datos enviados al navegador.
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
    <div className="w-full bg-slate-100 p-8 rounded-3xl border border-slate-200 text-center opacity-70">
      <span className="text-4xl mb-4 block">🚧</span>
      <h3 className="text-xl font-bold text-slate-700">
        Modo de juego en construcción
      </h3>
      <p className="text-slate-500 mt-2">
        Próximamente: {tipo_actividad?.nombre}
      </p>
    </div>
  );
}

const BADGE_COLORS: Record<
  string,
  { badge: string; bg: string; label: string }
> = {
  cuestionario: {
    badge: "text-violet-700",
    bg: "bg-violet-100",
    label: "Quiz",
  },
  verdadero_falso: {
    badge: "text-blue-700",
    bg: "bg-blue-100",
    label: "Verdadero o Falso",
  },
  relacionar_pares: {
    badge: "text-orange-700",
    bg: "bg-orange-100",
    label: "Relacionar Conceptos",
  },
  manualidad: {
    badge: "text-pink-700",
    bg: "bg-pink-100",
    label: "Manualidad",
  },
  tarjetas_memoria: {
    badge: "text-amber-700",
    bg: "bg-amber-100",
    label: "Flashcards",
  },
  sopa_letras: {
    badge: "text-orange-700",
    bg: "bg-orange-100",
    label: "Sopa de Letras",
  },
  rompecabezas: {
    badge: "text-indigo-700",
    bg: "bg-indigo-100",
    label: "Rompecabezas",
  },
};

interface ActividadWrapperProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void;
}

export function ActividadWrapper({ actividad, onComplete }: ActividadWrapperProps) {
  const tipo = actividad.tipo_actividad?.codigo ?? "";
  const colors = BADGE_COLORS[tipo] ?? {
    badge: "text-slate-700",
    bg: "bg-slate-100",
    label: actividad.tipo_actividad?.nombre ?? "Actividad",
  };

  return (
    <ActividadCard
      actividad={actividad}
      badgeColor={colors.badge}
      badgeBgColor={colors.bg}
      tipoLabel={colors.label}
      onComplete={onComplete}
    />
  );
}
