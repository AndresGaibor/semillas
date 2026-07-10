import {
  Outlet,
  createFileRoute,
  isRedirect,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppTopbar } from "../shared/layout/app-topbar";
import { sessionStorageApi } from "../shared/api/session";
import { cerrarSesionAutenticada } from "../shared/auth/supabase";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { resolverAccesoAdmin } from "../shared/auth/admin-access";

import "./app.css"; // Reutilizar estilos globales de layout

export const Route = createFileRoute("/admin")({
  // Seguridad deshabilitada temporalmente para pruebas
  // beforeLoad: async ({ location }) => {
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  // Prevenir scroll en body cuando el menú móvil está abierto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await cerrarSesionAutenticada();
    sessionStorageApi.clearGuestUserId();
    navigate({ to: "/login", search: { redirect: "/onboarding" } });
  };

  let tituloHeader = "Panel de Control";
  let subtituloHeader = "Estadísticas y resumen de la plataforma.";

  if (activePage.replace(/\/$/, "") === "/admin") {
    tituloHeader = "Panel de administración";
    subtituloHeader = "Resumen general del contenido, actividad y revisión.";
  }

  if (activePage.includes("/admin/temas/new")) {
    tituloHeader = "Crear nuevo tema";
    subtituloHeader =
      "Crea un tema que inspire y guíe a los niños en su crecimiento espiritual.";
  } else if (activePage.includes("/detalle")) {
    tituloHeader = "";
    subtituloHeader = "";
  } else if (activePage.includes("/crecer")) {
    tituloHeader = "Editor CRECER";
    subtituloHeader = "Edita los seis momentos de la metodología CRECER.";
  } else if (activePage.includes("/edit")) {
    tituloHeader = "";
    subtituloHeader = "";
  } else if (activePage.includes("/activities")) {
    tituloHeader = "Actividades";
    subtituloHeader = "Gestiona las actividades interactivas del tema.";
  } else if (activePage.includes("/preview")) {
    tituloHeader = "Vista previa";
    subtituloHeader = "Previsualiza cómo verá la lección el alumno.";
  } else if (activePage.includes("/admin/medios")) {
    tituloHeader = "Panel de administración";
    subtituloHeader = "Gestiona los recursos multimedia de la plataforma.";
  } else if (activePage.includes("/admin/usuarios")) {
    tituloHeader = "Panel de administración";
    subtituloHeader =
      "Administra cuentas, roles y participación dentro de la plataforma.";
  } else if (activePage.includes("/admin/actividades")) {
    tituloHeader = "Panel de administración";
    subtituloHeader = "Gestiona, edita y publica las actividades de Semillas.";
  } else if (activePage.includes("/admin/temas")) {
    tituloHeader = "Panel de administración";
    subtituloHeader = "Gestiona, edita y publica las lecciones de Semillas.";
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <AppSidebar
        activePage={activePage}
        variant="admin"
        isOffline={false}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      <main className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8 lg:p-10">
        <AppTopbar
          title={tituloHeader}
          subtitle={subtituloHeader}
          onOpenSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <div className="flex min-w-0 flex-col gap-6 md:gap-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
