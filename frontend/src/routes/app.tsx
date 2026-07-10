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
  const { sidebarOpen, closeSidebar, setSidebarOpen, isOffline, handleLogout, opcionesBottomNav, activoMovil, navigateTo, pageHeader, path } = useAppLayout();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <AppSidebar
        activePage={path}
        isOffline={isOffline}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      <main className="flex flex-1 flex-col overflow-y-auto p-4 pb-24 md:p-8 md:pb-8 lg:p-10 lg:pb-10">
        <AppTopbar
          title={pageHeader.titulo}
          subtitle={pageHeader.subtitulo}
          onOpenSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
          showMenuButton={false}
        />

        <div className="flex flex-col gap-6 md:gap-8">
          <Outlet />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-[120] md:hidden">
        <BottomNav
          opciones={opcionesBottomNav}
          activo={activoMovil}
          onCambiar={navigateTo}
          clase="pb-[env(safe-area-inset-bottom)]"
        />
      </div>
    </div>
  );
}
