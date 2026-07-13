import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerTema, obtenerPasos, obtenerActividades } from "@/features/themes/themes.api";
import { obtenerMiPerfil } from "@/features/perfil/profile.api";
import type { EventoProgreso } from "@/shared/api/api";
import { registrarEventosCrecer } from "../services/crecer-progress";
import { playSound } from "@/lib/audio";
import { responderActividad } from "@/features/activities/activities.api";

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
  const actividadesFase = useMemo(() => {
    if (!activitiesQuery.data) return [];
    const conPasoId = activitiesQuery.data.filter(
      (actividad) => actividad.paso_id === pasoActual?.id,
    );
    if (conPasoId.length > 0) return conPasoId;
    const sinPasoId = activitiesQuery.data.filter(
      (actividad) => actividad.paso_id === null || actividad.paso_id === undefined,
    );
    if (sinPasoId.length > 0 && pasoCodigo === "comprobar") {
      return sinPasoId;
    }
    return [];
  }, [activitiesQuery.data, pasoActual?.id, pasoCodigo]);

  const isLoading =
    meQuery.isLoading ||
    themeQuery.isLoading ||
    (!!temaDbId && (stepsQuery.isLoading || activitiesQuery.isLoading));
  const isError =
    meQuery.isError || themeQuery.isError || stepsQuery.isError || activitiesQuery.isError;

  const invalidarProgreso = () => {
    queryClient.invalidateQueries({ queryKey: ["progress"] });
    queryClient.invalidateQueries({ queryKey: ["gamification"] });
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

      setActividadesCompletadas((actuales) => {
        const siguiente = new Set(actuales);
        siguiente.add(actividadId);
        return siguiente;
      });

      const actividad = actividadesFase.find((a) => a.id === actividadId);
      const tieneOpciones = actividad && actividad.opciones && actividad.opciones.length > 0;

      if (!tieneOpciones) {
        try {
          await responderActividad(actividadId, {
            evento_id_cliente: crypto.randomUUID(),
            ocurrido_en_cliente: new Date().toISOString(),
            dispositivo_id: "web",
          });
          invalidarProgreso();
        } catch (error) {
          console.error("Error al registrar actividad completa:", error);
        }
      }
    },
    [actividadesFase, temaDbId, invalidarProgreso],
  );

  const completeStep = useCallback(async () => {
    if (!temaDbId || !pasoActual?.id) return;

    const eventos: EventoProgreso[] = [
      {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "bloque_completado",
        tema_id: temaDbId,
        paso_id: pasoActual.id,
        ocurrido_en_cliente: new Date().toISOString(),
      },
    ];

    if (pasoCodigo === "experimentar") {
      eventos.push({
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "tema_completado",
        tema_id: temaDbId,
        paso_id: pasoActual.id,
        ocurrido_en_cliente: new Date().toISOString(),
      });
    }

    progresoMutation.mutate(eventos);
  }, [pasoActual?.id, progresoMutation, temaDbId, pasoCodigo]);

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
