import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerTema, obtenerPasos, obtenerActividades } from "@/features/themes/themes.api";
import { obtenerMiPerfil } from "@/features/profile/profile.api";
import type { EventoProgreso } from "@/shared/api/api";
import { registrarEventosCrecer } from "../services/crecer-progress";

type UseCrecerFaseOptions = {
  themeId: string;
  pasoCodigo: string;
};

export function useCrecerFase({ themeId, pasoCodigo }: UseCrecerFaseOptions) {
  const queryClient = useQueryClient();
  const eventSentRef = useRef(false);
  const [actividadesCompletadas, setActividadesCompletadas] = useState<Set<string>>(
    () => new Set(),
  );

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: obtenerMiPerfil,
  });

  const themeQuery = useQuery({
    queryKey: ["theme", themeId],
    queryFn: () => obtenerTema(themeId),
  });
  const temaDbId = themeQuery.data?.id;
  const grupoEdadId = meQuery.data?.perfil?.grupo_edad_id ?? undefined;

  const stepsQuery = useQuery({
    queryKey: ["theme", temaDbId, "steps", grupoEdadId],
    queryFn: () => obtenerPasos(temaDbId!, grupoEdadId),
    enabled: !!temaDbId && meQuery.isSuccess,
  });

  const activitiesQuery = useQuery({
    queryKey: ["theme", temaDbId, "activities", grupoEdadId],
    queryFn: () => obtenerActividades(temaDbId!, grupoEdadId),
    enabled: !!temaDbId && meQuery.isSuccess,
  });

  const pasoActual = stepsQuery.data?.find((paso) => paso.tipo_paso?.codigo === pasoCodigo);
  const contenidoPaso = pasoActual?.contenidos?.[0];
  const actividadesFase = useMemo(
    () => activitiesQuery.data?.filter((actividad) => actividad.paso_id === pasoActual?.id) ?? [],
    [activitiesQuery.data, pasoActual?.id],
  );

  const isLoading =
    meQuery.isLoading ||
    themeQuery.isLoading ||
    (!!temaDbId && (stepsQuery.isLoading || activitiesQuery.isLoading));
  const isError =
    meQuery.isError || themeQuery.isError || stepsQuery.isError || activitiesQuery.isError;

  const invalidarProgreso = () => {
    queryClient.invalidateQueries({ queryKey: ["progress"] });
    queryClient.invalidateQueries({ queryKey: ["sync"] });
  };

  const inicioMutation = useMutation({
    mutationFn: registrarEventosCrecer,
    onSuccess: invalidarProgreso,
  });

  const progresoMutation = useMutation({
    mutationFn: registrarEventosCrecer,
    onSuccess: invalidarProgreso,
  });

  useEffect(() => {
    if (
      isLoading ||
      isError ||
      !temaDbId ||
      !pasoActual?.id ||
      eventSentRef.current
    ) {
      return;
    }

    eventSentRef.current = true;
    const ocurridoEn = new Date().toISOString();
    const eventos: EventoProgreso[] = [
      ...(pasoCodigo === "conectar"
        ? [
            {
              evento_id_cliente: crypto.randomUUID(),
              tipo_evento: "tema_iniciado" as const,
              tema_id: temaDbId,
              ocurrido_en_cliente: ocurridoEn,
            },
          ]
        : []),
      {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "bloque_iniciado",
        tema_id: temaDbId,
        paso_id: pasoActual.id,
        ocurrido_en_cliente: ocurridoEn,
      },
    ];

    // El inicio de fase no debe bloquear la acción de continuar.
    inicioMutation.mutate(eventos);
  }, [isLoading, isError, temaDbId, pasoActual?.id, pasoCodigo]);

  const handleActivityComplete = useCallback(
    async (actividadId: string, puntaje?: number) => {
      if (!temaDbId) return;

      await progresoMutation.mutateAsync([
        {
          evento_id_cliente: crypto.randomUUID(),
          tipo_evento: "actividad_completada",
          tema_id: temaDbId,
          paso_id: pasoActual?.id,
          actividad_id: actividadId,
          puntaje,
          ocurrido_en_cliente: new Date().toISOString(),
        },
      ]);

      setActividadesCompletadas((actuales) => {
        const siguiente = new Set(actuales);
        siguiente.add(actividadId);
        return siguiente;
      });
    },
    [pasoActual?.id, progresoMutation, temaDbId],
  );

  const completeStep = useCallback(async () => {
    if (!temaDbId || !pasoActual?.id) return;

    await progresoMutation.mutateAsync([
      {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "bloque_completado",
        tema_id: temaDbId,
        paso_id: pasoActual.id,
        ocurrido_en_cliente: new Date().toISOString(),
      },
    ]);
  }, [pasoActual?.id, progresoMutation, temaDbId]);

  return {
    meQuery,
    themeQuery,
    stepsQuery,
    activitiesQuery,
    temaDbId,
    pasoActual,
    contenidoPaso,
    actividadesFase,
    actividadesCompletadas,
    isLoading,
    isError,
    isSavingProgress: progresoMutation.isPending,
    progressError: progresoMutation.error,
    handleActivityComplete,
    completeStep,
  };
}
