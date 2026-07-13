import { createFileRoute, useNavigate } from "@tanstack/react-router";

import logoKids from "@/assets/images/Ilustraciones/Ninos 2.png";
import { AdminSectionHeader } from "@/features/admin/componentes/dashboard";
import { AdminUsersFilters, AdminUsersTable, AdminUsersSummary } from "@/features/admin/componentes/usuarios";
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
          <AdminSectionHeader
            icono={<img src={logoKids} alt="Usuarios" className="h-10 w-10 object-contain" />}
            iconoContenedorClassName="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-200"
            titulo="Gestión de usuarios"
            descripcion="Administra cuentas, roles y participación dentro de la plataforma."
            accionPrincipal="Nuevo usuario"
            onAccionPrincipal={() => {}}
            accionSecundaria={<i className="fa-solid fa-chevron-down text-[10px]" />}
            accionSecundariaDeshabilitada
          />

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
