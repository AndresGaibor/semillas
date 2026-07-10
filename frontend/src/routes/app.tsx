import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { hasSession } from "../shared/api/auth-guard";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppTopbar } from "../shared/layout/app-topbar";
import { BottomNav } from "@/componentes/ui/bottom-nav";
import { useAppLayout } from "../shared/layout/hooks/use-app-layout";
import "./app.css";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!hasSession()) throw redirect({ to: "/login", search: { redirect: "/app" } });
  },
  component: AppLayout,
});

function AppLayout() {
  const {
    sidebarOpen,
    closeSidebar,
    openSidebar,
    isOffline,
    handleLogout,
    opcionesBottomNav,
    activoMovil,
    navigateTo,
    pageHeader,
    path,
  } = useAppLayout();

  return (
    <div className="app-shell">
      <AppSidebar
        activePage={path}
        isOffline={isOffline}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      <main className="app-shell__main">
        <AppTopbar
          title={pageHeader.titulo}
          subtitle={pageHeader.subtitulo}
          onOpenSidebar={openSidebar}
          onLogout={handleLogout}
          showMenuButton
        />

        <div className="app-shell__content">
          <Outlet />
        </div>
      </main>

      <nav className="app-shell__bottom-nav" aria-label="Navegación principal móvil">
        <BottomNav
          opciones={opcionesBottomNav}
          activo={activoMovil}
          onCambiar={navigateTo}
        />
      </nav>
    </div>
  );
}
