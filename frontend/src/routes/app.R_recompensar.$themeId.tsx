import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades, obtenerUrlPortadaTema } from "../features/themes/themes.api";
import { Loader, Cloud } from "lucide-react";
import imagenFase from "../assets/images/Ilustraciones/Recompensa.png";
import { enviarEventosProgreso } from "../features/progress/progress.api";
import { playSound } from "../lib/audio";
import { CSSConfetti } from "../componentes/ui/Confetti";
import type { EventoProgreso } from "../shared/api/api";

export const Route = createFileRoute("/app/R_recompensar/$themeId")({
  component: RRecompensarPage
});

function RRecompensarPage() {
  const { themeId } = Route.useParams();

  // Obtener los datos del tema seleccionado
  const themeQuery = useQuery({ 
    queryKey: ["theme", themeId], 
    queryFn: () => obtenerTema(themeId) 
  });
  const tema = themeQuery.data;
  const temaDbId = tema?.id;

  const portadaQuery = useQuery({
    queryKey: ["theme-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: !!tema?.portada_recurso?.id,
    staleTime: 3 * 60 * 1000,
  });

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

  const pasoActual = stepsQuery.data?.find((p) => p.tipo_paso?.codigo === 'recompensar');
  const contenidoPaso = pasoActual?.contenidos?.[0];
  const actividadesFase = activitiesQuery.data?.filter((a) => a.paso_id === pasoActual?.id) || [];

  const isLoading = themeQuery.isLoading || (!!temaDbId && (stepsQuery.isLoading || activitiesQuery.isLoading));
  const isError = themeQuery.isError || stepsQuery.isError || activitiesQuery.isError;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const eventMutation = useMutation({
    mutationFn: enviarEventosProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  });

  const eventSentRef = useRef(false);

  // Reproducir sonido al entrar a la fase de recompensa y registrar tema completado
  useEffect(() => {
    playSound('insignia');

    if (temaDbId && !eventSentRef.current) {
      eventSentRef.current = true;
      const evento: EventoProgreso = {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "tema_completado",
        tema_id: temaDbId,
        xp_otorgada: tema?.xp_recompensa || 0,
        ocurrido_en_cliente: new Date().toISOString()
      };
      eventMutation.mutate([evento]);
    }
  }, [temaDbId, tema?.xp_recompensa, eventMutation]);

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-16 animate-in fade-in duration-500 relative overflow-hidden">
      
      {/* Confetti */}
      <CSSConfetti />

      {/* Nubes Doradas en el fondo */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <Cloud size={200} className="absolute top-10 -left-40 text-amber-200 animate-[float_15s_linear_infinite]" fill="currentColor" />
        <Cloud size={150} className="absolute top-40 -right-40 text-amber-300 animate-[floatReverse_20s_linear_infinite]" fill="currentColor" />
        <Cloud size={300} className="absolute bottom-10 left-20 text-amber-100 animate-[float_25s_linear_infinite]" fill="currentColor" />
        <Cloud size={120} className="absolute bottom-40 right-10 text-amber-200 animate-[floatReverse_18s_linear_infinite]" fill="currentColor" />
        <style>{`
          @keyframes float {
            0% { transform: translateX(0vw) translateY(0); }
            50% { transform: translateX(120vw) translateY(-20px); }
            100% { transform: translateX(0vw) translateY(0); }
          }
          @keyframes floatReverse {
            0% { transform: translateX(0vw) translateY(0); }
            50% { transform: translateX(-120vw) translateY(20px); }
            100% { transform: translateX(0vw) translateY(0); }
          }
        `}</style>
      </div>

      <div className="w-full px-4 sm:px-8 pt-6 pb-10 flex flex-col gap-6 relative z-10">
        
        {/* Imagen Superior (Card 1) */}
        <div className="w-full h-[200px] sm:h-[280px] rounded-[2.5rem] overflow-hidden relative shadow-lg shadow-slate-200/50">
          <img 
            src={imagenFase} 
            alt="Fase Recompensar" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
             <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Recompensar</span>
          </div>
        </div>

        {/* Contenedor condicional para Loading/Error/Contenido */}
        {isLoading ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-amber-500">
            <Loader className="animate-spin size-12" />
            <p className="font-bold animate-pulse text-xl">Cargando fase Recompensar...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-red-500">
            <p className="font-bold text-xl">Ocurrió un error al cargar la fase.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[400px] flex flex-col items-center w-full">
            
            <div className="flex justify-start items-center w-full mb-8">
                <span className="bg-slate-100 text-slate-600 font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wider">
                  Fase 6
                </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full">
              <h2 className="text-4xl sm:text-5xl font-black text-amber-500 mb-6">¡Felicidades!</h2>
              
              {tema && (
                <div className="flex flex-col items-center mb-8 relative">
                  
                  {/* Resplandor dorado detrás de la imagen */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400 rounded-full blur-[60px] opacity-50 animate-pulse pointer-events-none"></div>

                  {portadaQuery.data?.url ? (
                    <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden mb-6 shadow-[0_0_50px_rgba(245,158,11,0.8)] border-4 border-amber-400 animate-in zoom-in slide-in-from-bottom-8 duration-1000 hover:scale-110 transition-transform relative z-10">
                      <img 
                        src={portadaQuery.data.url} 
                        alt="Insignia del tema" 
                        className="w-full h-full object-cover animate-[spin_15s_linear_infinite] hover:animate-none"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-amber-200 to-amber-100 mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.8)] border-4 border-amber-300 animate-bounce relative z-10">
                      <span className="text-6xl text-amber-500 drop-shadow-lg">🏆</span>
                    </div>
                  )}
                  <p className="text-2xl text-slate-700 font-bold mt-4 z-10 relative">Has completado con éxito el tema:</p>
                  <p className="text-3xl text-[#43a047] font-black mt-2 z-10 relative">{tema.titulo}</p>
                </div>
              )}

              {contenidoPaso ? (
                <div className="mb-8 w-full text-left">
                  {contenidoPaso.titulo && <h3 className="text-2xl font-bold text-slate-800 mb-4">{contenidoPaso.titulo}</h3>}
                  {contenidoPaso.cuerpo && <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{contenidoPaso.cuerpo}</div>}
                </div>
              ) : (
                <p className="text-lg text-slate-500 font-medium mb-8">Un paso a la vez.</p>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="w-full mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4 max-w-md mx-auto relative z-10">
              <Link
                to="/app/temas"
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
                style={{ backgroundColor: '#f59e0b', color: '#ffffff', boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.3), 0 8px 10px -6px rgba(245, 158, 11, 0.1)' }}
              >
                Continuar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
