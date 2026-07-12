import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { obtenerTema, obtenerPasos, obtenerActividades, obtenerUrlPortadaTema } from "../../../features/themes/themes.api";
import { registrarEventoProgreso } from "../../../features/progress/progress.api";
import { obtenerMiPerfil } from "../../../features/profile/profile.api";
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

  const profileQuery = useQuery({
    queryKey: ["perfil-mi"],
    queryFn: obtenerMiPerfil
  });
  const perfil = profileQuery.data?.perfil;
  const usuario = profileQuery.data?.usuario;

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
    mutationFn: registrarEventoProgreso,
    onSuccess: (respuesta) => {
      console.log("Respuesta de registrarEventoProgreso:", respuesta);
      if (!respuesta.duplicado) {
        console.log("¡Evento nuevo! Invalidando cachés para actualizar XP...");
        queryClient.invalidateQueries({ queryKey: ["progress"] });
        queryClient.invalidateQueries({ queryKey: ["perfil-mi"] });
        queryClient.invalidateQueries({ queryKey: ["gamificacion"] });
      } else {
        console.log("El evento ya existía (Farmeo detectado):", respuesta.mensaje);
      }
    },
    onError: (error) => {
      console.error("Error al registrar evento de progreso:", error);
    }
  });

  const eventSentRef = useRef(false);

  useEffect(() => {
    playSound('insignia');

    if (temaDbId && !eventSentRef.current) {
      eventSentRef.current = true;
      const xp_ganado = tema?.xp_recompensa || 0;
      
      const evento = {
        evento_id_cliente: crypto.randomUUID(),
        tipo_evento: "tema_completado",
        tema_id: temaDbId,
        xp_otorgada: xp_ganado,
        ocurrido_en_cliente: new Date().toISOString()
      };
      
      console.log("Enviando evento de tema_completado al backend. Payload:", evento);
      eventMutation.mutate(evento);
    }
  }, [temaDbId, tema?.xp_recompensa, eventMutation]);

  return {
    navigate,
    themeQuery,
    tema,
    portadaQuery,
    stepsQuery,
    activitiesQuery,
    profileQuery,
    perfil,
    usuario,
    pasoActual,
    contenidoPaso,
    actividadesFase,
    isLoading,
    isError,
  };
}
