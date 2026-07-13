import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { obtenerPasosAdmin, guardarParlante, obtenerTemaAdmin } from "../../admin/admin.api";
import { obtenerGruposEdad, obtenerPasosCrecer } from "../../catalog/catalog.api";
import {
  obtenerRecursosMultimedia,
  obtenerUrlFirmadaRecurso,
  subirArchivo,
  type RecursoMultimedia,
} from "../../media/media.api";
import { obtenerUrlPortadaTema } from "../../themes/themes.api";
import { obtenerEstadoTema } from "../../admin/componentes/theme-view.utils";

interface UseThemeCrecerPageProps { themeId: string; }
export type ReflectionQuestion = { pregunta: string; orden: number };

type SubirImagen = (archivo: File, tipo: "imagen") => Promise<Pick<RecursoMultimedia, "id">>;
type ObtenerUrlFirmada = (recursoId: string) => Promise<{ url: string }>;

export function validarContenidoCrecer(titulo: string, cuerpo: string) {
  const tituloLimpio = titulo.trim();
  const cuerpoLimpio = cuerpo.trim();

  if (tituloLimpio.length < 2) return "El título debe tener al menos 2 caracteres";
  if (tituloLimpio.length > 120) return "El título no puede superar 120 caracteres";
  if (cuerpoLimpio.length < 5) return "El contenido debe tener al menos 5 caracteres";

  return null;
}

export async function subirImagenMarkdown(
  archivo: File,
  subir: SubirImagen = subirArchivo,
  obtenerUrlFirmada: ObtenerUrlFirmada = obtenerUrlFirmadaRecurso,
) {
  const recurso = await subir(archivo, "imagen");
  const { url } = await obtenerUrlFirmada(recurso.id);
  return url;
}

