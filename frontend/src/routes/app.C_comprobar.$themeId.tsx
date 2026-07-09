import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { enviarEventosProgreso } from "../features/progress/progress.api";
import type { EventoProgreso } from "../shared/api/api";
import { playSound } from "../lib/audio";
import { CrecerLayout, PreguntaItem, OpcionesConFeedback } from "../features/crecer/componentes";
import { Flashcards } from "../componentes/actividades/Flashcards";
import imagenFase from "../assets/images/Ilustraciones/Comprobar.png";

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

  const pasoActual = stepsQuery.data?.find((p) => p.tipo_paso?.codigo === 'comprobar');
  const contenidoPaso = pasoActual?.contenidos?.[0];
  const actividadesFase = activitiesQuery.data?.filter((a) => a.paso_id === pasoActual?.id) || [];

  const isLoading = themeQuery.isLoading || (!!temaDbId && (stepsQuery.isLoading || activitiesQuery.isLoading));
  const isError = themeQuery.isError || stepsQuery.isError || activitiesQuery.isError;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();
  const eventMutation = useMutation({
    mutationFn: enviarEventosProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  });

  const eventSentRef = useRef(false);
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

  const handleSelectOption = (actividadId: string, opcionId: string, esCorrecta: boolean, xpRecompensa?: number) => {
    if (selectedAnswers[actividadId]) return;
    setSelectedAnswers(prev => ({ ...prev, [actividadId]: opcionId }));
    playSound(esCorrecta ? 'acertado' : 'error');

    if (temaDbId) {
      const evento: EventoProgreso = {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "actividad_respondida",
        tema_id: temaDbId,
        actividad_id: actividadId,
        correcta: esCorrecta,
        puntaje: esCorrecta ? 100 : 0,
        xp_otorgada: esCorrecta && xpRecompensa ? xpRecompensa : 0,
        ocurrido_en_cliente: new Date().toISOString()
      };
      eventMutation.mutate([evento]);
    }
  };

  const botonesAccion = {
    siguiente: { to: "/app/E_experimentar/$themeId", themeId, label: "Siguiente Fase" },
    regresar: { to: "/app/E_ensenar/$themeId", themeId },
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
              <OpcionesConFeedback
                opciones={actividad.opciones}
                actividadId={actividad.id}
                selectedAnswers={selectedAnswers}
                onSelectOption={handleSelectOption}
                xpRecompensa={actividad.xp_recompensa}
              />
            )}
            {actividad.tipo_actividad?.codigo === 'tarjetas_memoria' && (
              <Flashcards
                actividad={actividad}
                onComplete={(actId, xp) => handleSelectOption(actId, 'repaso_completado', true, xp)}
              />
            )}
          </PreguntaItem>
        ))
      ) : null}
    </CrecerLayout>
  );
}
