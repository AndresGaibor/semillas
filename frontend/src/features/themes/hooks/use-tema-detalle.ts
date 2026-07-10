import { useQuery } from "@tanstack/react-query";
import { obtenerTema, obtenerPasos, obtenerActividades, obtenerUrlPortadaTema } from "../themes.api";
import { obtenerMiPerfil } from "../../profile/profile.api";
import { obtenerMiProgreso } from "../../progress/progress.api";
import { playSound } from "../../../lib/audio";

export function useTemaDetalle(themeId: string) {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: obtenerMiPerfil,
  });

  const themeQuery = useQuery({
    queryKey: ["theme", themeId],
    queryFn: () => obtenerTema(themeId),
  });

  const portadaQuery = useQuery({
    queryKey: ["theme-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: !!themeQuery.data?.portada_recurso?.id,
    staleTime: 3 * 60 * 1000,
  });

  const stepsQuery = useQuery({
    queryKey: ["theme", themeId, "steps", meQuery.data?.perfil?.grupo_edad_id],
    queryFn: () => obtenerPasos(themeId, meQuery.data?.perfil?.grupo_edad_id ?? undefined),
    enabled: !!meQuery.data,
  });

  const activitiesQuery = useQuery({
    queryKey: ["theme", themeId, "activities", meQuery.data?.perfil?.grupo_edad_id],
    queryFn: () => obtenerActividades(themeId, meQuery.data?.perfil?.grupo_edad_id ?? undefined),
    enabled: !!meQuery.data,
  });

  const progressQuery = useQuery({
    queryKey: ["progress", themeId],
    queryFn: obtenerMiProgreso,
  });

  const firstActivity = activitiesQuery.data?.[0];
  const theme = themeQuery.data;
  const temaDbId = theme?.id;

  const progresoActual = progressQuery.data?.progresos_tema?.find(
    (p) => p.tema_id === temaDbId,
  );
  const progresoReal = progresoActual ? progresoActual.porcentaje : 0;

  const handleIniciarClick = () => {
    playSound("iniciar");
  };

  return {
    meQuery,
    themeQuery,
    portadaQuery,
    stepsQuery,
    activitiesQuery,
    progressQuery,
    firstActivity,
    theme,
    temaDbId,
    progresoActual,
    progresoReal,
    handleIniciarClick,
  };
}
