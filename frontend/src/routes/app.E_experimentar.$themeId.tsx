import { createFileRoute } from "@tanstack/react-router";
import { CrecerLayout, PreguntaItem, OpcionesRespuesta, PreguntasReflexion } from "../features/crecer/componentes";
import imagenFase from "../assets/images/Ilustraciones/Experimentar.png";
import { useExperimentarPage } from "../features/crecer/hooks/use-experimentar-page";

const FASE_CONFIG = {
  numero: 5,
  nombre: "Experimentar",
  imagenSrc: imagenFase,
  colorAccent: '#f43f5e',
  colorLoader: '#f43f5e',
};

export const Route = createFileRoute("/app/E_experimentar/$themeId")({
  component: EExperimentarPage
});

function EExperimentarPage() {
  const { themeId } = Route.useParams();

  const {
    contenidoPaso,
    isLoading,
    isError,
    botonesAccion,
    preguntasReflexion,
    actividadesFase,
  } = useExperimentarPage({ themeId });

  return (
    <CrecerLayout
      fase={FASE_CONFIG}
      paso={contenidoPaso ?? null}
      isLoading={isLoading}
      isError={isError}
      botonesAccion={botonesAccion}
      emptyMessage="No hay contenido, preguntas ni actividades disponibles para esta fase."
    >
      {preguntasReflexion.length > 0 && (
        <PreguntasReflexion preguntas={preguntasReflexion} />
      )}

      {actividadesFase.length > 0 ? (
        actividadesFase.map((actividad) => (
          <PreguntaItem key={actividad.id} actividad={actividad}>
            {actividad.tipo_actividad?.codigo === 'cuestionario' && actividad.opciones && (
              <OpcionesRespuesta opciones={actividad.opciones} colorHover="#f43f5e" />
            )}
          </PreguntaItem>
        ))
      ) : null}
    </CrecerLayout>
  );
}
