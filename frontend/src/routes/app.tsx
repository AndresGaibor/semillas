import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { hasSession } from "../shared/api/auth-guard";
import { PantallaErrorRuta } from "@/componentes/estados/pantalla-error-ruta";
import { BottomNav } from "@/componentes/ui/bottom-nav";
import { AppSidebar } from "../shared/layout/app-sidebar";
import { AppUserHeader } from "../shared/layout/app-user-header";
import { useAppLayout } from "../shared/layout/hooks/use-app-layout";
import { resolverAvatar } from "@/shared/constants/avatares";
import { cerrarSesionAutenticada } from "@/shared/auth/supabase";
import { sessionStorageApi } from "@/shared/api/session";
import {
  consumirConflictoVinculacion,
  descartarConflictoVinculacion,
  eventoConflictoVinculacion,
} from "@/shared/auth/conflicto-vinculacion";
import { router } from "@/router";
import { DialogoConflictoVinculacion } from "@/componentes/ui/dialogo-conflicto-vinculacion";
import "./app.css";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!hasSession()) throw redirect({ to: "/login", search: { redirect: "/app" } });
  },
  errorComponent: PantallaErrorRuta,
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
    esModoLeccion,
    esDetalleTema,
    logrosBadge,
  } = useAppLayout();

  const [mensajeConflicto, setMensajeConflicto] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("app-theme");
    if (saved === "app-dark" || saved === "app-light") {
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "app-light");
    }
  }, []);

  useEffect(() => {
    const inicial = consumirConflictoVinculacion();
    if (inicial) {
      setMensajeConflicto(inicial);
    }
    const handler = () => {
      const siguiente = consumirConflictoVinculacion();
      if (siguiente) {
        setMensajeConflicto(siguiente);
      }
    };
    window.addEventListener(eventoConflictoVinculacion(), handler);
    return () => {
      window.removeEventListener(eventoConflictoVinculacion(), handler);
    };
  }, []);

  const continuarComoInvitado = async () => {
    descartarConflictoVinculacion();
    setMensajeConflicto(null);
    sessionStorageApi.clearAccessToken();
    try {
      await cerrarSesionAutenticada();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Cerrar sesion OAuth durante conflicto fallo:", error);
      }
    }
    if (typeof window !== "undefined") {
      window.location.assign("/app");
    }
  };

  const cambiarCuenta = async () => {
    descartarConflictoVinculacion();
    setMensajeConflicto(null);
    sessionStorageApi.clearGuestSession();
    sessionStorageApi.clearAccessToken();
    try {
      await cerrarSesionAutenticada();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Cerrar sesion OAuth para cambiar cuenta fallo:", error);
      }
    }
    await router.navigate({ to: "/login", search: { redirect: "/app" } });
  };

  const avatarGuardado = meQuery.data?.perfil?.url_avatar || meQuery.data?.perfil?.clave_avatar || "1";
  const cuenta = {
    nombre: meQuery.data?.perfil?.apodo || meQuery.data?.usuario?.nombre_visible || "Semillero",
    nivelTexto:
      meQuery.data?.usuario?.proveedor === "invitado"
        ? "Invitado"
        : meQuery.data?.usuario?.correo || "Cuenta registrada",
    avatarUrl: resolverAvatar(avatarGuardado),
  };

  return (
    <>
      <div className={`app-shell app-shell--app ${esModoLeccion || esDetalleTema ? "app-shell--lesson" : ""}`}>
        {!esModoLeccion && !esDetalleTema ? (
          <AppSidebar
            activePage={path}
            isOffline={isOffline}
            isOpen={false}
            onClose={() => undefined}
            onLogout={handleLogout}
            variant="app"
            logrosBadge={logrosBadge}
          />
        ) : null}

        <div className="app-shell__workspace">
          {!esModoLeccion && !esDetalleTema ? (
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
          ) : null}

          <main className="app-shell__main app-shell__main--app">
            <div className="app-shell__content app-shell__content--app" data-path={path}>
              <Outlet />
            </div>
          </main>

          {!esModoLeccion ? (
            <nav className="app-shell__bottom-nav" aria-label="Navegación principal móvil">
              <BottomNav opciones={opcionesBottomNav} activo={activoMovil} onCambiar={navigateTo} />
            </nav>
          ) : null}
        </div>
      </div>

      {mensajeConflicto ? (
        <DialogoConflictoVinculacion
          mensaje={mensajeConflicto}
          onContinuarInvitado={continuarComoInvitado}
          onCambiarCuenta={cambiarCuenta}
        />
      ) : null}
    </>
  );
}
