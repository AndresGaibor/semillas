import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { Loader } from "lucide-react";
import imagenFase from "../assets/images/Ilustraciones/Experimentar.png";
import { enviarEventosProgreso } from "../features/progress/progress.api";
import type { EventoProgreso } from "../shared/api/api";
import { playSound } from "../lib/audio";

export const Route = createFileRoute("/app/E_experimentar/$themeId")({
  component: EExperimentarPage
});

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

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-16 animate-in fade-in duration-500">
      
      <div className="w-full px-4 sm:px-8 pt-6 pb-10 flex flex-col gap-6 relative z-10">
        
        {/* Imagen Superior (Card 1) */}
        <div className="w-full h-[200px] sm:h-[280px] rounded-[2.5rem] overflow-hidden relative shadow-lg shadow-slate-200/50">
          <img 
            src={imagenFase} 
            alt="Fase Experimentar" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
             <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Experimentar</span>
          </div>
        </div>

        {/* Contenedor condicional para Loading/Error/Contenido */}
        {isLoading ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-[#f43f5e]">
            <Loader className="animate-spin size-12" />
            <p className="font-bold animate-pulse text-xl">Cargando fase Experimentar...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-red-500">
            <p className="font-bold text-xl">Ocurrió un error al cargar la fase.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col w-full">
            
            <div className="flex justify-start items-center mb-6">
                <span className="bg-slate-100 text-slate-600 font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wider">
                  Fase 5
                </span>
            </div>

            <div className="flex-1 flex flex-col w-full gap-6">
              
              {contenidoPaso && (
                <div className="mb-4">
                  {contenidoPaso.titulo && <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{contenidoPaso.titulo}</h2>}
                  {contenidoPaso.cuerpo && <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{contenidoPaso.cuerpo}</div>}
                </div>
              )}

              {preguntasReflexion.length > 0 && (
                <div className="mt-4 flex flex-col gap-6">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-slate-800">Preguntas de Reflexión</h3>
                    <p className="text-slate-500 mt-1">
                      Tómate tu tiempo. Estas preguntas son para ti, para que las reflexiones personalmente en casa durante la semana.
                    </p>
                  </div>
                  {preguntasReflexion.map((pregunta, index) => (
                    <div key={pregunta.id} className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 shadow-sm relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>
                      <p className="text-lg text-slate-700 font-medium ml-2">{pregunta.pregunta}</p>
                    </div>
                  ))}
                </div>
              )}

              {actividadesFase.length > 0 ? (
                actividadesFase.map((actividad: any) => (
                  <div key={actividad.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm mt-4">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{actividad.titulo}</h3>
                    {actividad.consigna && (
                      <p className="text-slate-600 mb-4">{actividad.consigna}</p>
                    )}
                    
                    {actividad.tipo_actividad?.codigo === 'cuestionario' && actividad.opciones && (
                      <div className="flex flex-col gap-3 mt-4">
                        {actividad.opciones.map((opcion: any) => (
                          <div key={opcion.id} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#f43f5e] hover:bg-rose-50/30 cursor-pointer transition-all">
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                              {opcion.etiqueta}
                            </span>
                            <span className="text-slate-700 font-medium">{opcion.texto}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                !contenidoPaso && preguntasReflexion.length === 0 && (
                  <div className="flex-1 flex flex-col justify-center items-center opacity-50 h-full py-12">
                    <p className="text-lg text-slate-400 font-medium text-center">No hay contenido, preguntas ni actividades disponibles para esta fase.</p>
                  </div>
                )
              )}
            </div>

            {/* Botones de Acción */}
            <div className="w-full mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Link
                to="/app/R_recompensar/$themeId"
                params={{ themeId }}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
                style={{ backgroundColor: '#f43f5e', color: '#ffffff', boxShadow: '0 20px 25px -5px rgba(244, 63, 94, 0.3), 0 8px 10px -6px rgba(244, 63, 94, 0.1)' }}
                onClick={() => playSound('siguiente')}
              >
                Siguiente Fase
              </Link>
              <Link
                to="/app/C_comprobar/$themeId"
                params={{ themeId }}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-bold text-lg text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Regresar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
