import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { obtenerTemaAdmin, obtenerPasosAdmin, obtenerActividadesAdmin } from "@/features/admin/admin.api";
import { resolverPortadaTemaAdmin, usePortadasFirmadasAdmin } from "@/features/admin/admin-theme-cover";
import { obtenerEstadoTema } from "@/features/admin/componentes/temas";
import type { Actividad } from "@/shared/api/api";

type UseThemePreviewPageOptions = {
  themeId: string;
};

export function useThemePreviewPage({ themeId }: UseThemePreviewPageOptions) {
  const navigate = useNavigate();

  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => obtenerTemaAdmin(themeId),
  });

  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => obtenerPasosAdmin(themeId),
  });

  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities"],
    queryFn: () => obtenerActividadesAdmin({ tema_id: themeId, limit: 500 }),
  });

  const theme = themeQuery.data;
  const portadasFirmadas = usePortadasFirmadasAdmin(theme ? [theme] : []);
  const portadaUrl = theme
    ? resolverPortadaTemaAdmin({
        titulo: theme.titulo,
        urlFirmada: portadasFirmadas.get(theme.id) ?? null,
      })
    : null;
  const estado = obtenerEstadoTema(theme?.estado ?? "borrador");
  const actividades = (activitiesQuery.data?.actividades ?? []) as unknown as Actividad[];

  const navigateToEdit = () => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId } });
  const navigateToDetalle = () => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId } });
  const navigateBack = () => navigate({ to: "/admin/temas" });

  return {
    themeQuery,
    stepsQuery,
    activitiesQuery,
    theme,
    portadaUrl,
    estado,
    actividades,
    navigateToEdit,
    navigateToDetalle,
    navigateBack,
  };
}
