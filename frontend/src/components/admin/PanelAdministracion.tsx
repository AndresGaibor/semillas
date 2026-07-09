import { useNavigate } from "@tanstack/react-router";

import { BarraLateral } from "./panel/barra-lateral";
import { EncabezadoAdmin } from "./panel/encabezado-admin";
import { TarjetaMetrica } from "./panel/tarjeta-metrica";
import { EstadoContenido } from "./panel/estado-contenido";
import { AccionesRapidas } from "./panel/acciones-rapidas";
import { TablaTemasRecientes } from "./panel/tabla-temas-recientes";
import { ActividadReciente } from "./panel/actividad-reciente";
import { ProximasRevisiones } from "./panel/proximas-revisiones";
import { ProgresoSemanal } from "./panel/progreso-semanal";
import { METRICAS } from "./panel/data";

export function PanelAdministracion() {
  const navigate = useNavigate();

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICAS.map((metrica) => <TarjetaMetrica key={metrica.titulo} {...metrica} />)}
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,0.95fr)]">
        <div className="min-w-0 space-y-4">
          <EstadoContenido onVerTodo={() => navigate({ to: "/admin/temas" })} />
          <AccionesRapidas />
          <TablaTemasRecientes onVerTodos={() => navigate({ to: "/admin/temas" })} />
        </div>
        <div className="min-w-0 space-y-4">
          <ActividadReciente onVerTodaLaActividad={() => navigate({ to: "/admin/actividades" })} />
          <ProximasRevisiones onVerTodas={() => navigate({ to: "/admin/revision" })} />
          <ProgresoSemanal />
        </div>
      </div>
    </div>
  );
}
