import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { crearSesionInvitado, iniciarSesionFacebook, iniciarSesionGoogle } from "@/features/auth/auth.api";
import { sessionStorageApi } from "@/shared/api/session";
import { sincronizarSesionAutenticada } from "@/shared/auth/supabase";
import { obtenerMiPerfil, reclamarCuentaInvitada } from "@/features/profile/profile.api";
import { esFacebookPermitidoEnOrigen, obtenerRedirectGoogle, obtenerRedirectFacebook } from "@/features/auth/social-login";
import { obtenerRutaPostLogin } from "@/shared/auth/post-login";

type UseLoginPageOptions = {
  redirectTo: string;
};

export function useLoginPage({ redirectTo }: UseLoginPageOptions) {
  const navigate = useNavigate();
  const [tabActivo, setTabActivo] = useState<"social" | "email">("social");
  const facebookDisponible = esFacebookPermitidoEnOrigen(window.location.origin);

  const guestMutation = useMutation({
    mutationFn: crearSesionInvitado,
    onSuccess(data) {
      sessionStorageApi.setGuestUserId(data.autenticacion.valor);
      sessionStorageApi.setGuestToken(data.autenticacion.token);
      navigate({ to: "/onboarding" });
    },
  });

  const googleMutation = useMutation({
    mutationFn: () => iniciarSesionGoogle(obtenerRedirectGoogle(window.location.origin)),
  });

  const facebookMutation = useMutation({
    mutationFn: () => iniciarSesionFacebook(obtenerRedirectFacebook(window.location.origin)),
  });

  const handleEmailSuccess = async () => {
    await sincronizarSesionAutenticada();
    if (sessionStorageApi.getGuestUserId()) {
      await reclamarCuentaInvitada().catch(() => undefined);
      sessionStorageApi.clearGuestSession();
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
    facebookMutation,
    handleEmailSuccess,
    facebookDisponible,
  };
}
