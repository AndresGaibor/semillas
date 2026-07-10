import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Loader, Play, CheckCircle, Clock } from "lucide-react";
import { useTemaDetalle } from "../features/themes/hooks/use-tema-detalle";

export const Route = createFileRoute("/app/temas/$themeId")({
  component: ThemeDetailPage,
});

function ThemeDetailPage() {
  const { themeId } = Route.useParams();
  const {
    themeQuery,
    portadaQuery,
    progresoReal,
    theme,
    handleIniciarClick,
  } = useTemaDetalle(themeId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Título Principal */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-tight">
          {theme?.titulo ?? "Cargando..."}
        </h1>
        {theme?.senda && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm" style={{ color: theme.senda.color_hex }}>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.senda.color_hex }}></span>
            <span className="font-bold text-sm tracking-wide uppercase">{theme.senda.nombre}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* COLUMNA IZQUIERDA: Tarjeta de Resumen y Botón */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Tarjeta principal (Card bonita) */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-slate-50 opacity-50 pointer-events-none">
              <Zap size={200} fill="currentColor" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#43a047]/10 flex items-center justify-center text-[#43a047]">
                  <CheckCircle size={20} />
                </span>
                Acerca de esta lección
              </h3>

              {theme?.resumen ? (
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-medium mb-6">
                  {theme.resumen}
                </p>
              ) : (
                <p className="text-lg text-slate-400 italic mb-6">No hay descripción disponible.</p>
              )}

              {/* Badges de stats dentro de la card */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-amber-50 text-amber-600 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 border border-amber-100/50">
                  <Zap size={22} fill="currentColor" />
                  {theme?.xp_recompensa ?? 0} XP
                </div>
                <div className="bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 border border-blue-100/50">
                  <Clock size={22} />
                  {theme?.minutos_estimados ?? 10} min
                </div>
              </div>
            </div>
          </div>

          {/* Progreso en una Card Pequeña */}
          <div className="bg-white rounded-2xl py-3 px-5 shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="flex justify-between items-center mb-1.5 px-1">
              <span className="font-bold text-slate-700 text-sm">Tu progreso</span>
              <span className="font-black text-[#43a047]">{progresoReal}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-[#43a047] h-full rounded-full transition-all duration-1000" style={{ width: `${progresoReal}%` }}></div>
            </div>
          </div>

          {/* Botón de Iniciar / Reanudar */}
          <div className="mt-auto shrink-0">
            <Link
              to="/app/C_conectar/$themeId"
              params={{ themeId }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-[1.5rem] font-black text-lg shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
              style={{ backgroundColor: '#43a047', color: '#ffffff', boxShadow: '0 20px 25px -5px rgba(67, 160, 71, 0.3), 0 8px 10px -6px rgba(67, 160, 71, 0.1)' }}
              onClick={handleIniciarClick}
            >
              <Play fill="currentColor" size={22} />
              {progresoReal === 0 ? "Iniciar Actividad" : "Reanudar Actividad"}
            </Link>
          </div>

        </div>

        {/* COLUMNA DERECHA: Imagen en una Card */}
        <div className="lg:col-span-5 flex items-start h-full">
          <div className="bg-white rounded-[2.5rem] p-3 shadow-2xl shadow-slate-200/50 border border-slate-100 w-full">
            {portadaQuery.data?.url ? (
              <div className="w-full rounded-[2rem] overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={portadaQuery.data.url}
                  alt={theme?.titulo ?? "Portada del tema"}
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ) : themeQuery.isLoading ? (
              <div className="w-full aspect-square rounded-[2rem] bg-slate-50 flex items-center justify-center animate-pulse">
                <Loader className="animate-spin text-slate-300" size={40} />
              </div>
            ) : (
              <div className="w-full aspect-square rounded-[2rem] bg-slate-50 flex items-center justify-center border-2 border-slate-200 border-dashed">
                <span className="text-slate-400 font-bold">Sin portada</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
