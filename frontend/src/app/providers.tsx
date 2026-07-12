import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { queryClient } from "./query-client";
import { router } from "../router";
import { escucharCambiosAutenticacion, sincronizarSesionAutenticada } from "../shared/auth/supabase";
import { reclamarCuentaInvitada } from "../features/perfil/profile.api";
import { sessionStorageApi } from "../shared/api/session";
import { guardarNombreSugeridoDeGoogle } from "../shared/auth/google-profile";
import { obtenerRutaPostLogin } from "../shared/auth/post-login";
import { obtenerMiPerfil } from "../features/perfil/profile.api";
import { useAutoSync } from "@/lib/offline";
import { OfflineBanner } from "@/componentes/ui/sync-status-badge";
import { SugerenciaInstalacionPWA } from "@/componentes/ui/sugerencia-instalacion-pwa";
import { PantallaCargaSesion } from "@/componentes/estados/pantalla-carga-sesion";
import { PwaLifecycle } from "@/componentes/ui/pwa-lifecycle";
import { clasificarErrorVinculacion, resolverRedireccionBootstrap } from "./bootstrap";
import { ThemeProvider, useTheme } from "@/shared/theme";
import { publicarConflictoVinculacion } from "@/shared/auth/conflicto-vinculacion";

async function vincularCuentaPendiente() {
  const guestUserId = sessionStorageApi.getGuestUserId();
  const accessToken = sessionStorageApi.getAccessToken();

  if (!guestUserId || !accessToken) {
    return;
  }

  await reclamarCuentaInvitada();
  sessionStorageApi.clearGuestSession();
  await queryClient.invalidateQueries();
}

async function redirigirSegunOnboarding() {
  const perfilRespuesta = await obtenerMiPerfil();
  const ruta = obtenerRutaPostLogin(perfilRespuesta.perfil, perfilRespuesta.usuario);

  const redireccion = resolverRedireccionBootstrap(window.location.pathname, ruta);
  if (redireccion) {
    await router.navigate({ to: redireccion as never, replace: true });
  }
}

function AuthBootstrap({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);
  useAutoSync(true);

  useEffect(() => {
    const contraste = localStorage.getItem("semillas-pref-contraste") === "alto";
    document.documentElement.classList.toggle("alto-contraste", contraste);
  }, []);

  useEffect(() => {
    async function intentarVinculacion() {
      try {
        await vincularCuentaPendiente();
        await redirigirSegunOnboarding();
      } catch (error) {
        const resultado = clasificarErrorVinculacion(error);
        if (resultado.tipo === "conflicto") {
          publicarConflictoVinculacion(resultado.mensaje);
          return;
        }
        if (import.meta.env.DEV) {
          console.warn("Bootstrap: vinculacion no completada", error);
        }
      }
    }

    const detenerEscucha = escucharCambiosAutenticacion((session) => {
      guardarNombreSugeridoDeGoogle(session);
      void intentarVinculacion();
    });

    sincronizarSesionAutenticada()
      .then((session) => {
        guardarNombreSugeridoDeGoogle(session);

        if (!session) {
          return undefined;
        }

        return intentarVinculacion();
      })
      .catch(() => undefined)
      .finally(() => setListo(true));

    return () => {
      detenerEscucha();
    };
  }, []);

  if (!listo) {
    return <PantallaCargaSesion />;
  }

  return (
    <>
      <OfflineBanner />
      <SugerenciaInstalacionPWA />
      {children}
    </>
  );
}

function ThemeToaster() {
  const { tema } = useTheme();
  return <Toaster position="top-right" richColors theme={tema === "oscuro" ? "dark" : "light"} />;
}

export function AppProviders() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <PwaLifecycle />
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
        <ThemeToaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
