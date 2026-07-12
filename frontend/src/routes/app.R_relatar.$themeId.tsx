import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import imagenFase from "../assets/images/Ilustraciones/Relatar.png";
import { playSound } from "../lib/audio";
import { useRelatarPage } from "../features/crecer/hooks/use-relatar-page";

export const Route = createFileRoute("/app/R_relatar/$themeId")({
  component: RRelatarPage
});

function RRelatarPage() {
  const { themeId } = Route.useParams();

  const {
    contenidoPaso,
    actividadesFase,
    isLoading,
    isError,
    guardarProgresoFase
  } = useRelatarPage({ themeId });

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-16 animate-in fade-in duration-500">
      
      <div className="w-full px-4 sm:px-8 pt-6 pb-10 flex flex-col gap-6 relative z-10">
        
        {/* Imagen Superior (Card 1) */}
        <div className="w-full h-[200px] sm:h-[280px] rounded-[2.5rem] overflow-hidden relative shadow-lg shadow-slate-200/50">
          <img 
            src={imagenFase} 
            alt="Fase Relatar" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
             <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Relatar</span>
          </div>
        </div>

        {/* Contenedor condicional para Loading/Error/Contenido */}
        {isLoading ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-[#2563eb]">
            <Loader className="animate-spin size-12" />
            <p className="font-bold animate-pulse text-xl">Cargando fase Relatar...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col gap-4 justify-center items-center h-64 bg-white rounded-[2.5rem] shadow-xl text-red-500">
            <p className="font-bold text-xl">Ocurrió un error al cargar la fase.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col w-full">
            
            <div className="flex justify-start items-center mb-6">
                <span className="bg-slate-100 text-slate-600 font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wider">
                  Fase 2
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
                        {actividad.opciones.map((opcion: any) => (
                          <div key={opcion.id} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#2563eb] hover:bg-blue-50/30 cursor-pointer transition-all">
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
                to="/app/E_ensenar/$themeId"
                params={{ themeId }}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
                style={{ backgroundColor: '#2563eb', color: '#ffffff', boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3), 0 8px 10px -6px rgba(37, 99, 235, 0.1)' }}
                onClick={() => {
                  playSound('siguiente');
                  guardarProgresoFase();
                }}
              >
                Siguiente Fase
              </Link>
              <Link
                to="/app/C_conectar/$themeId"
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
