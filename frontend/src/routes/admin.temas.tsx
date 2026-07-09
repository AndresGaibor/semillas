import { createFileRoute, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { useMutation, useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerTemasAdmin, publicarTema, despublicarTema } from "../features/admin/admin.api";
import { obtenerUrlPortadaTema } from "../features/themes/themes.api";
import { obtenerSendas } from "../features/sendas/sendas.api";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
import { Loader } from "lucide-react";

import { AdminThemesHeader } from "../features/admin/componentes/admin-themes-header";
import { AdminThemesFilters } from "../features/admin/componentes/admin-themes-filters";
import { AdminThemesTabs } from "../features/admin/componentes/admin-themes-tabs";
import { AdminThemesTable, type TemaTableRow } from "../features/admin/componentes/admin-themes-table";
import { AdminThemesSummary } from "../features/admin/componentes/admin-themes-summary";

import type { Tema } from "../shared/api/api";

export const Route = createFileRoute("/admin/temas")({
  component: AdminThemesPage
});

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

function AdminThemesPage() {
  const location = useLocation();
  const isExactListRoute = location.pathname === "/admin/temas" || location.pathname === "/admin/temas/";
  if (!isExactListRoute) return <Outlet />;

  return <AdminThemesListView />;
}

function AdminThemesListView() {
  const navigate = useNavigate();
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

  const getFranjaEdadText = (gruposEdad: Tema["grupos_edad"]) => {
    if (!gruposEdad || gruposEdad.length === 0) return "";
    const nombres = gruposEdad.map((g) => {
      if (g.codigo === "semillas") return "5–8 años";
      if (g.codigo === "exploradores") return "9–12 años";
      if (g.codigo === "embajadores") return "13–17 años";
      return g.nombre;
    });
    return nombres.join(", ");
  };

  const getSendaInfo = (theme: Tema) => {
    if (theme.senda) {
      return {
        nombre: theme.senda.nombre,
        colorHex: theme.senda.color_hex,
        codigo: theme.senda.codigo,
      };
    }
    const sendaFromList = sendasQuery.data?.find((s) => s.id === theme.senda_id);
    if (sendaFromList) {
      return {
        nombre: sendaFromList.nombre,
        colorHex: sendaFromList.color_hex,
        codigo: sendaFromList.codigo,
      };
    }
    return { nombre: "Sin senda", colorHex: "#94a3b8", codigo: "" };
  };

  const getSendaIcon = (codigo: string) => {
    if (codigo === "padre") return "fa-crown";
    if (codigo === "hijo") return "fa-heart";
    if (codigo === "espiritu") return "fa-flame";
    return "fa-star";
  };

  const mappedThemes = useMemo<TemaTableRow[]>(() => {
    return temasBase.map((t) => {
      const sendaInfo = getSendaInfo(t);
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
        sendaIcono: getSendaIcon(sendaInfo.codigo),
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
      if (activeTab !== "todos" && t.estado.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }
      if (searchValue && !t.titulo.toLowerCase().includes(searchValue.toLowerCase()) && !t.resumen.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      if (selectedSendaId) {
        const matchingSenda = sendasQuery.data?.find((s) => s.id === selectedSendaId);
        if (matchingSenda && t.sendaNombre !== matchingSenda.nombre) {
          return false;
        }
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

  const filterSendas = useMemo(() => {
    return (sendasQuery.data ?? []).map((s) => ({ id: s.id, nombre: s.nombre }));
  }, [sendasQuery.data]);

  const filterAgeGroups = useMemo(() => {
    return (ageGroupsQuery.data ?? []).map((g) => ({ id: g.id, nombre: g.nombre }));
  }, [ageGroupsQuery.data]);

  return (
    <div className="flex flex-col gap-6">
      {temasQuery.isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="text-sm text-neutro ml-2">Cargando temas...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminThemesHeader onCrearTema={() => navigate({ to: "/admin/temas/new" })} />

          <AdminThemesFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedSendaId={selectedSendaId}
            onSendaChange={setSelectedSendaId}
            selectedAgeGroupId={selectedAgeGroupId}
            onAgeGroupChange={setSelectedAgeGroupId}
            sendas={filterSendas}
            ageGroups={filterAgeGroups}
            onMasFiltros={() => console.log("Mas filtros clicked")}
          />

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col">
            <AdminThemesTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={{
                todos: tabCounts.todos,
                borradores: tabCounts.borradores,
                revision: tabCounts.revision,
                publicados: tabCounts.publicados,
              }}
            />

            <AdminThemesTable
              temas={filteredThemes}
              onEditar={(id) => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId: id } })}
              onCRECER={(id) => navigate({ to: "/admin/temas/$themeId/crecer", params: { themeId: id } })}
              onActivities={(id) => navigate({ to: "/admin/temas/$themeId/activities", params: { themeId: id } })}
              onPreview={(id) => navigate({ to: "/admin/temas/$themeId/preview", params: { themeId: id } })}
              onDetalle={(id) => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId: id } })}
              onPublicar={(id) => publishMutation.mutate(id)}
              onDespublicar={(id) => unpublishMutation.mutate(id)}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-100 gap-4 text-xs font-semibold text-[#5c5c5c] select-none">
              <span>
                Mostrando {filteredThemes.length > 0 ? "1" : "0"} a {filteredThemes.length} de {filteredThemes.length} temas
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <AdminThemesSummary
            counts={{
              total: tabCounts.todos,
              publicados: tabCounts.publicados,
              revision: tabCounts.revision,
              borradores: tabCounts.borradores,
              archivados: tabCounts.archivados,
            }}
            onVerReportes={() => console.log("Reportes clicked")}
          />
        </div>
      </div>
    </div>
  );
}
