import type { Actividad } from "@/shared/api/api";
import { QuizActividad } from "@/componentes/actividades/QuizActividad";
import { VerdaderoFalsoActividad } from "@/componentes/actividades/VerdaderoFalsoActividad";
import { RelacionarParesActividad } from "@/componentes/actividades/RelacionarParesActividad";
import { ManualidadActividad } from "@/componentes/actividades/ManualidadActividad";
import { Flashcards } from "@/componentes/actividades/Flashcards";
import { SopaLetrasActividad } from "@/componentes/actividades/SopaLetrasActividad";
import { Rompecabezas } from "@/componentes/actividades/Rompecabezas";
import { ActividadAudio } from "@/componentes/actividades/ActividadAudio";
import { AventuraDecisiones } from "@/componentes/actividades/AventuraDecisiones";
import { ArrastrarSoltar } from "@/componentes/actividades/ArrastrarSoltar";
import { CompletarVersiculo } from "@/componentes/actividades/CompletarVersiculo";
import { ActividadVideo } from "@/componentes/actividades/ActividadVideo";
import { ActividadCancion } from "@/componentes/actividades/ActividadCancion";
import { OpcionMultipleServidor } from "./opcion-multiple-servidor";

interface ActividadWrapperProps {
  actividad: Actividad;
  onComplete: (actividadId: string, xp?: number) => void | Promise<void>;
}

export function ActividadWrapper({ actividad, onComplete }: ActividadWrapperProps) {
  return (
    <article className="crecer-activity-card">
      <header className="crecer-activity-card__header">
        <span className="crecer-activity-card__badge">
          {actividad.tipo_actividad?.nombre ?? "Actividad"}
        </span>
        <h2>{actividad.titulo}</h2>
        {actividad.consigna ? <p>{actividad.consigna}</p> : null}
      </header>

      <ContenidoActividad actividad={actividad} onComplete={onComplete} />
    </article>
  );
}

function ContenidoActividad({ actividad, onComplete }: ActividadWrapperProps) {
  const codigo = actividad.tipo_actividad?.codigo ?? "";
  const complete = (actividadId: string, xp?: number) => {
    void onComplete(actividadId, xp);
  };

  if (actividad.opciones.length > 0) {
    return <OpcionMultipleServidor actividad={actividad} onComplete={onComplete} />;
  }

  switch (codigo) {
    case "actividad_audio":
      return <ActividadAudio actividad={actividad as any} onComplete={complete} />;
    case "aventura_decisiones":
      return <AventuraDecisiones actividad={actividad as any} onComplete={complete} />;
    case "arrastrar_soltar":
      return <ArrastrarSoltar actividad={actividad as any} onComplete={complete} />;
    case "completar_versiculo":
      return <CompletarVersiculo actividad={actividad as any} onComplete={complete} />;
    case "video":
    case "actividad_video":
      return <ActividadVideo actividad={actividad as any} onComplete={complete} />;
    case "cancion":
      return <ActividadCancion actividad={actividad as any} onComplete={complete} />;
    case "cuestionario":
      return <QuizActividad actividad={actividad as any} onComplete={complete} />;
    case "verdadero_falso":
      return <VerdaderoFalsoActividad actividad={actividad as any} onComplete={complete} />;
    case "relacionar_pares":
      return <RelacionarParesActividad actividad={actividad as any} onComplete={complete} />;
    case "manualidad":
      return <ManualidadActividad actividad={actividad as any} onComplete={complete} />;
    case "tarjetas_memoria":
      return <Flashcards actividad={actividad as any} onComplete={complete} />;
    case "sopa_letras":
      return <SopaLetrasActividad actividad={actividad as any} onComplete={complete} />;
    case "rompecabezas": {
      const config = actividad.configuracion || {};
      const imgUrl = (config.imagen as string) || "/src/assets/images/Ilustraciones/Tema1.png";
      return (
        <Rompecabezas
          imagen={imgUrl}
          filas={(config.filas as number) || 3}
          columnas={(config.columnas as number) || 3}
          retroalimentacion={actividad.retroalimentacion ?? undefined}
          onComplete={() => complete(actividad.id, actividad.xp_recompensa || 0)}
        />
      );
    }
    default:
      return (
        <div className="crecer-focus__empty" role="status">
          Esta actividad todavía no tiene un reproductor disponible.
        </div>
      );
  }
}