export function useThemeCrecerPage({ themeId }: UseThemeCrecerPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeStepCode, setActiveStepCode] = useState("conectar");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [shortInstruction, setShortInstruction] = useState("");
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [audioResourceId, setAudioResourceId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ReflectionQuestion[]>([]);

  const themeQuery = useQuery({ queryKey: ["admin", "theme", themeId], queryFn: () => obtenerTemaAdmin(themeId) });
  const portadaQuery = useQuery({ queryKey: ["theme-portada", themeId], queryFn: () => obtenerUrlPortadaTema(themeId), enabled: Boolean(themeQuery.data?.portada_recurso_id), staleTime: 10 * 60 * 1000 });
  const stepsQuery = useQuery({ queryKey: ["admin", "theme", themeId, "steps"], queryFn: () => obtenerPasosAdmin(themeId) });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad, staleTime: 1000 * 60 * 60 });
  const crecerStepsQuery = useQuery({ queryKey: ["catalog", "crecer-steps"], queryFn: obtenerPasosCrecer, staleTime: 1000 * 60 * 60 });
  const mediaQuery = useQuery({ queryKey: ["admin", "media"], queryFn: obtenerRecursosMultimedia });

  const theme = themeQuery.data;
  const portadaUrl = portadaQuery.data?.url ?? theme?.portada_recurso?.url_publica ?? null;
  const estado = obtenerEstadoTema(theme?.estado ?? "borrador");

  useEffect(() => {
    if (selectedAgeGroupId || !ageGroupsQuery.data?.length) return;
    const available = theme?.grupos_edad?.[0]?.id;
    setSelectedAgeGroupId(available ?? ageGroupsQuery.data?.[0]?.id ?? "");
  }, [ageGroupsQuery.data, selectedAgeGroupId, theme?.grupos_edad]);

  const selectedAgeGroup = useMemo(() => ageGroupsQuery.data?.find((ag) => ag.id === selectedAgeGroupId) ?? null, [ageGroupsQuery.data, selectedAgeGroupId]);
  const activeStep = crecerStepsQuery.data?.find((step) => step.codigo === activeStepCode);
  const activeStepRecord = useMemo(() => stepsQuery.data?.find((step) => step.tipo_paso?.codigo === activeStepCode) ?? null, [stepsQuery.data, activeStepCode]);
  const activeStepContent = useMemo(() => {
    if (!selectedAgeGroupId || !activeStepRecord) return null;
    return activeStepRecord.contenidos?.find((content) => content.grupo_edad_id === selectedAgeGroupId) ?? null;
  }, [activeStepRecord, selectedAgeGroupId]);

  useEffect(() => {
    setTitle(activeStepContent?.titulo ?? "");
    setBody(activeStepContent?.cuerpo ?? "");
    setShortInstruction(activeStepContent?.instruccion_corta ?? "");
    setResourceId(activeStepContent?.recurso_id ?? null);
    setAudioResourceId(activeStepContent?.recurso_audio_id ?? null);
    setQuestions((activeStepRecord?.preguntas ?? []).filter((question) => question.grupo_edad_id === selectedAgeGroupId).map((question) => ({ pregunta: question.pregunta, orden: question.orden })));
  }, [activeStepContent, activeStepRecord, selectedAgeGroupId]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const stepType = crecerStepsQuery.data?.find((step) => step.codigo === activeStepCode);
      if (!stepType || !selectedAgeGroupId) throw new Error("Selecciona una franja y un paso");
      const errorValidacion = validarContenidoCrecer(title, body);
      if (errorValidacion) throw new Error(errorValidacion);
      return guardarParlante(themeId, {
        tipo_paso_id: stepType.id,
        grupo_edad_id: selectedAgeGroupId,
        titulo: title.trim(),
        cuerpo: body.trim(),
        instruccion_corta: shortInstruction.trim() || undefined,
        recurso_id: resourceId,
        recurso_audio_id: audioResourceId,
        datos_extra: { formato: "markdown", actualizado_desde: "admin" },
        preguntas: questions.filter((question) => question.pregunta.trim()).map((question, index) => ({ pregunta: question.pregunta.trim(), orden: index + 1 })),
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "steps"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "studio"] }),
      ]);
      toast.success(`${activeStep?.nombre ?? "Paso"} guardado`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo guardar el paso"),
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: "imagen" | "audio" | "video" }) => subirArchivo(file, type, `${activeStep?.nombre ?? "CRECER"} - ${theme?.titulo ?? "tema"}`),
    onSuccess: async (resource, variables) => {
      if (variables.type === "audio") setAudioResourceId(resource.id); else setResourceId(resource.id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      toast.success("Recurso subido; guarda el paso para vincularlo");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo subir el recurso"),
  });

  const handleSubirImagenMarkdown = async (archivo: File) => {
    const url = await subirImagenMarkdown(archivo);
    await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    toast.success("Imagen subida e insertada en el contenido");
    return url;
  };

  const pasos = crecerStepsQuery.data ?? [];
  const totalPasos = pasos.length || 6;
  const pasosCompletos = pasos.filter((step) => selectedAgeGroupId && stepsQuery.data?.some((contentStep) => contentStep.tipo_paso?.codigo === step.codigo && contentStep.contenidos?.some((content) => content.grupo_edad_id === selectedAgeGroupId && content.titulo?.trim() && content.cuerpo?.trim()))).length;
  const progreso = selectedAgeGroupId ? Math.round((pasosCompletos / totalPasos) * 100) : 0;
  const media = mediaQuery.data ?? [];
  const selectedResource = media.find((resource) => resource.id === resourceId) ?? null;
  const selectedAudio = media.find((resource) => resource.id === audioResourceId) ?? null;

  return {
    theme, portadaUrl, estado, selectedAgeGroup, activeStep, activeStepContent, pasos, totalPasos, pasosCompletos, progreso,
    selectedAgeGroupId, setSelectedAgeGroupId, activeStepCode, setActiveStepCode,
    title, setTitle, body, setBody, shortInstruction, setShortInstruction,
    resourceId, setResourceId, audioResourceId, setAudioResourceId, questions, setQuestions,
    selectedResource, selectedAudio, media,
    themeQuery, portadaQuery, stepsQuery, ageGroupsQuery, crecerStepsQuery, mediaQuery, saveMutation, uploadMutation,
    handleSubirImagenMarkdown,
    handleBack: () => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId } }),
  };
}

export function isVisualMedia(resource: RecursoMultimedia) { return resource.tipo === "imagen" || resource.tipo === "video"; }
