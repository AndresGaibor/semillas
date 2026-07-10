import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { obtenerTemaAdmin, obtenerPasosAdmin } from "@/features/admin/admin.api";
import { obtenerActividades, obtenerUrlPortadaTema } from "@/features/themes/themes.api";
import { obtenerEstadoTema } from "@/features/admin/componentes/theme-view.utils";
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
    queryFn: () => obtenerActividades(themeId),
  });

  const portadaQuery = useQuery({
    queryKey: ["tema-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: Boolean(themeQuery.data?.portada_recurso_id),
    staleTime: 3 * 60 * 1000,
  });

  const theme = themeQuery.data;
  const portadaUrl = portadaQuery.data?.url ?? theme?.portada_recurso?.url_publica ?? null;
  const estado = obtenerEstadoTema(theme?.estado ?? "borrador");
  const actividades = (activitiesQuery.data ?? []) as Actividad[];

  const navigateToEdit = () => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId } });
  const navigateToDetalle = () => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId } });
  const navigateBack = () => navigate({ to: "/admin/temas" });

  return {
    themeQuery,
    stepsQuery,
    activitiesQuery,
    portadaQuery,
    theme,
    portadaUrl,
    estado,
    actividades,
    navigateToEdit,
    navigateToDetalle,
    navigateBack,
  };
}
