import { Outlet, createFileRoute, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { hasSession } from "../shared/api/auth-guard";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppTopbar } from "../shared/layout/app-topbar";
import { sessionStorageApi } from "../shared/api/session";
import { cerrarSesionAutenticada } from "../shared/auth/supabase";
import { BottomNav } from "@/componentes/ui/bottom-nav";
import { obtenerNavMovilActivo, obtenerNavegacionMovil } from "../shared/layout/app-mobile-nav";

import "./app.css";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!hasSession()) throw redirect({ to: "/login" });
  },
  component: AppLayout,
});

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await cerrarSesionAutenticada();
    sessionStorageApi.clearGuestUserId();
    navigate({ to: "/login" });
  };

  const navegacionMovil = obtenerNavegacionMovil();
  const opcionesBottomNav = navegacionMovil.map(({ id, etiqueta, icono }) => ({ id, etiqueta, icono }));
  const activoMovil = obtenerNavMovilActivo(path);

  let tituloHeader = "Hola Semillero";
  let subtituloHeader = "Sigue aprendiendo y creciendo en la Palabra de Dios.";

  if (path.startsWith("/app/temas")) {
    tituloHeader = "Mis temas";
    subtituloHeader = "Explora y repasa los temas que has estudiado.";
  } else if (path.startsWith("/app/logros")) {
    tituloHeader = "Mis insignias";
    subtituloHeader = "Los logros y premios que has alcanzado.";
  } else if (path.startsWith("/app/perfil")) {
    tituloHeader = "Mi perfil";
    subtituloHeader = "Administra tu avatar y configuración.";
  } else if (path.startsWith("/app/clubes")) {
    tituloHeader = "Mi club";
    subtituloHeader = "Aprende y participa con tu iglesia, curso o familia.";
  } else if (path.startsWith("/app/descargas")) {
    tituloHeader = "Descargas";
    subtituloHeader = "Recursos para aprender y crecer en la fe, incluso sin conexión.";
  }

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
          title={tituloHeader}
          subtitle={subtituloHeader}
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
          onCambiar={(id) => {
            const destino = navegacionMovil.find((opcion) => opcion.id === id)?.to ?? "/app";
            navigate({ to: destino as never });
          }}
          clase="pb-[env(safe-area-inset-bottom)]"
        />
      </div>
    </div>
  );
}
