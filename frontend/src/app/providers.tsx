import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { queryClient } from "./query-client";
import { router } from "../router";
import { escucharCambiosAutenticacion, sincronizarSesionAutenticada } from "../shared/auth/supabase";
import { reclamarCuentaInvitada } from "../features/profile/profile.api";
import { sessionStorageApi } from "../shared/api/session";
import { guardarNombreSugeridoDeGoogle } from "../shared/auth/google-profile";
import { obtenerRutaPostLogin } from "../shared/auth/post-login";
import { obtenerMiPerfil } from "../features/profile/profile.api";

async function vincularCuentaPendiente() {
  const guestUserId = sessionStorageApi.getGuestUserId();
  const accessToken = sessionStorageApi.getAccessToken();

  if (!guestUserId || !accessToken) {
    return;
  }

  await reclamarCuentaInvitada();
  sessionStorageApi.clearGuestUserId();
  await queryClient.invalidateQueries();
}

async function redirigirSegunOnboarding() {
  const perfilRespuesta = await obtenerMiPerfil();
  const ruta = obtenerRutaPostLogin(perfilRespuesta.perfil, perfilRespuesta.usuario);

  if (window.location.pathname !== ruta) {
    await router.navigate({ to: ruta as never, replace: true });
  }
}

function AuthBootstrap({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const detenerEscucha = escucharCambiosAutenticacion((session) => {
      guardarNombreSugeridoDeGoogle(session);
      void vincularCuentaPendiente().catch(() => undefined);
    });

    sincronizarSesionAutenticada()
      .then((session) => {
        guardarNombreSugeridoDeGoogle(session);

        if (!session) {
          return undefined;
        }

        return vincularCuentaPendiente()
          .then(() => redirigirSegunOnboarding())
          .catch(() => undefined);
      })
      .catch(() => undefined)
      .finally(() => setListo(true));

    return () => {
      detenerEscucha();
    };
  }, []);

  if (!listo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Preparando sesión...
      </div>
    );
  }

  return children;
}

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
