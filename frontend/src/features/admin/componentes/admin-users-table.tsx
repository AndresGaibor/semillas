import { TablaBase, type EncabezadoTabla } from "@/componentes/ui/tabla-base";
import { AvatarTexto } from "@/componentes/ui/avatar-texto";
import { BadgeRol, type TipoRol } from "@/componentes/ui/badge-rol";
import { BadgeEstadoUsuario, type EstadoUsuario } from "@/componentes/ui/badge-estado-usuario";
import { InfoNivelXP } from "@/componentes/ui/info-nivel-xp";
import { Paginacion } from "@/componentes/ui/paginacion";
import { TablaSkeleton } from "@/componentes/ui/tabla-skeleton";

export type UserTableRow = {
  id: string;
  nombre: string;
  correo: string;
  avatarImg: string;
  rol: TipoRol;
  franja: string;
  club: string;
  clubIcon: string;
  clubIconColor: string;
  clubBadgeBg: string;
  nivelText: string;
  xpText: string;
  isVinculado: boolean;
  estado: EstadoUsuario;
  ultimoAcceso: string;
};

export type AdminUsersTableProps = {
  usuarios: UserTableRow[];
  isLoading: boolean;
  isError?: boolean;
  errorMensaje?: string;
  onReintentar?: () => void;
  totalResultados: number;
  paginaActual: number;
  onCambiarPagina: (pagina: number) => void;
};

const ENCABEZADOS: EncabezadoTabla[] = [
  { contenido: <input type="checkbox" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />, className: "w-[40px] text-center" },
  { contenido: "Usuario", className: "w-[25%]" },
  { contenido: "Rol" },
  { contenido: "Franja" },
  { contenido: "Club" },
  { contenido: "Nivel" },
  { contenido: <span className="block text-center">Estado</span> },
  { contenido: "Último acceso" },
  { contenido: <span className="block text-right">Acciones</span>, className: "text-right" },
];

export function AdminUsersTable({
  usuarios,
  isLoading,
  isError,
  errorMensaje,
  onReintentar,
  totalResultados,
  paginaActual,
  onCambiarPagina,
}: AdminUsersTableProps) {
  if (isError) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
        <i className="fa-solid fa-circle-exclamation text-red-500 text-lg" />
        <div>
          <p className="font-bold text-red-700 text-sm">Error al cargar usuarios</p>
          <p className="text-red-500 text-xs mt-0.5">
            {errorMensaje ?? "No se pudo conectar con el servidor. Verifica que tienes permisos de administrador."}
          </p>
        </div>
        {onReintentar && (
          <button
            onClick={onReintentar}
            className="ml-auto text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
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
            usuarios.map((usr) => (
              <FilaUsuario key={usr.id} usuario={usr} />
            ))
          )}
        </TablaBase>
      </div>

      <Paginacion
        total={totalResultados}
        paginaActual={paginaActual}
        porPagina={10}
        onCambiarPagina={onCambiarPagina}
        opcionesPorPagina={[10, 20]}
        className="mt-6 pt-4 border-t border-slate-100"
      />
    </div>
  );
}

function FilaUsuario({ usuario: usr }: { usuario: UserTableRow }) {
  return (
    <tr className="hover:bg-slate-50/40 transition-colors group cursor-pointer">
      <td className="py-4 px-2 text-center" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />
      </td>

      <td className="py-4 px-4">
        <AvatarTexto
          src={usr.avatarImg}
          alt={usr.nombre}
          titulo={usr.nombre}
          subtitulo={usr.correo}
          avatarClassName="w-9 h-9 rounded-full border-2 border-slate-100"
          tituloClassName="font-extrabold text-slate-800 text-[13px] group-hover:text-[#2e9e5b] transition-colors"
          subtituloClassName="text-[11px] text-slate-400 mt-0.5"
        />
      </td>

      <td className="py-4 px-4 whitespace-nowrap">
        <BadgeRol rol={usr.rol} />
      </td>

      <td className="py-4 px-4 font-bold text-slate-500 text-[12px] whitespace-nowrap">
        {usr.franja}
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full ${usr.clubBadgeBg} flex items-center justify-center shrink-0`}>
            <i className={`fa-solid ${usr.clubIcon} text-[9px] ${usr.clubIconColor}`} />
          </div>
          <span className="font-bold text-slate-600 text-[12px] whitespace-nowrap">{usr.club}</span>
        </div>
      </td>

      <td className="py-4 px-4 whitespace-nowrap">
        <InfoNivelXP nivelText={usr.nivelText} xpText={usr.xpText} isVinculado={usr.isVinculado} />
      </td>

      <td className="py-4 px-4 text-center whitespace-nowrap">
        <BadgeEstadoUsuario estado={usr.estado} />
      </td>

      <td className="py-4 px-4 text-slate-400 font-bold text-[11px] whitespace-nowrap">
        {usr.ultimoAcceso}
      </td>

      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            title="Ver detalles"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-eye text-xs" />
          </button>
          <button
            title="Opciones"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-ellipsis-vertical text-xs" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EstadoVacio() {
  return (
    <td colSpan={9} className="py-16 text-center">
      <i className="fa-regular fa-user text-slate-300 text-4xl mb-3 block" />
      <p className="font-bold text-slate-500 text-sm">No hay usuarios registrados en la plataforma</p>
    </td>
  );
}
