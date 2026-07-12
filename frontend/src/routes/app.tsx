import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { hasSession } from "../shared/api/auth-guard";
import { BottomNav } from "@/componentes/ui/bottom-nav";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppUserHeader } from "../shared/layout/app-user-header";
import { useAppLayout } from "../shared/layout/hooks/use-app-layout";
import { MAPA_AVATARES } from "@/shared/constants/avatares";
import "./app.css";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!hasSession()) throw redirect({ to: "/login", search: { redirect: "/app" } });
  },
  component: AppLayout,
});

function AppLayout() {
  const {
    isOffline,
    handleLogout,
    opcionesBottomNav,
    activoMovil,
    navigateTo,
    pageHeader,
    path,
    meQuery,
    esInicio,
  } = useAppLayout();

  const avatarGuardado = meQuery.data?.perfil?.url_avatar || meQuery.data?.perfil?.clave_avatar || "1";
  const cuenta = {
    nombre: meQuery.data?.perfil?.apodo || meQuery.data?.usuario?.nombre_visible || "Semillero",
    nivelTexto:
      meQuery.data?.usuario?.proveedor === "invitado"
        ? "Invitado"
        : meQuery.data?.usuario?.correo || "Cuenta registrada",
    avatarUrl: MAPA_AVATARES[avatarGuardado] || avatarGuardado || MAPA_AVATARES["1"] || "",
  };

  return (
    <div className="app-shell app-shell--app">
      <AppSidebar
        activePage={path}
        isOffline={isOffline}
        isOpen={false}
        onClose={() => undefined}
        onLogout={handleLogout}
        variant="app"
      />

      <div className="app-shell__workspace">
        <AppUserHeader
          title={pageHeader.titulo}
          subtitle={pageHeader.subtitulo}
          nombreVisible={cuenta.nombre}
          nivelTexto={cuenta.nivelTexto}
          avatarUrl={cuenta.avatarUrl}
          onLogout={handleLogout}
          isOffline={isOffline}
          esInicio={esInicio}
        />

        <main className="app-shell__main app-shell__main--app">
          <div className="app-shell__content app-shell__content--app" data-path={path}>
            <Outlet />
          </div>
        </main>

        <nav className="app-shell__bottom-nav" aria-label="Navegación principal móvil">
          <BottomNav opciones={opcionesBottomNav} activo={activoMovil} onCambiar={navigateTo} />
        </nav>
      </div>
    </div>
  );
}
