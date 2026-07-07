import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerGamificacionPropia } from "../features/gamification/gamification.api";
import { Zap, Flame, Share2, Lock, CheckCircle, Loader } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";

// Insignias ilustradas
import in1Img from "@/assets/images/Ilustraciones/in1.png";
import in2Img from "@/assets/images/Ilustraciones/in2.png";

export const Route = createFileRoute("/app/logros")({
  component: AchievementsPage,
});

type CategoriaLogro = "todas" | "padre" | "hijo" | "especial";

const INSIGNIAS_CATALOGO = [
  {
    codigo: "primera_leccion",
    nombre: "Primer paso",
    descripcion: "Completaste tu primera lección.",
    criterio: "Completa 1 tema",
    bono_xp: 20,
    categoria: "especial" as CategoriaLogro,
    imagen: in1Img,
  },
  {
    codigo: "explorador_palabra",
    nombre: "Explorador de la Fe",
    descripcion: "Completa 10 actividades en total.",
    criterio: "Completa 10 actividades",
    bono_xp: 50,
    categoria: "hijo" as CategoriaLogro,
    imagen: in2Img,
  },
  {
    codigo: "racha_siete_dias",
    nombre: "Semilla constante",
    descripcion: "Mantén una racha de 7 días seguidos.",
    criterio: "7 días de racha",
    bono_xp: 50,
    categoria: "padre" as CategoriaLogro,
    imagen: in2Img, // Reutilizamos in2 como fallback de ilustración
  },
  {
    codigo: "crecer_completo",
    nombre: "Cosechador del Saber",
    descripcion: "Completa todos los pasos CRECER de un tema.",
    criterio: "Completa un tema CRECER",
    bono_xp: 100,
    categoria: "especial" as CategoriaLogro,
    imagen: in1Img,
  }
];

function AchievementsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CategoriaLogro>("todas");
  const [sharedBadge, setSharedBadge] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: obtenerGamificacionPropia,
  });

  const nivel = query.data?.nivel;
  const logrosObtenidos = (query.data?.logros as any[]) || [];

  // Calcular progreso de XP dinámico
  const xpInfo = useMemo(() => {
    const xpTotal = nivel?.xp_total ?? 1250;
    const numNivel = nivel?.numero_nivel ?? 7;
    const xpEnNivel = xpTotal % 1000;
    const xpRestantes = 1000 - xpEnNivel;
    const porcentaje = Math.round((xpEnNivel / 1000) * 100);

    return {
      xpTotal,
      numNivel,
      nombreNivel: nivel?.nombre_nivel || "Explorador",
      xpEnNivel,
      xpRestantes,
      porcentaje,
    };
  }, [nivel]);

  // Filtrado de insignias por categoría y verificación de desbloqueo
  const insignias = useMemo(() => {
    return INSIGNIAS_CATALOGO.filter(
      (insignia) => activeTab === "todas" || insignia.categoria === activeTab
    ).map((insignia) => {
      // Un logro está obtenido si su código coincide con algún logro de la lista del usuario
      const obtenido = logrosObtenidos.some(
        (l) => l.logro?.codigo === insignia.codigo
      );
      return {
        ...insignia,
        obtenido,
      };
    });
  }, [activeTab, logrosObtenidos]);

  // Primer logro obtenido para compartir
  const primerLogroObtenido = useMemo(() => {
    const primerObtenido = INSIGNIAS_CATALOGO.find((insignia) =>
      logrosObtenidos.some((l) => l.logro?.codigo === insignia.codigo)
    );
    return (primerObtenido || INSIGNIAS_CATALOGO[0]) as typeof INSIGNIAS_CATALOGO[number];
  }, [logrosObtenidos]);

  const handleShare = (badgeNombre: string) => {
    setSharedBadge(badgeNombre);
    alert(`¡Insignia "${badgeNombre}" compartida con éxito en tu Club!`);
    setTimeout(() => setSharedBadge(null), 2000);
  };

  return (
    <div className="w-full flex flex-col font-sans text-slate-800 text-left">
      
      {/* Contenedor Principal con Dos Columnas */}
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
        
        {/* COLUMNA IZQUIERDA: Listado de Insignias y Filtros */}
        <div className="flex-1 lg:flex-[3] flex flex-col w-full">
          
          {/* Tabs / Filtros */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-4">
            {(["todas", "padre", "hijo", "especial"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all capitalize ${
                  activeTab === tab
                    ? "bg-[#7E57C2] text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {tab === "todas" ? "Todas" : tab === "especial" ? "Especiales" : `Senda del ${tab}`}
              </button>
            ))}
          </div>

          {query.isLoading && (
            <div className="flex justify-center py-20 w-full">
              <Loader className="animate-spin text-[#7E57C2]" size={32} />
            </div>
          )}

          {/* Grid de Tarjetas de Insignia */}
          {!query.isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {insignias.map((insignia) => {
                return (
                  <Card
                    key={insignia.codigo}
                    className={`p-0 overflow-hidden flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      !insignia.obtenido ? "opacity-75 bg-slate-50/50" : "bg-white"
                    }`}
                  >
                    {/* Contenedor de Imagen */}
                    <div className="relative w-[130px] h-[130px] mt-6 rounded-full border-4 border-white bg-slate-100 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                      {insignia.obtenido ? (
                        <img
                          src={insignia.imagen}
                          alt={insignia.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <Lock className="text-slate-400" size={36} />
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col items-center">
                      <h3 className="text-lg font-extrabold text-slate-800 mb-1 leading-tight">
                        {insignia.nombre}
                      </h3>
                      <p className="text-xs font-semibold text-[#7E57C2] mb-3">
                        +{insignia.bono_xp} XP • {insignia.criterio}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                        {insignia.descripcion}
                      </p>
                      
                      {insignia.obtenido ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-green-50 text-green-700 uppercase tracking-wider border border-green-100">
                          <CheckCircle size={10} />
                          Obtenida
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200">
                          En progreso
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}

              {insignias.length === 0 && (
                <p className="text-center text-slate-400 py-12 col-span-full">
                  No hay insignias en esta categoría.
                </p>
              )}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Widgets de Progreso y Racha */}
        <aside className="w-full lg:w-[320px] flex flex-col gap-6">
          
          {/* Widget de Progreso */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-black text-slate-800">Tu progreso</h2>
              <button 
                onClick={() => navigate({ to: "/app/perfil" })}
                className="bg-transparent border-0 p-0 text-xs font-bold text-[#7E57C2] hover:underline cursor-pointer"
              >
                Ver detalles
              </button>
            </div>

            <div className="flex items-center gap-5">
              {/* Progreso Circular SVG */}
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                {/* SVG circular progress */}
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#F1F5F9"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#22c55e"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 - (xpInfo.porcentaje / 100) * (2 * Math.PI * 34)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-sm font-extrabold text-slate-800">{xpInfo.porcentaje}%</span>
                </div>
              </div>

              {/* Información */}
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-base font-extrabold text-indigo-950 truncate">
                  Nivel {xpInfo.numNivel}
                </span>
                <span className="text-xs font-extrabold text-green-600 mb-2">
                  {xpInfo.nombreNivel}
                </span>
                <div className="flex items-center gap-1.5 text-slate-700 mb-1">
                  <Zap size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-extrabold">{xpInfo.xpTotal} XP</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {xpInfo.xpRestantes} XP para subir
                </p>
              </div>
            </div>

            {/* Barra de progreso lineal */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-[#7E57C2] rounded-full transition-all duration-500"
                style={{ width: `${xpInfo.porcentaje}%` }}
              />
            </div>
          </div>

          {/* Widget de Racha */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between gap-4">
              <div className="text-left flex-1">
                <h2 className="text-base font-black text-slate-800 mb-1">Racha actual</h2>
                <p className="text-xs text-slate-400 leading-normal">
                  ¡Sigue así! Has estudiado 3 días seguidos.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center bg-orange-50 border border-orange-200 rounded-full w-16 h-16 flex-shrink-0 shadow-sm">
                <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={24} />
                <span className="text-sm font-black text-orange-700 leading-none mt-0.5">3</span>
              </div>
            </div>
          </div>

          {/* Widget de Compartir */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-black text-slate-800">Compartir en Clubes</h2>
              <Share2 size={16} className="text-[#7E57C2]" />
            </div>

            <div className="bg-slate-50 border border-dashed border-[#EDE7F6] p-4 rounded-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shadow-sm mb-3">
                <img
                  src={primerLogroObtenido.imagen}
                  alt="Insignia a compartir"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                ¡Muestra tus logros con tus amigos de los clubes!
              </p>
              <button
                onClick={() => handleShare(primerLogroObtenido.nombre)}
                disabled={sharedBadge !== null}
                className="w-full flex items-center justify-center gap-2 bg-[#7E57C2] hover:bg-[#4527A0] disabled:bg-green-600 text-white border-0 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                <Share2 size={14} />
                {sharedBadge ? "Compartido" : "Compartir insignia"}
              </button>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
