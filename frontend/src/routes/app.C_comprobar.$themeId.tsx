import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
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

  const profileQuery = useQuery({ queryKey: ["myProfile"], queryFn: obtenerMiPerfil });
  const ageGroupsQuery = useQuery({ queryKey: ["ageGroups"], queryFn: obtenerGruposEdad });

  const activeAgeGroupId = profileQuery.data?.perfil?.grupo_edad_id;
  const activeAgeGroup = ageGroupsQuery.data?.find(g => g.id === activeAgeGroupId);

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

      {/* Temporal: Listar todas las actividades del tema (independiente del paso) para validación */}
      {activitiesQuery.data && activitiesQuery.data.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6 animate-in fade-in zoom-in-95">
          <div className="mb-4 pb-2 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">
              Actividades disponibles en este tema:
            </h3>
            {profileQuery.data && (
              <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full border border-green-200">
                👤 {profileQuery.data.perfil?.apodo} | Franja: {activeAgeGroup?.nombre || "No seleccionada"}
              </div>
            )}
          </div>
          <ul className="space-y-3">
            {activitiesQuery.data.map((act) => {
              const actAgeGroup = ageGroupsQuery.data?.find(g => g.id === act.grupo_edad_id);
              return (
                <li key={act.id} className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 font-bold text-sm">
                      {act.tipo_actividad?.nombre?.charAt(0) || '?'}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{act.titulo}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium whitespace-nowrap">
                          Para: {actAgeGroup?.nombre || "Desconocida"}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 uppercase tracking-wide">
                        {act.tipo_actividad?.nombre || 'Desconocido'}
                      </span>
                    </div>
                  </div>
                
                {/* Visualización en crudo de la configuración (JSON) */}
                <div className="mt-2 bg-slate-800 text-slate-200 rounded-lg p-4 text-xs font-mono overflow-x-auto">
                  <p className="text-slate-400 mb-2 border-b border-slate-700 pb-1">Datos crudos de la BD (act.configuracion):</p>
                  <pre>
                    {JSON.stringify(act.configuracion, null, 2)}
                  </pre>
                </div>
              </li>
              );
            })}
          </ul>
        </div>
      )}

    </CrecerLayout>
  );
}
