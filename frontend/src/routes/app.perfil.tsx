import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { obtenerMiGamificacion, obtenerMiPerfil, obtenerMiProgreso } from "../features/profile/profile.api";
import { ProfileDashboard } from "../features/profile/profile-dashboard";
import { iniciarSesionGoogle, vincularGoogle } from "../shared/auth/supabase";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/app/perfil")({
  component: ProfilePage
});

function ProfilePage() {
  const meQuery = useQuery({ queryKey: ["perfil", "me"], queryFn: obtenerMiPerfil });
  const gamificacionQuery = useQuery({ queryKey: ["perfil", "gamificacion"], queryFn: obtenerMiGamificacion });
  const progresoQuery = useQuery({ queryKey: ["perfil", "progreso"], queryFn: obtenerMiProgreso });

  const perfil = meQuery.data?.perfil;
  const usuario = meQuery.data?.usuario;
  const estaCargando = meQuery.isLoading || gamificacionQuery.isLoading || progresoQuery.isLoading;
  const esInvitado = usuario?.proveedor === "invitado";

  async function linkGoogle() {
    if (esInvitado) {
      await iniciarSesionGoogle(`${window.location.origin}/app/perfil`);
      return;
    }

    await vincularGoogle();
  }

  function linkCorreo() {
    window.location.href = `/login?redirect=${encodeURIComponent("/app/perfil")}`;
  }

  if (estaCargando) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-[#2e9e5b]" size={24} />
      </div>
    );
  }

  return (
    <div>
      <ProfileDashboard
        usuario={usuario}
        perfil={perfil}
        gamificacion={gamificacionQuery.data}
        progreso={progresoQuery.data}
        onVincularGoogle={() => {
          void linkGoogle().catch(() => undefined);
        }}
        onVincularCorreo={linkCorreo}
      />
    </div>
  );
}
