import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { eliminarActividad, obtenerActividadesAdmin, obtenerTemasAdmin } from "../admin.api";
import { obtenerSendas } from "@/features/sendas/sendas.api";
import { obtenerGruposEdad } from "@/features/catalog/catalog.api";
import { mapearActividadParaTabla, filtrarActividades, contarPorTipo, contarPorEstado } from "./actividades-table.helpers";

export function useAdminActivities() {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [selectedTemaId, setSelectedTemaId] = useState("");
  const [selectedSendaId, setSelectedSendaId] = useState("");
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const activitiesQuery = useQuery({
    queryKey: ["admin", "activities"],
    queryFn: () => obtenerActividadesAdmin(),
  });
  const temasQuery = useQuery({ queryKey: ["admin", "themes"], queryFn: () => obtenerTemasAdmin() });
  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: () => obtenerSendas(), staleTime: 1000 * 60 * 60 });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: () => obtenerGruposEdad(), staleTime: 1000 * 60 * 60 });

  const dbActivities = activitiesQuery.data?.actividades ?? [];
  const temasBase = temasQuery.data ?? [];
  const sendasBase = sendasQuery.data ?? [];
  const ageGroupsBase = ageGroupsQuery.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: eliminarActividad,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "activities"] }),
  });

  const mappedActivities = useMemo(
    () => dbActivities.map((act) => mapearActividadParaTabla(act, ageGroupsBase)),
    [dbActivities, ageGroupsBase],
  );

  const filteredActivities = useMemo(
    () => filtrarActividades(mappedActivities, { activeTab, searchValue, selectedSendaId, selectedTemaId, selectedAgeGroupId, sendasBase, temasBase, ageGroupsBase }),
    [mappedActivities, activeTab, searchValue, selectedTemaId, selectedSendaId, selectedAgeGroupId, sendasBase, temasBase, ageGroupsBase],
  );

  const paginatedActivities = useMemo(() => {
    const start = (paginaActual - 1) * porPagina;
    return filteredActivities.slice(start, start + porPagina);
  }, [filteredActivities, paginaActual, porPagina]);

  const totalPaginas = useMemo(() => Math.ceil(filteredActivities.length / porPagina) || 1, [filteredActivities.length, porPagina]);
  const tabCounts = useMemo(() => contarPorTipo(mappedActivities), [mappedActivities]);
  const summaryStats = useMemo(() => contarPorEstado(mappedActivities), [mappedActivities]);

  const clearFilters = () => {
    setSearchValue("");
    setSelectedTemaId("");
    setSelectedSendaId("");
    setSelectedAgeGroupId("");
  };

  const tieneFiltros = !!(searchValue || selectedTemaId || selectedSendaId || selectedAgeGroupId);

  return {
    searchValue, setSearchValue,
    selectedTemaId, setSelectedTemaId,
    selectedSendaId, setSelectedSendaId,
    selectedAgeGroupId, setSelectedAgeGroupId,
    activeTab, setActiveTab,
    paginaActual, setPaginaActual,
    porPagina, setPorPagina,
    isLoading: activitiesQuery.isLoading,
    filteredActivities: paginatedActivities,
    filteredTotal: filteredActivities.length,
    totalPaginas,
    tabCounts,
    summaryStats,
    clearFilters,
    tieneFiltros,
    deleteMutation,
    temasBase,
    sendasBase,
    ageGroupsBase,
  };
}
