import { useNavigate } from "@tanstack/react-router";
import { TablaBase, type EncabezadoTabla } from "@/componentes/ui/tabla-base";
import { BadgeEstado } from "@/componentes/ui/badge-estado";
import { Paginacion } from "@/componentes/ui/paginacion";
import { TablaSkeleton } from "@/componentes/ui/tabla-skeleton";
import { getSendaColorClasses } from "./actividades.helpers";
import { BotonAccion, FILA_HOVER_CLS, CheckboxCell } from "./admin.helpers";

export type ActivityTableRow = {
  id: string;
  titulo: string;
  consigna: string;
  tipoIcon: string;
  tipoIconColor: string;
  tipoBadgeBg: string;
  tipoNombre: string;
  sendaNombre: string;
  sendaIconColor: string;
  franjaEdad: string;
  xpText: string;
  estado: string;
  fechaCreacion: string;
};

export type AdminActivitiesTableProps = {
  activities: ActivityTableRow[];
  isLoading: boolean;
  totalResultados: number;
  paginaActual: number;
  onCambiarPagina: (pagina: number) => void;
  porPagina: number;
  onCambiarPorPagina: (n: number) => void;
};

const ENCABEZADOS: EncabezadoTabla[] = [
  { contenido: <input type="checkbox" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />, className: "w-[40px] text-center" },
  { contenido: "Actividad", className: "w-[25%]" },
  { contenido: "Tipo" },
  { contenido: "Tema" },
  { contenido: "Senda" },
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
}: AdminActivitiesTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
      <div className="flex items-center justify-between mb-4 select-none">
        <span className="text-[13px] font-black text-slate-700">
          {totalResultados} actividades encontradas
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Ordenar por:</span>
          <select className="border border-slate-100 rounded-lg px-2.5 py-1 bg-slate-50 font-bold text-slate-600 focus:outline-none cursor-pointer">
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
          colSpanVacio={9}
          encabezadoFilaClassName="text-[10px] font-black tracking-wider text-slate-400 uppercase"
        >
          {isLoading ? (
            <TablaSkeleton filas={6} columnas={9} />
          ) : (
            activities.slice(0, 8).map((act) => (
              <FilaActividad key={act.id} act={act} navigate={navigate} />
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
        opcionesPorPagina={[10, 20]}
        className="mt-6 pt-4 border-t border-slate-100"
      />
    </div>
  );
}

function MenuAccionesActividad({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <BotonAccion onClick={() => navigate({ to: `/admin/temas` })} title="Vista previa" icon="fa-eye" />
      <BotonAccion onClick={() => navigate({ to: `/admin/temas` })} title="Editar" icon="fa-pencil" />
      <BotonAccion title="Más opciones" icon="fa-ellipsis-vertical" />
    </div>
  );
}

function FilaActividad({ act, navigate }: { act: ActivityTableRow; navigate: ReturnType<typeof useNavigate> }) {
  const sendaColor = getSendaColorClasses(act.sendaNombre);

  return (
    <tr className={FILA_HOVER_CLS}>
      <CheckboxCell />

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
          <div className={`w-5 h-5 rounded-full ${sendaColor.bg} flex items-center justify-center shrink-0`}>
            <i className={`fa-solid ${sendaColor.icon} text-[9px] ${sendaColor.text}`} />
          </div>
          <span className="font-bold text-slate-600 text-xs whitespace-nowrap">{act.sendaNombre}</span>
        </div>
      </td>

      <td className="py-4 px-4 font-semibold text-slate-500 text-xs whitespace-nowrap">
        {act.franjaEdad}
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
        <MenuAccionesActividad navigate={navigate} />
      </td>
    </tr>
  );
}

function EstadoVacio() {
  return (
    <td colSpan={9} className="py-16 text-center">
      <i className="fa-regular fa-rectangle-list text-slate-300 text-4xl mb-3 block" />
      <p className="font-bold text-slate-500 text-sm">No hay actividades creadas para este filtro</p>
    </td>
  );
}
