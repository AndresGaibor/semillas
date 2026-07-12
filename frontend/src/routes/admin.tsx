import { useEffect } from "react";
import { Outlet, createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppTopbar } from "../shared/layout/app-topbar";
import { useAdminLayout } from "../features/admin/hooks/use-admin-layout";
import { obtenerMiPerfil } from "../features/perfil/profile.api";
import { sessionStorageApi } from "../shared/api/session";
import { resolverAccesoAdmin } from "../shared/auth/admin-access";
import "./app.css";
import "./admin-content-studio.css";

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

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme");
    if (saved === "admin-dark" || saved === "admin-light") {
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "admin-light");
    }
  }, []);

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
          showMenuButton={false}
        />

        <div className="app-shell__content app-shell__content--admin">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
