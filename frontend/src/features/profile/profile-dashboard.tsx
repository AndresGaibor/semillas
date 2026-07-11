import type { Perfil, Usuario } from "@/shared/api/api";
import type { GamificacionMiRespuesta, ProgresoMiRespuesta } from "./profile.api";
import { useProfileDashboard } from "./hooks/use-profile-dashboard";
import { SeccionEncabezado } from "./componentes/seccion-encabezado";
import { SeccionMetricas } from "./componentes/seccion-metricas";
import { SeccionLogros } from "./componentes/seccion-logros";
import { SeccionCuenta } from "./componentes/seccion-cuenta";
import { SeccionPreferencias } from "./componentes/seccion-preferencias";

export type PerfilDashboardProps = {
  usuario: Usuario | undefined;
  perfil: Perfil | null | undefined;
  gamificacion: GamificacionMiRespuesta | undefined;
  progreso: ProgresoMiRespuesta | undefined;
  onVincularGoogle: () => void;
  onVincularCorreo: () => void;
};

export function ProfileDashboard({
  usuario,
  perfil,
  gamificacion,
  progreso,
  onVincularGoogle,
  onVincularCorreo,
}: PerfilDashboardProps) {
  const {
    nivel,
    logros,
    completados,
    esInvitado,
    proveedorLabel,
    avatarUrl,
    nombreVisible,
  } = useProfileDashboard({
    usuario,
    perfil,
    gamificacion,
    progreso,
    onVincularGoogle,
    onVincularCorreo,
  });

  return (
    <div className="grid grid-cols-1 gap-6 text-left lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <SeccionEncabezado
          usuario={usuario}
          perfil={perfil}
          esInvitado={esInvitado}
          avatarUrl={avatarUrl}
          nombreVisible={nombreVisible}
          proveedorLabel={proveedorLabel}
        />

        <SeccionMetricas
          gamificacion={gamificacion}
          progreso={progreso}
          completados={completados}
        />

        <SeccionLogros
          logros={logros}
          totalActividades={completados.actividades}
        />
      </div>

      <aside className="space-y-6">
        <SeccionCuenta
          esInvitado={esInvitado}
          onVincularGoogle={onVincularGoogle}
          onVincularCorreo={onVincularCorreo}
        />

        <SeccionPreferencias perfil={perfil} usuario={usuario} />
      </aside>
    </div>
  );
}
