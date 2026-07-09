import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { enviarEventosProgreso } from "../features/progress/progress.api";
import type { EventoProgreso } from "../shared/api/api";
import { CrecerLayout, PreguntaItem, OpcionesRespuesta } from "../features/crecer/componentes";
import imagenFase from "../assets/images/Ilustraciones/Conectar.png";

export const Route = createFileRoute("/app/C_conectar/$themeId")({
  component: CConectarPage
});

const FASE_CONFIG = {
  numero: 1,
  nombre: "Conectar",
  imagenSrc: imagenFase,
  colorAccent: '#16a34a',
  colorLoader: '#16a34a',
};

function CConectarPage() {
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

  const pasoActual = stepsQuery.data?.find((p) => p.tipo_paso?.codigo === 'conectar');
  const contenidoPaso = pasoActual?.contenidos?.[0];
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
    if (!isLoading && !isError && temaDbId && !eventSentRef.current) {
      eventSentRef.current = true;
      const evento: EventoProgreso = {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "tema_iniciado",
        tema_id: temaDbId,
        ocurrido_en_cliente: new Date().toISOString()
      };
      eventMutation.mutate([evento]);
    }
  }, [isLoading, isError, temaDbId, eventMutation]);

  const botonesAccion = {
    siguiente: { to: "/app/R_relatar/$themeId", themeId, label: "Siguiente Fase" },
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
            {actividad.tipo_actividad?.codigo === 'cuestionario' && actividad.opciones && (
              <OpcionesRespuesta opciones={actividad.opciones} colorHover="#16a34a" />
            )}
          </PreguntaItem>
        ))
      ) : null}
    </CrecerLayout>
  );
}
