import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppTopbar } from "../shared/layout/app-topbar";
import { useAdminLayout } from "../features/admin/hooks/use-admin-layout";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { resolverAccesoAdmin } from "../shared/auth/admin-access";
import "./app.css";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    try {
      const { usuario } = await obtenerMiPerfil();
      const acceso = resolverAccesoAdmin(usuario);
      if (!acceso.permitido) {
        throw redirect({ to: acceso.redireccion, search: acceso.redireccion === "/login" ? { redirect: "/admin" } : undefined });
      }
    } catch (error) {
      if (error && typeof error === "object" && "isRedirect" in error) {
        throw error;
      }
      throw redirect({ to: "/login", search: { redirect: "/admin" } });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { sidebarOpen, closeSidebar, handleLogout, pageHeader } = useAdminLayout();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <AppSidebar
        activePage=""
        variant="admin"
        isOffline={false}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      <main className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8 lg:p-10">
        <AppTopbar
          title={pageHeader.titulo}
          subtitle={pageHeader.subtitulo}
          onOpenSidebar={() => {}}
          onLogout={handleLogout}
        />

        <div className="flex min-w-0 flex-col gap-6 md:gap-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
