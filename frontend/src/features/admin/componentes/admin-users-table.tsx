import { Boton } from "@/componentes/ui/boton";
import { Card } from "@/componentes/ui/card-base";
import { EmptyState } from "@/componentes/ui/empty-state";
import { TablaBase, type EncabezadoTabla } from "@/componentes/ui/tabla-base";
import { AvatarTexto } from "@/componentes/ui/avatar-texto";
import { BadgeRol, type TipoRol } from "@/componentes/ui/badge-rol";
import { BadgeEstadoUsuario, type EstadoUsuario } from "@/componentes/ui/badge-estado-usuario";
import { InfoNivelXP } from "@/componentes/ui/info-nivel-xp";
import { Paginacion } from "@/componentes/ui/paginacion";
import { TablaSkeleton } from "@/componentes/ui/tabla-skeleton";
import { BotonAccion, FILA_HOVER_CLS, CheckboxCell } from "./admin.helpers";

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

function MenuAccionesUsuario() {
  return (
    <div className="flex items-center justify-end gap-1">
      <BotonAccion title="Ver detalles" icon="fa-eye" />
      <BotonAccion title="Opciones" icon="fa-ellipsis-vertical" />
    </div>
  );
}

const ENCABEZADOS: EncabezadoTabla[] = [
  { contenido: <input type="checkbox" aria-label="Seleccionar todos los usuarios" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />, className: "w-[40px] text-center" },
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
      <Card sombra="sm" className="flex items-center gap-3 border-red-200 bg-red-50 px-5 py-4">
        <i className="fa-solid fa-circle-exclamation text-red-500 text-lg" />
        <div>
          <p className="font-bold text-red-700 text-sm">Error al cargar usuarios</p>
          <p className="text-red-500 text-xs mt-0.5">
            {errorMensaje ?? "No se pudo conectar con el servidor. Verifica que tienes permisos de administrador."}
          </p>
        </div>
        {onReintentar && (
          <Boton
            variante="peligroContorno"
            tamano="pequeno"
            forma="pildora"
            onClick={onReintentar}
            className="ml-auto text-xs"
          >
            Reintentar
          </Boton>
        )}
      </Card>
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
    <tr className={FILA_HOVER_CLS}>
      <CheckboxCell ariaLabel={`Seleccionar ${usr.nombre}`} />

      <td className="py-4 px-4">
        <AvatarTexto
          src={usr.avatarImg}
          alt={usr.nombre}
          titulo={usr.nombre}
          subtitulo={usr.correo}
          avatarClassName="w-9 h-9 rounded-full border-2 border-slate-100"
          tituloClassName="font-extrabold text-slate-800 text-xs group-hover:text-[#2e9e5b] transition-colors sm:text-sm"
          subtituloClassName="text-xs text-slate-400 mt-0.5"
        />
      </td>

      <td className="py-4 px-4 whitespace-nowrap">
        <BadgeRol rol={usr.rol} />
      </td>

      <td className="py-4 px-4 font-bold text-slate-500 text-xs whitespace-nowrap">
        {usr.franja}
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full ${usr.clubBadgeBg} flex items-center justify-center shrink-0`}>
            <i className={`fa-solid ${usr.clubIcon} text-[9px] ${usr.clubIconColor}`} />
          </div>
          <span className="font-bold text-slate-600 text-xs whitespace-nowrap">{usr.club}</span>
        </div>
      </td>

      <td className="py-4 px-4 whitespace-nowrap">
        <InfoNivelXP nivelText={usr.nivelText} xpText={usr.xpText} isVinculado={usr.isVinculado} />
      </td>

      <td className="py-4 px-4 text-center whitespace-nowrap">
        <BadgeEstadoUsuario estado={usr.estado} />
      </td>

      <td className="py-4 px-4 text-slate-400 font-bold text-xs whitespace-nowrap">
        {usr.ultimoAcceso}
      </td>

      <td className="py-4 px-4 text-right">
        <MenuAccionesUsuario />
      </td>
    </tr>
  );
}

function EstadoVacio() {
  return (
    <td colSpan={9} className="py-16 text-center">
      <EmptyState mensaje="No hay usuarios registrados en la plataforma" className="py-0 font-bold text-slate-500 text-sm" />
    </td>
  );
}
