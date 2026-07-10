import { useMemo } from "react";
import type { Perfil, Usuario } from "../../../shared/api/api";
import { resolverAvatar } from "../../../shared/constants/avatares";
import type { GamificacionMiRespuesta, ProgresoMiRespuesta } from "../profile.api";

export type { PerfilDashboardProps } from "../profile-dashboard";

export type UseProfileDashboardOptions = {
  usuario: Usuario | undefined;
  perfil: Perfil | null | undefined;
  gamificacion: GamificacionMiRespuesta | undefined;
  progreso: ProgresoMiRespuesta | undefined;
  onVincularGoogle: () => void;
  onVincularCorreo: () => void;
};

function formatearProveedor(proveedor: string) {
  if (proveedor === "invitado") return "Invitado";
  if (proveedor === "google") return "Google";
  return "Correo";
}

function contarCompletados(progreso: ProgresoMiRespuesta | undefined) {
  return {
    temas: progreso?.progresos_tema.filter((tema: { estado: string }) => tema.estado === "completado" || tema.estado === "completado_total").length ?? 0,
    actividades: progreso?.progresos_actividad.filter((actividad: { completado: boolean }) => actividad.completado).length ?? 0,
  };
}

export function useProfileDashboard({
  usuario,
  perfil,
  gamificacion,
  progreso,
}: UseProfileDashboardOptions) {
  const nivel = gamificacion?.nivel;
  const logros = gamificacion?.logros ?? [];

  const completados = useMemo(() => contarCompletados(progreso), [progreso]);
  const esInvitado = usuario?.proveedor === "invitado";
  const proveedorLabel = useMemo(() => formatearProveedor(usuario?.proveedor ?? "invitado"), [usuario?.proveedor]);
  const avatarUrl = perfil?.url_avatar ?? resolverAvatar("1");
  const nombreVisible = perfil?.apodo ?? usuario?.nombre_visible ?? "Semillero";

  return {
    nivel,
    logros,
    completados,
    esInvitado,
    proveedorLabel,
    avatarUrl,
    nombreVisible,
  };
}
