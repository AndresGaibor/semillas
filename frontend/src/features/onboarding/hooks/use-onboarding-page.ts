import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { GrupoEdad } from "@/shared/api/api";
import { obtenerGruposEdad } from "@/features/catalog/catalog.api";

export const fallbacksGrupoEdad: GrupoEdad[] = [
  { id: "semillas", codigo: "semillas", nombre: "Semillas", edad_minima: 5, edad_maxima: 8, descripcion: "Descubre a Dios a través de historias y actividades sencillas.", imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/semillas.png", orden: 1 },
  { id: "exploradores", codigo: "exploradores", nombre: "Exploradores", edad_minima: 9, edad_maxima: 12, descripcion: "Aprende más de Dios y entiende su Palabra.", imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/exploradores.png", orden: 2 },
  { id: "embajadores", codigo: "embajadores", nombre: "Embajadores", edad_minima: 13, edad_maxima: 17, descripcion: "Profundiza en tu fe y vive con más propósito.", imagen_url: "https://dmddyzftrkktzctrurmo.supabase.co/storage/v1/object/public/imagenes/onboarding/embajadores.png", orden: 3 },
];

export function useOnboardingPage() {
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: obtenerGruposEdad,
  });

  const data = useMemo(() => {
    if (ageGroupsQuery.data && ageGroupsQuery.data.length > 0) {
      return ageGroupsQuery.data;
    }
    return fallbacksGrupoEdad;
  }, [ageGroupsQuery.data]);

  useEffect(() => {
    if (data && data.length > 0) {
      const semillas = data.find((g) => g.codigo.toLowerCase() === "semillas");
      setSelectedGroupId(semillas ? semillas.id : (data[0]?.id ?? ""));
    }
  }, [data]);

  const handleContinue = useCallback(() => {
    if (selectedGroupId) {
      localStorage.setItem("onboarding_grupo_edad_id", selectedGroupId);
      navigate({ to: "/onboarding/customize" as never });
    }
  }, [selectedGroupId, navigate]);

  return {
    selectedGroupId,
    setSelectedGroupId,
    isHelpOpen,
    setIsHelpOpen,
    ageGroupsQuery,
    data,
    handleContinue,
  };
}
