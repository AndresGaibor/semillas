import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { crearSesionInvitado, iniciarSesionGoogle } from "@/features/auth/auth.api";
import { sessionStorageApi } from "@/shared/api/session";
import { sincronizarSesionAutenticada } from "@/shared/auth/supabase";
import { obtenerMiPerfil, reclamarCuentaInvitada } from "@/features/profile/profile.api";
import { obtenerRedirectGoogle } from "@/features/auth/google-redirect";
import { obtenerRutaPostLogin } from "@/shared/auth/post-login";

type UseLoginPageOptions = {
  redirectTo: string;
};

export function useLoginPage({ redirectTo }: UseLoginPageOptions) {
  const navigate = useNavigate();
  const [tabActivo, setTabActivo] = useState<"social" | "email">("social");

  const guestMutation = useMutation({
    mutationFn: crearSesionInvitado,
    onSuccess(data) {
      sessionStorageApi.setGuestUserId(data.autenticacion.valor);
      navigate({ to: "/onboarding" });
    },
  });

  const googleMutation = useMutation({
    mutationFn: () => iniciarSesionGoogle(obtenerRedirectGoogle(window.location.origin)),
  });

  const handleEmailSuccess = async () => {
    await sincronizarSesionAutenticada();
    if (sessionStorageApi.getGuestUserId()) {
      await reclamarCuentaInvitada().catch(() => undefined);
      sessionStorageApi.clearGuestUserId();
    }
    const perfilRespuesta = await obtenerMiPerfil();
    const rutaPostLogin = obtenerRutaPostLogin(perfilRespuesta.perfil, perfilRespuesta.usuario);
    navigate({ to: redirectTo === "/onboarding" ? rutaPostLogin : redirectTo });
  };

  return {
    tabActivo,
    setTabActivo,
    guestMutation,
    googleMutation,
    handleEmailSuccess,
  };
}
