import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AdminUsersFilters } from "@/features/admin/componentes/admin-users-filters";
import { AdminUsersSummary } from "@/features/admin/componentes/admin-users-summary";
import { AdminUsersTable, type UserTableRow } from "@/features/admin/componentes/admin-users-table";
import avatar1 from "@/assets/images/avatars/Avatar 1.png";
import avatar2 from "@/assets/images/avatars/Avatar 2.png";

const usuarios: UserTableRow[] = [
  { id: "u1", nombre: "María Luz", correo: "maria@example.com", avatarImg: avatar1, rol: "Niño", franja: "8-10 años", club: "Semillitas de Luz", clubIcon: "fa-seedling", clubIconColor: "text-green-600", clubBadgeBg: "bg-green-50", nivelText: "Nivel 8", xpText: "2.480 XP", isVinculado: true, estado: "activo", ultimoAcceso: "Hace 5 min" },
  { id: "u2", nombre: "Mateo Paz", correo: "mateo@example.com", avatarImg: avatar2, rol: "Adolescente", franja: "11-13 años", club: "Guardianes de Paz", clubIcon: "fa-shield", clubIconColor: "text-blue-600", clubBadgeBg: "bg-blue-50", nivelText: "Nivel 5", xpText: "1.730 XP", isVinculado: false, estado: "pendiente", ultimoAcceso: "Ayer" },
];

function VistaUsuarios({ estado = "datos" }: { estado?: "datos" | "cargando" | "vacio" | "error" }) {
  const [buscar, setBuscar] = useState("");
  const [rol, setRol] = useState("");
  const [franja, setFranja] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [club, setClub] = useState("");
  const [pagina, setPagina] = useState(1);
  const limpiar = () => { setBuscar(""); setRol(""); setFranja(""); setEstadoFiltro(""); setClub(""); };
  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-8">
      <div className="mx-auto grid max-w-[1500px] gap-5">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-800">Usuarios</h2><p className="mt-1 text-sm text-slate-500">Administra perfiles, roles y acceso.</p></div>
        <AdminUsersFilters searchValue={buscar} onSearchChange={setBuscar} selectedRol={rol} onRolChange={setRol} selectedFranja={franja} onFranjaChange={setFranja} selectedEstado={estadoFiltro} onEstadoChange={setEstadoFiltro} selectedClub={club} onClubChange={setClub} onClear={limpiar} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
          <AdminUsersTable usuarios={estado === "vacio" ? [] : usuarios} isLoading={estado === "cargando"} isError={estado === "error"} errorMensaje="No fue posible consultar los perfiles." onReintentar={() => undefined} totalResultados={estado === "vacio" ? 0 : 128} paginaActual={pagina} onCambiarPagina={setPagina} />
          <AdminUsersSummary stats={{ total: 128, activos: 112, bloqueados: 4, pendientes: 12, ninos: 61, adolescentes: 37, padres: 18, moderadores: 8, administradores: 4, actPct: 88, pendPct: 9, blockPct: 3, ninosPct: 48, adolPct: 29, padresPct: 14, modPct: 6, adminPct: 3 }} />
        </div>
      </div>
    </div>
  );
}

const meta = { title: "04 · Features/Admin/Usuarios", component: VistaUsuarios, parameters: { layout: "fullscreen" } } satisfies Meta<typeof VistaUsuarios>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Escritorio: Story = {};
export const MovilApp: Story = { globals: { viewport: { value: "movilApp", isRotated: false } } };
export const Cargando: Story = { args: { estado: "cargando" } };
export const Vacio: Story = { args: { estado: "vacio" } };
export const Error: Story = { args: { estado: "error" } };
