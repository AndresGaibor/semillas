import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { obtenerTema, obtenerPasos, obtenerActividades, obtenerUrlPortadaTema } from "../../../features/themes/themes.api";
import { enviarEventosProgreso } from "../../../features/progress/progress.api";
import { playSound } from "../../../lib/audio";
import type { EventoProgreso } from "../../../shared/api/api";

interface UseRecompensarPageOptions {
  themeId: string;
}

export function useRecompensarPage({ themeId }: UseRecompensarPageOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const themeQuery = useQuery({
    queryKey: ["theme", themeId],
    queryFn: () => obtenerTema(themeId)
  });
  const tema = themeQuery.data;
  const temaDbId = tema?.id;

  const portadaQuery = useQuery({
    queryKey: ["theme-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: !!tema?.portada_recurso?.id,
    staleTime: 3 * 60 * 1000,
  });

  const stepsQuery = useQuery({
    queryKey: ["theme", temaDbId, "steps"],
    queryFn: () => obtenerPasos(temaDbId!),
    enabled: !!temaDbId
  });

  const activitiesQuery = useQuery({
    queryKey: ["theme", temaDbId, "activities"],
    queryFn: () => obtenerActividades(temaDbId!),
    enabled: !!temaDbId
  });

  const pasoActual = stepsQuery.data?.find((p) => p.tipo_paso?.codigo === 'recompensar');
  const contenidoPaso = pasoActual?.contenidos?.[0];
  const actividadesFase = activitiesQuery.data?.filter((a) => a.paso_id === pasoActual?.id) || [];

  const isLoading = themeQuery.isLoading || (!!temaDbId && (stepsQuery.isLoading || activitiesQuery.isLoading));
  const isError = themeQuery.isError || stepsQuery.isError || activitiesQuery.isError;

  const eventMutation = useMutation({
    mutationFn: enviarEventosProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  });

  const eventSentRef = useRef(false);

  useEffect(() => {
    playSound('insignia');

    if (temaDbId && !eventSentRef.current) {
      eventSentRef.current = true;
      const evento: EventoProgreso = {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "tema_completado",
        tema_id: temaDbId,
        xp_otorgada: tema?.xp_recompensa || 0,
        ocurrido_en_cliente: new Date().toISOString()
      };
      eventMutation.mutate([evento]);
    }
  }, [temaDbId, tema?.xp_recompensa, eventMutation]);

  return {
    navigate,
    themeQuery,
    tema,
    portadaQuery,
    stepsQuery,
    activitiesQuery,
    pasoActual,
    contenidoPaso,
    actividadesFase,
    isLoading,
    isError,
  };
}
