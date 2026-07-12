import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { randomUUID } from "../../../shared/utils/uuid";
import { responderActividad, obtenerActividad } from "../activities.api";
import { queryClient } from "../../../app/query-client";
import { useNavigate } from "@tanstack/react-router";

export function useActivityPage(activityId: string) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const activityQuery = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => obtenerActividad(activityId)
  });

  const answerMutation = useMutation({
    mutationFn: (selectedOptionId: string) =>
      responderActividad(activityId, {
        evento_id_cliente: randomUUID(),
        opcion_id_seleccionada: selectedOptionId,
        ocurrido_en_cliente: new Date().toISOString(),
        dispositivo_id: "web"
      }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["gamification", "me"] });
    }
  });

  const activity = activityQuery.data;
  const result = answerMutation.data;

  const handleSelectOption = (optionId: string) => {
    if (!result) {
      setSelected(optionId);
      answerMutation.mutate(optionId);
    }
  };

  const handleGoBack = () => {
    navigate({ to: "/app" });
  };

  return {
    activity,
    result,
    resultadoOffline: Boolean(result && "offline" in result && result.offline),
    selected,
    setSelected,
    handleSelectOption,
    handleGoBack,
    activityQuery,
    answerMutation
  };
}
