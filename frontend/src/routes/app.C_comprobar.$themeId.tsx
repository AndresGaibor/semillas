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
import { SopaLetrasActividad } from "../componentes/actividades/SopaLetrasActividad";
import { Rompecabezas } from "../componentes/actividades/Rompecabezas";
import { QuizActividad } from "../componentes/actividades/QuizActividad";
import { VerdaderoFalsoActividad } from "../componentes/actividades/VerdaderoFalsoActividad";
import { RelacionarParesActividad } from "../componentes/actividades/RelacionarParesActividad";
import { ManualidadActividad } from "../componentes/actividades/ManualidadActividad";
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
      {/* Renderizado de actividades funcionales según su tipo */}
      {activitiesQuery.data && activitiesQuery.data.length > 0 ? (
        <div className="w-full flex flex-col gap-12 mt-8">
          {activitiesQuery.data.map((actividad) => {
            
            // Si es un Cuestionario (Quiz)
            if (actividad.tipo_actividad?.codigo === 'cuestionario') {
              return (
                <div key={actividad.id} className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                      <span className="bg-violet-100 text-violet-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">Quiz</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 text-center">{actividad.titulo}</h2>
                    <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
                  </div>
                  
                  <QuizActividad 
                    actividad={actividad} 
                    onComplete={(actId, xp) => handleSelectOption(actId, 'quiz_completado', true, xp)} 
                  />
                </div>
              );
            }

            if (actividad.tipo_actividad?.codigo === 'verdadero_falso') {
              return (
                <div key={actividad.id} className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">Verdadero o Falso</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 text-center">{actividad.titulo}</h2>
                    <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
                  </div>
                  <VerdaderoFalsoActividad 
                    actividad={actividad} 
                    onComplete={(actId, xp) => handleSelectOption(actId, 'vf_completado', true, xp)} 
                  />
                </div>
              );
            }

            // Aquí podemos agregar más 'ifs' para Flashcards, Sopa de Letras, etc.
            if (actividad.tipo_actividad?.codigo === 'relacionar_pares') {
              return (
                <div key={actividad.id} className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                      <span className="bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">Relacionar Conceptos</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 text-center">{actividad.titulo}</h2>
                    <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
                  </div>
                  <RelacionarParesActividad 
                    actividad={actividad} 
                    onComplete={(actId, xp) => handleSelectOption(actId, 'relacionar_completado', true, xp)} 
                  />
                </div>
              );
            }
            // ...
            if (actividad.tipo_actividad?.codigo === 'manualidad') {
              return (
                <div key={actividad.id} className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                      <span className="bg-pink-100 text-pink-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">Manualidad</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 text-center">{actividad.titulo}</h2>
                    <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
                  </div>
                  <ManualidadActividad 
                    actividad={actividad} 
                    onComplete={(actId, xp) => handleSelectOption(actId, 'manualidad_completada', true, xp)} 
                  />
                </div>
              );
            }
            if (actividad.tipo_actividad?.codigo === 'tarjetas_memoria') {
              return (
                <div key={actividad.id} className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                      <span className="bg-amber-100 text-amber-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">Flashcards</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 text-center">{actividad.titulo}</h2>
                    <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
                  </div>
                  <Flashcards 
                    actividad={actividad} 
                    onComplete={(actId, xp) => handleSelectOption(actId, 'flashcards_completado', true, xp)} 
                  />
                </div>
              );
            }
            if (actividad.tipo_actividad?.codigo === 'sopa_letras') {
              return (
                <div key={actividad.id} className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                      <span className="bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">Sopa de Letras</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 text-center">{actividad.titulo}</h2>
                    <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
                  </div>
                  <SopaLetrasActividad 
                    actividad={actividad} 
                    onComplete={(actId, xp) => handleSelectOption(actId, 'sopa_letras_completada', true, xp)} 
                  />
                </div>
              );
            }

            if (actividad.tipo_actividad?.codigo === 'rompecabezas') {
              const config = actividad.configuracion || {};
              // Para evitar errores si la DB no envía imagen, usamos una por defecto de las ilustraciones
              const imgUrl = config.imagen || "/src/assets/images/Ilustraciones/Tema1.png";
              return (
                <div key={actividad.id} className="w-full bg-slate-50/50 p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="w-full text-left mb-2">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">Rompecabezas</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 text-center">{actividad.titulo}</h2>
                    <p className="text-slate-500 mt-2 text-center">{actividad.consigna}</p>
                  </div>
                  <Rompecabezas 
                    imagen={imgUrl}
                    filas={config.filas || 3}
                    columnas={config.columnas || 3}
                    retroalimentacion={actividad.retroalimentacion}
                    xp={actividad.xp_recompensa}
                    onComplete={() => handleSelectOption(actividad.id, 'rompecabezas_completado', true, actividad.xp_recompensa || 0)} 
                  />
                </div>
              );
            }

            // Fallback para las actividades que aún no tienen interfaz
            return (
              <div key={actividad.id} className="w-full bg-slate-100 p-8 rounded-3xl border border-slate-200 text-center opacity-70">
                <span className="text-4xl mb-4 block">🚧</span>
                <h3 className="text-xl font-bold text-slate-700">Modo de juego en construcción</h3>
                <p className="text-slate-500 mt-2">Próximamente: {actividad.tipo_actividad?.nombre}</p>
              </div>
            );
          })}
        </div>
      ) : null}



    </CrecerLayout>
  );
}
