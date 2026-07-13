import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TablaBase, type EncabezadoTabla } from "@/componentes/ui/tabla-base";
import { Paginacion } from "@/componentes/ui/paginacion";
import { TablaSkeleton } from "@/componentes/ui/tabla-skeleton";
import { EliminarActividadDialog } from "./eliminar-actividad-dialog";
import { FilaActividad } from "./activity-table-row";
import { EstadoVacio } from "./activities-empty-state";
import { MenuAccionesActividad } from "./activity-menu-actions";
import { BadgeEstado } from "@/componentes/ui/badge-estado";

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
    <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm sm:p-6 flex flex-col text-left">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Resultados</span><p className="mt-1 text-sm font-black text-slate-800">{totalResultados} actividades encontradas</p></div>
        <p className="max-w-xs text-right text-xs leading-5 text-slate-500">Cada actividad conserva su tema, franja y estado editorial.</p>
      </div>

      <div className="hidden w-full overflow-x-auto select-none md:block">
        <TablaBase
          encabezados={ENCABEZADOS}
          estadoVacio={<EstadoVacio />}
          colSpanVacio={7}
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

      <div className="flex flex-col gap-3 md:hidden">
        {isLoading ? <div className="py-10 text-center text-sm font-semibold text-slate-500">Cargando actividades...</div> : null}
        {!isLoading && activities.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm font-semibold text-slate-500">No hay actividades creadas para este filtro.</div> : null}
        {!isLoading ? activities.map((actividad) => <ActivityCard key={actividad.id} actividad={actividad} navigate={navigate} onEliminar={() => setActividadAEliminar(actividad)} />) : null}
      </div>

      <Paginacion
        total={totalResultados}
        paginaActual={paginaActual}
        porPagina={porPagina}
        onCambiarPagina={onCambiarPagina}
        onCambiarPorPagina={onCambiarPorPagina}
        opcionesPorPagina={[10, 20, 50]}
        className="mt-6 pt-4 border-t border-slate-200"
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

function ActivityCard({ actividad, navigate, onEliminar }: { actividad: ActivityTableRow; navigate: ReturnType<typeof useNavigate>; onEliminar: () => void }) {
  return <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${actividad.tipoBadgeBg}`}><i className={`fa-solid ${actividad.tipoIcon} text-sm ${actividad.tipoIconColor}`} aria-hidden="true" /></div><div className="min-w-0"><h3 className="truncate text-sm font-black text-slate-800">{actividad.titulo}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{actividad.consigna}</p></div></div><MenuAccionesActividad navigate={navigate} act={actividad} onEliminar={onEliminar} /></div><div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 text-xs font-bold"><span className="rounded-full bg-white px-2.5 py-1 text-slate-600">{actividad.tipoNombre}</span><span className="rounded-full bg-white px-2.5 py-1 text-slate-600">{actividad.franjaEdad}</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{actividad.xpText}</span><BadgeEstado estado={actividad.estado} /></div><p className="mt-3 text-xs font-semibold text-slate-500">{actividad.temaNombre} · {actividad.fechaCreacion}</p></article>;
}
