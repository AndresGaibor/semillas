import { Outlet, createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppTopbar } from "../shared/layout/app-topbar";
import { useAdminLayout } from "../features/admin/hooks/use-admin-layout";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { sessionStorageApi } from "../shared/api/session";
import { resolverAccesoAdmin } from "../shared/auth/admin-access";
import "./app.css";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    try {
      const { usuario } = await obtenerMiPerfil();
      const acceso = resolverAccesoAdmin(usuario);

      if (!acceso.permitido) {
        if (acceso.redireccion === "/login") {
          throw redirect({ to: "/login", search: { redirect: location.href } });
        }
        throw redirect({ to: "/acceso-denegado" });
      }
    } catch (error) {
      if (isRedirect(error)) throw error;
      sessionStorageApi.clearGuestSession();
      sessionStorageApi.clearAccessToken();
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { sidebarOpen, closeSidebar, openSidebar, handleLogout, pageHeader, activePage } = useAdminLayout();

  return (
    <div className="app-shell app-shell--admin">
      <AppSidebar
        activePage={activePage}
        variant="admin"
        isOffline={false}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      <main className="app-shell__main app-shell__main--admin">
        <AppTopbar
          title={pageHeader.titulo}
          subtitle={pageHeader.subtitulo}
          onOpenSidebar={openSidebar}
          onLogout={handleLogout}
          showMenuButton
        />

        <div className="app-shell__content app-shell__content--admin">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
