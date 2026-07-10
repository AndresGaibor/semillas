import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { obtenerPasosAdmin, guardarParlante, obtenerTemaAdmin } from "../../admin/admin.api";
import { obtenerGruposEdad, obtenerPasosCrecer } from "../../catalog/catalog.api";
import { obtenerUrlPortadaTema } from "../../themes/themes.api";
import { obtenerEstadoTema } from "../../admin/componentes/theme-view.utils";

interface UseThemeCrecerPageProps {
  themeId: string;
}

export function useThemeCrecerPage({ themeId }: UseThemeCrecerPageProps) {
  const navigate = useNavigate();

  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeStepCode, setActiveStepCode] = useState("conectar");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [shortInstruction, setShortInstruction] = useState("");

  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => obtenerTemaAdmin(themeId),
  });

  const portadaQuery = useQuery({
    queryKey: ["tema-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: Boolean(themeQuery.data?.portada_recurso_id),
    staleTime: 3 * 60 * 1000,
  });

  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => obtenerPasosAdmin(themeId),
  });

  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });
  const crecerStepsQuery = useQuery({ queryKey: ["catalog", "crecer-steps"], queryFn: obtenerPasosCrecer });

  const theme = themeQuery.data;
  const portadaUrl = portadaQuery.data?.url ?? theme?.portada_recurso?.url_publica ?? null;
  const estado = obtenerEstadoTema(theme?.estado ?? "borrador");

  const selectedAgeGroup = useMemo(
    () => ageGroupsQuery.data?.find((ag) => ag.id === selectedAgeGroupId) ?? null,
    [ageGroupsQuery.data, selectedAgeGroupId]
  );

  const activeStep = crecerStepsQuery.data?.find((s) => s.codigo === activeStepCode);
  const activeStepContent = useMemo(() => {
    const step = stepsQuery.data?.find((s) => s.tipo_paso?.codigo === activeStepCode);
    if (!selectedAgeGroupId || !step) return null;
    return step.contenidos?.find((c) => c.grupo_edad_id === selectedAgeGroupId) ?? null;
  }, [stepsQuery.data, activeStepCode, selectedAgeGroupId]);

  useEffect(() => {
    if (activeStepContent) {
      setTitle(activeStepContent.titulo ?? "");
      setBody(activeStepContent.cuerpo);
      setShortInstruction(activeStepContent.instruccion_corta ?? "");
    } else if (selectedAgeGroupId) {
      setTitle("");
      setBody("");
      setShortInstruction("");
    }
  }, [activeStepContent, activeStepCode, selectedAgeGroupId]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const stepType = crecerStepsQuery.data?.find((s) => s.codigo === activeStepCode);
      if (!stepType || !selectedAgeGroupId) throw new Error("Faltan datos");
      return guardarParlante(themeId, {
        tipo_paso_id: stepType.id,
        grupo_edad_id: selectedAgeGroupId,
        titulo: title || stepType.nombre,
        cuerpo: body || "Contenido pendiente...",
        instruccion_corta: shortInstruction || undefined,
      });
    },
    onSuccess: () => stepsQuery.refetch(),
  });

  const pasos = crecerStepsQuery.data ?? [];
  const totalPasos = pasos.length || 6;
  const pasosCompletos = pasos.filter((step) =>
    selectedAgeGroupId
      ? stepsQuery.data?.some(
          (contentStep) =>
            contentStep.tipo_paso?.codigo === step.codigo &&
            contentStep.contenidos?.some((content) => content.grupo_edad_id === selectedAgeGroupId && content.cuerpo && content.cuerpo !== "Contenido pendiente...")
        )
      : false
  ).length;
  const progreso = selectedAgeGroupId ? Math.round((pasosCompletos / totalPasos) * 100) : 0;

  const handleBack = () => navigate({ to: "/admin/temas" });

  return {
    theme,
    portadaUrl,
    estado,
    selectedAgeGroup,
    activeStep,
    activeStepContent,
    pasos,
    totalPasos,
    pasosCompletos,
    progreso,
    selectedAgeGroupId,
    setSelectedAgeGroupId,
    activeStepCode,
    setActiveStepCode,
    title,
    setTitle,
    body,
    setBody,
    shortInstruction,
    setShortInstruction,
    themeQuery,
    portadaQuery,
    stepsQuery,
    ageGroupsQuery,
    crecerStepsQuery,
    saveMutation,
    handleBack,
  };
}
