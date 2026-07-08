import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { Loader } from "lucide-react";
import imagenFase from "../assets/images/Ilustraciones/Recompensa.png";
import { enviarEventosProgreso } from "../features/progress/progress.api";
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

  const [isClaiming, setIsClaiming] = useState(false);
  const eventMutation = useMutation({
    mutationFn: enviarEventosProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      // Opcional: mostrar confeti, sonido, etc.
      navigate({ to: "/app/temas" });
    },
    onSettled: () => setIsClaiming(false)
  });

  const handleReclamarInsignia = () => {
    if (!temaDbId || isClaiming) return;
    
    setIsClaiming(true);
    const evento: EventoProgreso = {
      evento_id_cliente: crypto.randomUUID(),
      tipo_evento: "tema_completado",
      tema_id: temaDbId,
      // Se le puede enviar cuanta xp recompensa da el tema
      xp_otorgada: tema?.xp_recompensa || 0,
      ocurrido_en_cliente: new Date().toISOString()
    };
    eventMutation.mutate([evento]);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-16 animate-in fade-in duration-500">
      
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
                <div className="flex flex-col items-center mb-8">
                  {/* theme.portada_recurso (if available) would go here, we mock it via image src if we had it */}
                  <p className="text-2xl text-slate-700 font-bold">Has completado con éxito el tema:</p>
                  <p className="text-3xl text-[#43a047] font-black mt-2">{tema.titulo}</p>
                </div>
              )}

              {contenidoPaso ? (
                <div className="mb-8 w-full text-left">
                  {contenidoPaso.titulo && <h3 className="text-2xl font-bold text-slate-800 mb-4">{contenidoPaso.titulo}</h3>}
                  {contenidoPaso.cuerpo && <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{contenidoPaso.cuerpo}</div>}
                </div>
              ) : (
                <p className="text-lg text-slate-500 font-medium mb-8">¡Es hora de reclamar tu recompensa por todo el esfuerzo!</p>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="w-full mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4 max-w-md mx-auto">
              <button 
                onClick={handleReclamarInsignia}
                disabled={isClaiming}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-wait"
                style={{ backgroundColor: '#f59e0b', color: '#ffffff', boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.3), 0 8px 10px -6px rgba(245, 158, 11, 0.1)' }}
              >
                {isClaiming ? "Reclamando..." : "Obtener Insignia"}
              </button>

              <Link
                to="/app/temas"
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-bold text-lg text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
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
