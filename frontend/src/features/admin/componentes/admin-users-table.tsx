import { Boton } from "@/componentes/ui/boton";
import { Card } from "@/componentes/ui/card-base";
import { TablaBase, type EncabezadoTabla } from "@/componentes/ui/tabla-base";
import { Paginacion } from "@/componentes/ui/paginacion";
import { TablaSkeleton } from "@/componentes/ui/tabla-skeleton";
import { FilaUsuario, type UserTableRow } from "./user-table-row";
import { EstadoVacio } from "./users-table-empty-state";

export type { UserTableRow } from "./user-table-row";

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
  { contenido: <input type="checkbox" aria-label="Seleccionar todos los usuarios" className="rounded border-slate-300/30 text-green-600 focus:ring-green-600 cursor-pointer" />, className: "w-[40px] text-center" },
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
      <Card sombra="sm" className="flex items-center gap-3 border-red-900/30 bg-red-950/30 px-5 py-4">
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
    <div className="bg-[#142e22] rounded-3xl border border-[#1a3a2a] p-6 shadow-sm flex flex-col text-left">
      <div className="w-full overflow-x-auto select-none">
        <TablaBase
          encabezados={ENCABEZADOS}
          estadoVacio={<EstadoVacio />}
          colSpanVacio={9}
          encabezadoFilaClassName="text-[10px] font-black tracking-wider text-emerald-400/50 uppercase"
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
        className="mt-6 pt-4 border-t border-[#1a3a2a]"
      />
    </div>
  );
}
