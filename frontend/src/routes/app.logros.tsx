import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerGamificacionPropia } from "../features/gamification/gamification.api";
import { Loader } from "lucide-react";

// Subcomponentes descompuestos
import { LogrosTabsFilter, type CategoriaLogro } from "../features/gamification/componentes/logros-tabs-filter";
import { InsigniaCardItem } from "../features/gamification/componentes/insignia-card-item";
import { ProgresoXpWidget } from "../features/gamification/componentes/progreso-xp-widget";
import { LogrosRachaWidget } from "../features/gamification/componentes/logros-racha-widget";
import { CompartirInsigniaWidget } from "../features/gamification/componentes/compartir-insignia-widget";

// Insignias ilustradas
import in1Img from "@/assets/images/Ilustraciones/in1.png";
import in2Img from "@/assets/images/Ilustraciones/in2.png";

export const Route = createFileRoute("/app/logros")({
  component: AchievementsPage,
});

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
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
        
        {/* COLUMNA IZQUIERDA: Listado de Insignias y Filtros */}
        <div className="flex-1 lg:flex-[3] flex flex-col w-full">
          <LogrosTabsFilter activo={activeTab} onChange={setActiveTab} />

          {query.isLoading && (
            <div className="flex justify-center py-20 w-full">
              <Loader className="animate-spin text-[#7E57C2]" size={32} />
            </div>
          )}

          {!query.isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {insignias.map((insignia) => (
                <InsigniaCardItem
                  key={insignia.codigo}
                  codigo={insignia.codigo}
                  nombre={insignia.nombre}
                  descripcion={insignia.descripcion}
                  criterio={insignia.criterio}
                  bono_xp={insignia.bono_xp}
                  imagen={insignia.imagen}
                  obtenido={insignia.obtenido}
                />
              ))}

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
          <ProgresoXpWidget
            xpTotal={xpInfo.xpTotal}
            numNivel={xpInfo.numNivel}
            nombreNivel={xpInfo.nombreNivel}
            xpRestantes={xpInfo.xpRestantes}
            porcentaje={xpInfo.porcentaje}
            onVerDetalles={() => navigate({ to: "/app/perfil" })}
          />

          <LogrosRachaWidget
            dias={3}
            mensaje="¡Sigue así! Has estudiado 3 días seguidos."
          />

          <CompartirInsigniaWidget
            nombreInsignia={primerLogroObtenido.nombre}
            imagenInsignia={primerLogroObtenido.imagen}
            onCompartir={() => handleShare(primerLogroObtenido.nombre)}
            compartido={sharedBadge !== null}
          />
        </aside>

      </div>
    </div>
  );
}
