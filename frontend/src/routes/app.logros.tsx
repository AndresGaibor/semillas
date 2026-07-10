import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { LogrosTabsFilter } from "../features/gamification/componentes/logros-tabs-filter";
import { InsigniaCardItem } from "../features/gamification/componentes/insignia-card-item";
import { ProgresoXpWidget } from "../features/gamification/componentes/progreso-xp-widget";
import { LogrosRachaWidget } from "../features/gamification/componentes/logros-racha-widget";
import { CompartirInsigniaWidget } from "../features/gamification/componentes/compartir-insignia-widget";
import { useLogrosPage } from "../features/logros/hooks/use-logros-page";

import in1Img from "@/assets/images/Ilustraciones/in1.png";
import in2Img from "@/assets/images/Ilustraciones/in2.png";

export const Route = createFileRoute("/app/logros")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const {
    query,
    xpInfo,
    insignias,
    primerLogroObtenido,
    activeTab,
    setActiveTab,
    sharedBadge,
    handleShare,
    handleVerDetalles,
  } = useLogrosPage();

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
                  imagen={insignia.codigo.includes("primera") || insignia.codigo.includes("crecer") ? in1Img : in2Img}
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
            onVerDetalles={handleVerDetalles}
          />

          <LogrosRachaWidget
            dias={3}
            mensaje="¡Sigue así! Has estudiado 3 días seguidos."
          />

          <CompartirInsigniaWidget
            nombreInsignia={primerLogroObtenido.nombre}
            imagenInsignia={primerLogroObtenido.codigo.includes("primera") || primerLogroObtenido.codigo.includes("crecer") ? in1Img : in2Img}
            onCompartir={() => handleShare(primerLogroObtenido.nombre)}
            compartido={sharedBadge !== null}
          />
        </aside>

      </div>
    </div>
  );
}
