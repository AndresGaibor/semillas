import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TablaBase, type EncabezadoTabla } from "@/componentes/ui/tabla-base";
import { BadgeEstado } from "@/componentes/ui/badge-estado";
import { Paginacion } from "@/componentes/ui/paginacion";
import { TablaSkeleton } from "@/componentes/ui/tabla-skeleton";
import { MenuDesplegable, type ItemMenu } from "@/componentes/ui/menu-desplegable";
import { getSendaColorClasses } from "./actividades.helpers";
import { BotonAccion, FILA_HOVER_CLS, CheckboxCell } from "./admin.helpers";
import { EliminarActividadDialog } from "./eliminar-actividad-dialog";

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
  sendasColor: {
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
  { contenido: <input type="checkbox" aria-label="Seleccionar todas las actividades" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />, className: "w-[40px] text-center" },
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
          <select className="border border-slate-100 rounded-lg px-2.5 py-1 bg-slate-50 font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/20 cursor-pointer">
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

function MenuAccionesActividad({
  navigate,
  act,
  onEliminar,
}: {
  navigate: ReturnType<typeof useNavigate>;
  act: ActivityTableRow;
  onEliminar: () => void;
}) {
  const [open, setOpen] = useState(false);

  const itemsMenu: ItemMenu[] = [
    {
      label: "Copiar enlace",
      icono: "fa-link",
      onClick: () => navigator.clipboard.writeText(`${window.location.origin}/app/temas/${act.temaSlug}/actividades/${act.id}`),
    },
    {
      label: "Eliminar",
      icono: "fa-trash",
      iconoColor: "text-red-500",
      textoColor: "text-red-500",
      onClick: onEliminar,
    },
  ];

  return (
    <div className="flex items-center justify-end gap-1">
      <BotonAccion
        onClick={() => navigate({ to: "/app/actividades/$activityId", params: { activityId: act.id } })}
        title="Vista previa"
        icon="fa-eye"
      />
      <BotonAccion
        onClick={() => navigate({ to: "/admin/temas/$themeId/activities", params: { themeId: act.temaId }, search: { form: "editar", actividadId: act.id } })}
        title="Editar"
        icon="fa-pencil"
      />
      <MenuDesplegable
        items={itemsMenu}
        estaAbierto={open}
        onAlternar={() => setOpen(!open)}
        onCerrar={() => setOpen(false)}
      />
    </div>
  );
}

function FilaActividad({
  act,
  navigate,
  onEliminar,
}: {
  act: ActivityTableRow;
  navigate: ReturnType<typeof useNavigate>;
  onEliminar: () => void;
}) {
  const sendasColor = act.sendasColor;

  return (
    <tr className={FILA_HOVER_CLS}>
      <CheckboxCell ariaLabel={`Seleccionar ${act.titulo}`} />

      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${act.tipoBadgeBg} flex items-center justify-center shrink-0`}>
            <i className={`fa-solid ${act.tipoIcon} text-xs ${act.tipoIconColor}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-slate-800 text-xs truncate group-hover:text-[#2e9e5b] transition-colors sm:text-sm">{act.titulo}</span>
            <span className="text-xs text-slate-400 truncate mt-0.5">{act.consigna}</span>
          </div>
        </div>
      </td>

      <td className="py-4 px-4 font-bold text-slate-700 text-xs">
        {act.tipoNombre}
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full ${sendasColor.bg} flex items-center justify-center shrink-0`}>
            <i className={`fa-solid ${sendasColor.icon} text-[9px] ${sendasColor.text}`} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-600 text-xs whitespace-nowrap">{act.temaNombre}</span>
            <span className="text-[10px] text-slate-400">{act.franjaEdad}</span>
          </div>
        </div>
      </td>

      <td className="py-4 px-2 text-center font-black text-[#2e9e5b] text-xs whitespace-nowrap">
        {act.xpText}
      </td>

      <td className="py-4 px-4 text-center whitespace-nowrap">
        <BadgeEstado estado={act.estado} />
      </td>

      <td className="py-4 px-4 text-slate-400 font-bold text-xs whitespace-nowrap">
        {act.fechaCreacion}
      </td>

      <td className="py-4 px-4 text-right">
        <MenuAccionesActividad navigate={navigate} act={act} onEliminar={onEliminar} />
      </td>
    </tr>
  );
}

function EstadoVacio() {
  return (
    <td colSpan={8} className="py-16 text-center">
      <i className="fa-regular fa-rectangle-list text-slate-300 text-4xl mb-3 block" />
      <p className="font-bold text-slate-500 text-sm">No hay actividades creadas para este filtro</p>
    </td>
  );
}
