import { useQuery, useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerTemasAdmin, publicarTema, despublicarTema } from "../admin.api";
import { obtenerUrlPortadaTema } from "@/features/themes/themes.api";
import { obtenerSendas } from "@/features/sendas/sendas.api";
import { obtenerGruposEdad } from "@/features/catalog/catalog.api";
import { getSendaIcon } from "../componentes/admin.helpers";
import type { Tema } from "@/shared/api/api";
import type { TemaTableRow } from "../componentes/admin-themes-table.types";

function usePortadasFirmadas(temas: Tema[]) {
  return useQueries({
    queries: temas.map((t) => ({
      queryKey: ["tema-portada", t.id],
      queryFn: () => obtenerUrlPortadaTema(t.id),
      enabled: Boolean(t.portada_recurso_id || t.portada_recurso?.id),
      staleTime: 3 * 60 * 1000,
      gcTime: 4 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    })),
    combine: (results) => {
      const mapa = new Map<string, string | null>();
      temas.forEach((t, index) => {
        const resultado = results[index]?.data;
        mapa.set(t.id, resultado?.url ?? null);
      });
      return mapa;
    }
  });
}

function getFranjaEdadText(gruposEdad: Tema["grupos_edad"]) {
  if (!gruposEdad || gruposEdad.length === 0) return "";
  return gruposEdad.map((g) => {
    if (g.codigo === "semillas") return "5–8 años";
    if (g.codigo === "exploradores") return "9–12 años";
    if (g.codigo === "embajadores") return "13–17 años";
    return g.nombre;
  }).join(", ");
}

function getSendaInfo(theme: Tema, sendasList?: { id: string; nombre: string; color_hex: string; codigo: string }[]) {
  if (theme.senda) {
    return { nombre: theme.senda.nombre, colorHex: theme.senda.color_hex, codigo: theme.senda.codigo };
  }
  const sendaFromList = sendasList?.find((s) => s.id === theme.senda_id);
  if (sendaFromList) {
    return { nombre: sendaFromList.nombre, colorHex: sendaFromList.color_hex, codigo: sendaFromList.codigo };
  }
  return { nombre: "Sin senda", colorHex: "#94a3b8", codigo: "" };
}

export function useAdminThemes() {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [selectedSendaId, setSelectedSendaId] = useState("");
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  const temasQuery = useQuery({ queryKey: ["admin", "themes"], queryFn: () => obtenerTemasAdmin() });
  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: obtenerSendas });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });

  const temasBase = temasQuery.data ?? [];
  const portadas = usePortadasFirmadas(temasBase);

  const publishMutation = useMutation({
    mutationFn: publicarTema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "themes"] });
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: despublicarTema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "themes"] });
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    }
  });

  const mappedThemes = useMemo<TemaTableRow[]>(() => {
    return temasBase.map((t) => {
      const sendaInfo = getSendaInfo(t, sendasQuery.data);
      const franja = getFranjaEdadText(t.grupos_edad);
      const portada = portadas.get(t.id) || t.portada_recurso?.url_publica || undefined;
      const autorNombre = t.creado_por?.nombre_visible ?? "Usuario Semilla";
      const avatarSeed = t.creado_por?.id ?? t.id;
      const dateObj = t.publicado_en ? new Date(t.publicado_en) : (t.actualizado_en ? new Date(t.actualizado_en) : new Date());
      const fecha = dateObj.toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" });
      const hora = dateObj.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });

      return {
        id: t.id,
        titulo: t.titulo ?? "Sin título",
        resumen: t.resumen ?? "",
        portadaUrl: portada,
        sendaNombre: sendaInfo.nombre,
        sendaColorHex: sendaInfo.colorHex,
        sendaIcono: getSendaIcon(sendaInfo.codigo).icon,
        franjaEdad: franja,
        estado: t.estado,
        fechaEdicion: fecha,
        horaEdicion: hora,
        autorNombre,
        autorAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`,
      };
    });
  }, [temasBase, portadas, sendasQuery.data]);

  const filteredThemes = useMemo(() => {
    return mappedThemes.filter((t) => {
      if (activeTab !== "todos" && t.estado.toLowerCase() !== activeTab.toLowerCase()) return false;
      if (searchValue && !t.titulo.toLowerCase().includes(searchValue.toLowerCase()) && !t.resumen.toLowerCase().includes(searchValue.toLowerCase())) return false;
      if (selectedSendaId) {
        const matchingSenda = sendasQuery.data?.find((s) => s.id === selectedSendaId);
        if (matchingSenda && t.sendaNombre !== matchingSenda.nombre) return false;
      }
      if (selectedAgeGroupId) {
        const matchingAgeGroup = ageGroupsQuery.data?.find((g) => g.id === selectedAgeGroupId);
        if (matchingAgeGroup) {
          const cleanName = matchingAgeGroup.nombre.toLowerCase();
          if (cleanName.includes("semilla") && !t.franjaEdad.includes("5–8")) return false;
          if (cleanName.includes("explora") && !t.franjaEdad.includes("9–12")) return false;
          if (cleanName.includes("embaja") && !t.franjaEdad.includes("13–17")) return false;
        }
      }
      return true;
    });
  }, [mappedThemes, activeTab, searchValue, selectedSendaId, selectedAgeGroupId, sendasQuery.data, ageGroupsQuery.data]);

  const tabCounts = useMemo(() => {
    const stats = { todos: mappedThemes.length, borradores: 0, revision: 0, publicados: 0, archivados: 0 };
    mappedThemes.forEach((t) => {
      const state = t.estado.toLowerCase();
      if (state === "borrador") stats.borradores++;
      else if (state === "revision" || state === "en revisión") stats.revision++;
      else if (state === "publicado") stats.publicados++;
      else if (state === "archivado") stats.archivados++;
    });
    return stats;
  }, [mappedThemes]);

  const filterSendas = useMemo(() => (sendasQuery.data ?? []).map((s) => ({ id: s.id, nombre: s.nombre })), [sendasQuery.data]);
  const filterAgeGroups = useMemo(() => (ageGroupsQuery.data ?? []).map((g) => ({ id: g.id, nombre: g.nombre })), [ageGroupsQuery.data]);

  return {
    searchValue, setSearchValue,
    selectedSendaId, setSelectedSendaId,
    selectedAgeGroupId, setSelectedAgeGroupId,
    activeTab, setActiveTab,
    isLoading: temasQuery.isLoading,
    temasBase,
    mappedThemes, filteredThemes, tabCounts,
    filterSendas, filterAgeGroups,
    publishMutation, unpublishMutation,
  };
}
