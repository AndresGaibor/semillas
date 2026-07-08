import * as React from "react";

import { SidebarIzquierdo } from "../features/gamification/componentes/sidebar-logros";
import { CabeceraLogros } from "../features/gamification/componentes/cabecera-logros";
import { TarjetasEstadisticas } from "../features/gamification/componentes/tarjetas-estadisticas";
import { InsigniasGrid } from "../features/gamification/componentes/insignias-grid";
import { MetasSiguientes } from "../features/gamification/componentes/metas-siguientes";
import { HistorialLogros } from "../features/gamification/componentes/historial-logros";
import { SidebarDerecho } from "../features/gamification/componentes/sidebar-derecho-logros";

export const PaginaLogros: React.FC = () => {
  const [seccionActiva, setSeccionActiva] = React.useState("Logros");

  return (
    <div
      className="flex min-h-screen bg-[#F7F4EC]"
      style={{ fontFamily: "Nunito, Inter, system-ui, sans-serif" }}
    >
      <SidebarIzquierdo seccionActiva={seccionActiva} onCambiarSeccion={setSeccionActiva} />
      <main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto max-w-[1040px]">
        <CabeceraLogros />
        <TarjetasEstadisticas />
        <InsigniasGrid />
        <MetasSiguientes />
        <HistorialLogros />
      </main>
      <SidebarDerecho />
    </div>
  );
};
