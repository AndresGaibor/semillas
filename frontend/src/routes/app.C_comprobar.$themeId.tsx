import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { Loader } from "lucide-react";
import imagenFase from "../assets/images/Ilustraciones/Comprobar.png";
import { enviarEventosProgreso } from "../features/progress/progress.api";
import type { EventoProgreso } from "../shared/api/api";

export const Route = createFileRoute("/app/C_comprobar/$themeId")({
  component: CComprobarPage
});

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
    // Si ya respondió, no permitimos cambiar (opcional)
    if (selectedAnswers[actividadId]) return;
    setSelectedAnswers(prev => ({ ...prev, [actividadId]: opcionId }));

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

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-16 animate-in fade-in duration-500">
      
      <div className="w-full px-4 sm:px-8 pt-6 pb-10 flex flex-col gap-6 relative z-10">
        
        {/* Imagen Superior (Card 1) */}
        <div className="w-full h-[200px] sm:h-[280px] rounded-[2.5rem] overflow-hidden relative shadow-lg shadow-slate-200/50">
          <img 
            src={imagenFase} 
            alt="Fase Comprobar" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
             <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Comprobar</span>
          </div>
        </div>

        {/* Contenedor condicional para Loading/Error/Contenido */}
        {isLoading ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-[#7c3aed]">
            <Loader className="animate-spin size-12" />
            <p className="font-bold animate-pulse text-xl">Cargando fase Comprobar...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-red-500">
            <p className="font-bold text-xl">Ocurrió un error al cargar la fase.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col w-full">
            
            <div className="flex justify-start items-center mb-6">
                <span className="bg-slate-100 text-slate-600 font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wider">
                  Fase 4
                </span>
            </div>

            <div className="flex-1 flex flex-col w-full gap-6">
              
              {contenidoPaso && (
                <div className="mb-4">
                  {contenidoPaso.titulo && <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{contenidoPaso.titulo}</h2>}
                  {contenidoPaso.cuerpo && <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{contenidoPaso.cuerpo}</div>}
                </div>
              )}

              {actividadesFase.length > 0 ? (
                actividadesFase.map((actividad: any) => (
                  <div key={actividad.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{actividad.titulo}</h3>
                    {actividad.consigna && (
                      <p className="text-slate-600 mb-4">{actividad.consigna}</p>
                    )}
                    
                    {actividad.tipo_actividad?.codigo === 'cuestionario' && actividad.opciones && (
                      <div className="flex flex-col gap-3 mt-4">
                        {actividad.opciones.map((opcion: any) => {
                          const isSelected = selectedAnswers[actividad.id] === opcion.id;
                          const hasAnswered = !!selectedAnswers[actividad.id];
                          const isCorrect = opcion.correcta; // El backend envía "correcta" en lugar de "es_correcta"

                          let optionClass = "bg-white border-slate-200 hover:border-[#7c3aed] hover:bg-purple-50/30 cursor-pointer";
                          if (hasAnswered) {
                            if (isSelected) {
                              optionClass = isCorrect ? "bg-green-100 border-green-500 ring-2 ring-green-500/20" : "bg-red-100 border-red-500 ring-2 ring-red-500/20";
                            } else if (isCorrect) {
                              // If they clicked wrong, highlight the correct one clearly
                              optionClass = "bg-green-100 border-green-500 ring-2 ring-green-500/50";
                            } else {
                              optionClass = "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed";
                            }
                          }

                          return (
                            <div 
                              key={opcion.id} 
                              onClick={() => handleSelectOption(actividad.id, opcion.id, isCorrect, actividad.xp_recompensa)}
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${optionClass}`}
                            >
                              <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${hasAnswered && (isSelected || isCorrect) ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-slate-100 text-slate-600'}`}>
                                {opcion.etiqueta}
                              </span>
                              <span className={`font-medium ${hasAnswered && (isSelected || isCorrect) ? (isCorrect ? 'text-green-800' : 'text-red-800') : 'text-slate-700'}`}>{opcion.texto}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                !contenidoPaso && (
                  <div className="flex-1 flex flex-col justify-center items-center opacity-50 h-full py-12">
                    <p className="text-lg text-slate-400 font-medium text-center">No hay contenido ni actividades disponibles para esta fase.</p>
                  </div>
                )
              )}
            </div>

            {/* Botones de Acción */}
            <div className="w-full mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Link
                to="/app/E_experimentar/$themeId"
                params={{ themeId }}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
                style={{ backgroundColor: '#7c3aed', color: '#ffffff', boxShadow: '0 20px 25px -5px rgba(124, 58, 237, 0.3), 0 8px 10px -6px rgba(124, 58, 237, 0.1)' }}
              >
                Siguiente Fase
              </Link>
              <Link
                to="/app/E_ensenar/$themeId"
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
