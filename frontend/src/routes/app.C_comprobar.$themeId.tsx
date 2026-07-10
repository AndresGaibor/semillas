import { createFileRoute } from "@tanstack/react-router";
import { CrecerLayout } from "../features/crecer/componentes";
import { ActividadWrapper } from "../features/crecer/componentes/actividad-wrapper";
import imagenFase from "../assets/images/Ilustraciones/Comprobar.png";
import { useComprobarPage } from "../features/crecer/hooks/use-comprobar-page";

export const Route = createFileRoute("/app/C_comprobar/$themeId")({
  component: CComprobarPage
});

const FASE_CONFIG = {
  numero: 4,
  nombre: "Comprobar",
  imagenSrc: imagenFase,
  colorAccent: '#7c3aed',
  colorLoader: '#7c3aed',
};

function CComprobarPage() {
  const { themeId } = Route.useParams();
  const {
    activitiesQuery,
    contenidoPaso,
    isLoading,
    isError,
    botonesAccion,
    handleSelectOption,
  } = useComprobarPage({ themeId });

  return (
    <CrecerLayout
      fase={FASE_CONFIG}
      paso={contenidoPaso ?? null}
      isLoading={isLoading}
      isError={isError}
      botonesAccion={botonesAccion}
    >
      {activitiesQuery.data && activitiesQuery.data.length > 0 ? (
        <div className="w-full flex flex-col gap-12 mt-8">
          {activitiesQuery.data.map((actividad) => (
            <ActividadWrapper
              key={actividad.id}
              actividad={actividad}
              onComplete={(actId: string, xp?: number) => handleSelectOption(actId, 'completado', true, xp)}
            />
          ))}
        </div>
      ) : null}
    </CrecerLayout>
  );
}
