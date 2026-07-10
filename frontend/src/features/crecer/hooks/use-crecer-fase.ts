import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { obtenerTema, obtenerPasos, obtenerActividades } from "@/features/themes/themes.api";
import { enviarEventosProgreso } from "@/features/progress/progress.api";
import type { EventoProgreso } from "@/shared/api/api";

type UseCrecerFaseOptions = {
  themeId: string;
  pasoCodigo: string;
};

export function useCrecerFase({ themeId, pasoCodigo }: UseCrecerFaseOptions) {
  const navigate = useNavigate();

  const themeQuery = useQuery({
    queryKey: ["theme", themeId],
    queryFn: () => obtenerTema(themeId),
  });
  const temaDbId = themeQuery.data?.id;

  const stepsQuery = useQuery({
    queryKey: ["theme", temaDbId, "steps"],
    queryFn: () => obtenerPasos(temaDbId!),
    enabled: !!temaDbId,
  });

  const activitiesQuery = useQuery({
    queryKey: ["theme", temaDbId, "activities"],
    queryFn: () => obtenerActividades(temaDbId!),
    enabled: !!temaDbId,
  });

  const pasoActual = stepsQuery.data?.find((p) => p.tipo_paso?.codigo === pasoCodigo);
  const contenidoPaso = pasoActual?.contenidos?.[0];
  const actividadesFase = activitiesQuery.data?.filter((a) => a.paso_id === pasoActual?.id) || [];

  const isLoading = themeQuery.isLoading || (!!temaDbId && (stepsQuery.isLoading || activitiesQuery.isLoading));
  const isError = themeQuery.isError || stepsQuery.isError || activitiesQuery.isError;

  const queryClient = useQueryClient();
  const eventMutation = useMutation({
    mutationFn: enviarEventosProgreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });

  const eventSentRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isError && temaDbId && !eventSentRef.current) {
      eventSentRef.current = true;
      const evento: EventoProgreso = {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "tema_iniciado",
        tema_id: temaDbId,
        ocurrido_en_cliente: new Date().toISOString(),
      };
      eventMutation.mutate([evento]);
    }
  }, [isLoading, isError, temaDbId, eventMutation]);

  const navigateTo = (path: string) => navigate({ to: path, params: { themeId } });

  return {
    themeQuery,
    stepsQuery,
    activitiesQuery,
    pasoActual,
    contenidoPaso,
    actividadesFase,
    isLoading,
    isError,
    navigateTo,
  };
}
