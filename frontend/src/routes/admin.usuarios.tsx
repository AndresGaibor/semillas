import { createFileRoute, useNavigate } from "@tanstack/react-router";

import logoKids from "@/assets/images/Ilustraciones/Ninos 2.png";
import { AdminUsersFilters } from "@/features/admin/componentes/admin-users-filters";
import { AdminUsersTable } from "@/features/admin/componentes/admin-users-table";
import { AdminUsersSummary } from "@/features/admin/componentes/admin-users-summary";
import { useAdminUsers } from "@/features/admin/hooks/use-admin-users";

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsuariosPage,
});

function AdminUsuariosPage() {
  const navigate = useNavigate();
  const {
    searchValue, setSearchValue,
    selectedRol, setSelectedRol,
    selectedFranja, setSelectedFranja,
    selectedEstado, setSelectedEstado,
    selectedClub, setSelectedClub,
    paginaActual, setPaginaActual,
    isLoading, isError, error, refetch,
    filteredUsers, userStats, clearFilters,
  } = useAdminUsers();

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img src={logoKids} alt="Usuarios" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Gestión de usuarios</h2>
                <p className="text-[13px] text-slate-500 mt-1">Administra cuentas, roles y participación dentro de la plataforma.</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex rounded-xl overflow-hidden shadow-xs h-[42px]">
                <button type="button" disabled title="Próximamente" className="!bg-verde-brote hover:opacity-90 !text-white px-5 font-bold text-sm flex items-center gap-2 transition-colors h-full outline-none cursor-pointer">
                  <i className="fa-solid fa-plus text-[10px]" /> Nuevo usuario
                </button>
                <div className="w-[1px] bg-white/20 h-full" />
                <button type="button" disabled title="Próximamente" className="!bg-verde-brote hover:opacity-90 !text-white px-3 flex items-center justify-center transition-colors h-full outline-none cursor-pointer">
                  <i className="fa-solid fa-chevron-down text-[10px]" />
                </button>
              </div>
            </div>
          </div>

          <AdminUsersFilters
            searchValue={searchValue} onSearchChange={setSearchValue}
            selectedRol={selectedRol} onRolChange={setSelectedRol}
            selectedFranja={selectedFranja} onFranjaChange={setSelectedFranja}
            selectedEstado={selectedEstado} onEstadoChange={setSelectedEstado}
            selectedClub={selectedClub} onClubChange={setSelectedClub}
            onClear={clearFilters}
          />

          <AdminUsersTable
            usuarios={filteredUsers}
            isLoading={isLoading} isError={isError}
            errorMensaje={(error as Error)?.message}
            onReintentar={() => refetch()}
            totalResultados={filteredUsers.length}
            paginaActual={paginaActual}
            onCambiarPagina={setPaginaActual}
          />
        </div>

        <div className="flex flex-col gap-6">
          <AdminUsersSummary stats={userStats} />
        </div>
      </div>
    </div>
  );
}
