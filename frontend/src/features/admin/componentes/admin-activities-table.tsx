import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TablaBase, type EncabezadoTabla } from "@/componentes/ui/tabla-base";
import { Paginacion } from "@/componentes/ui/paginacion";
import { TablaSkeleton } from "@/componentes/ui/tabla-skeleton";
import { EliminarActividadDialog } from "./eliminar-actividad-dialog";
import { FilaActividad } from "./activity-table-row";
import { EstadoVacio } from "./activities-empty-state";

export type ActivityTableRow = {
  id: string;
  titulo: string;
  consigna: string;
  tipoIcon: string;
  tipoIconColor: string;
  tipoBadgeBg: string;
  tipoNombre: string;
  tipoCodigo: string;
  temaId: string;
  temaNombre: string;
  temaSlug: string;
  temaEstado: string;
  pasoId: string | null;
  franjaEdad: string;
  xpText: string;
  xp: number;
  estado: string;
  fechaCreacion: string;
  dificultad: string;
  consignaRaw: string;
  opciones: unknown[];
  grupoEdadId: string;
  sendaColor: {
    bg: string;
    icon: string;
    text: string;
    nombre: string;
  };
};

export type AdminActivitiesTableProps = {
  activities: ActivityTableRow[];
  isLoading: boolean;
  totalResultados: number;
  paginaActual: number;
  onCambiarPagina: (pagina: number) => void;
  porPagina: number;
  onCambiarPorPagina: (n: number) => void;
  onActividadEliminada?: () => void;
};

const ENCABEZADOS: EncabezadoTabla[] = [
  {
    contenido: (
      <input
        type="checkbox"
        aria-label="Seleccionar todas las actividades"
        className="rounded border-slate-300 text-green-600 focus:ring-green-600 cursor-pointer"
      />
    ),
    className: "w-[40px] text-center",
  },
  { contenido: "Actividad", className: "w-[25%]" },
  { contenido: "Tipo" },
  { contenido: "Tema" },
  { contenido: <span className="block text-center">XP</span>, className: "text-center" },
  { contenido: <span className="block text-center">Estado</span>, className: "text-center" },
  { contenido: "Creada" },
  { contenido: <span className="block text-right">Acciones</span>, className: "text-right" },
];

export function AdminActivitiesTable({
  activities,
  isLoading,
  totalResultados,
  paginaActual,
  onCambiarPagina,
  porPagina,
  onCambiarPorPagina,
  onActividadEliminada,
}: AdminActivitiesTableProps) {
  const navigate = useNavigate();
  const [actividadAEliminar, setActividadAEliminar] = useState<ActivityTableRow | null>(null);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
      <div className="flex items-center justify-between mb-4 select-none">
        <span className="text-[13px] font-black text-slate-700">
          {totalResultados} actividades encontradas
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Ordenar por:</span>
          <select className="border border-slate-100 rounded-lg px-2.5 py-1 bg-slate-50 font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 cursor-pointer">
            <option>Más recientes</option>
            <option>Mayor XP</option>
            <option>Por orden de lección</option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto select-none">
        <TablaBase
          encabezados={ENCABEZADOS}
          estadoVacio={<EstadoVacio />}
          colSpanVacio={8}
          encabezadoFilaClassName="text-[10px] font-black tracking-wider text-slate-400 uppercase"
        >
          {isLoading ? (
            <TablaSkeleton filas={6} columnas={8} />
          ) : (
            activities.map((act) => (
              <FilaActividad
                key={act.id}
                act={act}
                navigate={navigate}
                onEliminar={() => setActividadAEliminar(act)}
              />
            ))
          )}
        </TablaBase>
      </div>

      <Paginacion
        total={totalResultados}
        paginaActual={paginaActual}
        porPagina={porPagina}
        onCambiarPagina={onCambiarPagina}
        onCambiarPorPagina={onCambiarPorPagina}
        opcionesPorPagina={[10, 20, 50]}
        className="mt-6 pt-4 border-t border-slate-100"
      />

      {actividadAEliminar && (
        <EliminarActividadDialog
          actividad={actividadAEliminar}
          onClose={() => setActividadAEliminar(null)}
          onConfirm={() => {
            onActividadEliminada?.();
            setActividadAEliminar(null);
          }}
        />
      )}
    </div>
  );
}
