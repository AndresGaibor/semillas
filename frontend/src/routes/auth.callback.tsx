import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { obtenerMiPerfil } from "../features/perfil/profile.api";
import { obtenerRutaPostLogin } from "../shared/auth/post-login";
import { sincronizarSesionAutenticada } from "../shared/auth/supabase";
import { queryClient } from "../app/query-client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;

    const resolverRedireccion = async () => {
      try {
        await sincronizarSesionAutenticada();
        const respuestaPerfil = await queryClient.ensureQueryData({
          queryKey: ["me"],
          queryFn: obtenerMiPerfil,
        });
        const destino = obtenerRutaPostLogin(respuestaPerfil.perfil, respuestaPerfil.usuario);

        if (activo) {
          navigate({ to: destino, replace: true });
        }
      } catch {
        if (activo) {
          navigate({ to: "/login", search: { redirect: "/app" }, replace: true });
        }
      }
    };

    void resolverRedireccion();

    return () => {
      activo = false;
    };
  }, [navigate]);

  return <div aria-live="polite">Procesando inicio de sesión...</div>;
}
