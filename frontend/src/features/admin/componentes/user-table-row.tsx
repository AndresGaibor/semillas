import { AvatarTexto } from "@/componentes/ui/avatar-texto";
import { BadgeRol, type TipoRol } from "@/componentes/ui/badge-rol";
import { BadgeEstadoUsuario, type EstadoUsuario } from "@/componentes/ui/badge-estado-usuario";
import { InfoNivelXP } from "@/componentes/ui/info-nivel-xp";
import { FILA_HOVER_CLS, CheckboxCell } from "./admin.helpers";
import { MenuAccionesUsuario } from "./user-row-actions";

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

export function FilaUsuario({ usuario: usr }: { usuario: UserTableRow }) {
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
          tituloClassName="font-extrabold text-slate-800 text-xs group-hover:text-green-600 transition-colors sm:text-sm"
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
