import { createFileRoute } from "@tanstack/react-router";
import { CrecerLayout, PreguntaItem, OpcionesRespuesta } from "../features/crecer/componentes";
import imagenFase from "../assets/images/Ilustraciones/Conectar.png";
import { useCrecerFase } from "../features/crecer/hooks/use-crecer-fase";

export const Route = createFileRoute("/app/C_conectar/$themeId")({
  component: CConectarPage,
});

const FASE_CONFIG = {
  numero: 1,
  nombre: "Conectar",
  imagenSrc: imagenFase,
  colorAccent: "#16a34a",
  colorLoader: "#16a34a",
};

function CConectarPage() {
  const { themeId } = Route.useParams();
  const { contenidoPaso, actividadesFase, isLoading, isError, navigateTo, guardarProgresoFase } = useCrecerFase({
    themeId,
    pasoCodigo: "conectar",
  });

  const botonesAccion = {
    siguiente: { to: "/app/R_relatar/$themeId", themeId, label: "Siguiente Fase", onClick: guardarProgresoFase },
    regresar: { to: "/app/temas/$themeId", themeId },
  };

  return (
    <CrecerLayout
      fase={FASE_CONFIG}
      paso={contenidoPaso ?? null}
      isLoading={isLoading}
      isError={isError}
      botonesAccion={botonesAccion}
    >
      {actividadesFase.length > 0 ? (
        actividadesFase.map((actividad) => (
          <PreguntaItem key={actividad.id} actividad={actividad}>
            {actividad.tipo_actividad?.codigo === "cuestionario" && actividad.opciones && (
              <OpcionesRespuesta opciones={actividad.opciones} colorHover="#16a34a" />
            )}
          </PreguntaItem>
        ))
      ) : null}
    </CrecerLayout>
  );
}
