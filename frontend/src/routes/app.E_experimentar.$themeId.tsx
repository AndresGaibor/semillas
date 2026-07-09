import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { enviarEventosProgreso } from "../features/progress/progress.api";
import type { EventoProgreso } from "../shared/api/api";
import { CrecerLayout, PreguntaItem, OpcionesRespuesta, PreguntasReflexion } from "../features/crecer/componentes";
import imagenFase from "../assets/images/Ilustraciones/Experimentar.png";

export const Route = createFileRoute("/app/E_experimentar/$themeId")({
  component: EExperimentarPage
});

const FASE_CONFIG = {
  numero: 5,
  nombre: "Experimentar",
  imagenSrc: imagenFase,
  colorAccent: '#f43f5e',
  colorLoader: '#f43f5e',
};

function EExperimentarPage() {
  const { themeId } = Route.useParams();

  const themeQuery = useQuery({ queryKey: ["theme", themeId], queryFn: () => obtenerTema(themeId) });
  const temaDbId = themeQuery.data?.id;

  const stepsQuery = useQuery({ 
    queryKey: ["theme", temaDbId, "steps"], 
    queryFn: () => obtenerPasos(temaDbId!),
    enabled: !!temaDbId
  });
  
  const activitiesQuery = useQuery({ 
    queryKey: ["theme", temaDbId, "activities"], 
    queryFn: () => obtenerActividades(temaDbId!),
    enabled: !!temaDbId
  });

  const pasoActual = stepsQuery.data?.find((p) => p.tipo_paso?.codigo === 'experimentar');
  const contenidoPaso = pasoActual?.contenidos?.[0];
  const preguntasReflexion = pasoActual?.preguntas || [];
  const actividadesFase = activitiesQuery.data?.filter((a) => a.paso_id === pasoActual?.id) || [];

  const isLoading = themeQuery.isLoading || (!!temaDbId && (stepsQuery.isLoading || activitiesQuery.isLoading));
  const isError = themeQuery.isError || stepsQuery.isError || activitiesQuery.isError;

  const eventSentRef = useRef(false);
  const queryClient = useQueryClient();
  const eventMutation = useMutation({
    mutationFn: enviarEventosProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  });

  useEffect(() => {
    if (!isLoading && !isError && temaDbId && pasoActual?.id && !eventSentRef.current) {
      eventSentRef.current = true;
      const evento: EventoProgreso = {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "bloque_iniciado",
        tema_id: temaDbId,
        paso_id: pasoActual.id,
        ocurrido_en_cliente: new Date().toISOString()
      };
      eventMutation.mutate([evento]);
    }
  }, [isLoading, isError, temaDbId, pasoActual, eventMutation]);

  const botonesAccion = {
    siguiente: { to: "/app/R_recompensar/$themeId", themeId, label: "Siguiente Fase" },
    regresar: { to: "/app/C_comprobar/$themeId", themeId },
  };

  const hasContent = contenidoPaso || preguntasReflexion.length > 0 || actividadesFase.length > 0;

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
