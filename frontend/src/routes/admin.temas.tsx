import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { publicarTema, despublicarTema } from "../features/admin/admin.api";
import { obtenerTemas, obtenerUrlPortadaTema } from "../features/themes/themes.api";
import { obtenerSendas } from "../features/sendas/sendas.api";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
import { Loader } from "lucide-react";

import { AdminThemesHeader } from "../features/admin/componentes/admin-themes-header";
import { AdminThemesFilters } from "../features/admin/componentes/admin-themes-filters";
import { AdminThemesTabs } from "../features/admin/componentes/admin-themes-tabs";
import { AdminThemesTable, type TemaTableRow } from "../features/admin/componentes/admin-themes-table";
import { AdminThemesSummary } from "../features/admin/componentes/admin-themes-summary";

import type { Tema } from "../shared/api/api";

import coverTema1 from "@/assets/images/Ilustraciones/Tema1.png";
import coverTema2 from "@/assets/images/Ilustraciones/Tema2.png";
import coverTema3 from "@/assets/images/Ilustraciones/Tema3.png";
import coverTema4 from "@/assets/images/Ilustraciones/Tema4.png";
import coverExploradores from "@/assets/images/Ilustraciones/Exploradores.png";
import coverVersiculo from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import coverSendaHijo from "@/assets/images/Ilustraciones/Senda del hijo.png";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters State
  const [searchValue, setSearchValue] = useState("");
  const [selectedSendaId, setSelectedSendaId] = useState("");
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  // Fetch Data
  const temasQuery = useQuery({ queryKey: ["admin", "themes"], queryFn: () => obtenerTemas() });
  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: obtenerSendas });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });

  const temasBase = temasQuery.data ?? [];
  const portadas = usePortadasFirmadas(temasBase);

  // Mutations
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

  // Autores y fechas mock para simular un CMS realista del diseño
  const mockAuthors = [
    { name: "María López", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maria" },
    { name: "Juan Pérez", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Juan" },
    { name: "Ana Torres", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana" },
  ];

  const getFranjaEdadText = (temaSlug: string) => {
    if (temaSlug.includes("creacion") || temaSlug.includes("crear")) return "5–8 años";
    if (temaSlug.includes("oracion") || temaSlug.includes("padre")) return "9–12 años";
    return "13–17 años";
  };

  const getMockAuthor = (themeId: string) => {
    // Deterministic mock author based on theme id string length
    const idx = themeId.length % mockAuthors.length;
    return mockAuthors[idx] || mockAuthors[0];
  };

  // Convert Tema to TemaTableRow format with database data
  const mappedThemes = useMemo<TemaTableRow[]>(() => {
    return temasBase.map((t) => {
      const author = getMockAuthor(t.id) || { name: "María López", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maria" };
      const franja = getFranjaEdadText(t.slug);
      const portada = portadas.get(t.id) || undefined;
      const sendaNombre = t.senda?.nombre || "Sin senda";
      const dateObj = t.publicado_en ? new Date(t.publicado_en) : new Date("2024-05-15T10:30:00");
      const fecha = dateObj.toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" });
      const hora = dateObj.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });

      return {
        id: t.id,
        titulo: t.titulo ?? "Sin título",
        resumen: t.resumen ?? "Explora este gran tema bíblico y aprende más sobre Dios.",
        portadaUrl: portada,
        sendaNombre,
        franjaEdad: franja,
        estado: t.estado,
        fechaEdicion: fecha,
        horaEdicion: hora,
        autorNombre: author.name,
        autorAvatar: author.avatar,
      };
    });
  }, [temasBase, portadas]);

  // Filter Themes by Tab, Search and Select Inputs
  const filteredThemes = useMemo(() => {
    return mappedThemes.filter((t) => {
      // Tab filter
      if (activeTab !== "todos" && t.estado.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }
      // Search text filter
      if (searchValue && !t.titulo.toLowerCase().includes(searchValue.toLowerCase()) && !t.resumen.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      // Senda filter
      if (selectedSendaId) {
        const matchingSenda = sendasQuery.data?.find((s) => s.id === selectedSendaId);
        if (matchingSenda && t.sendaNombre !== matchingSenda.nombre) {
          return false;
        }
      }
      // Age Group filter
      if (selectedAgeGroupId) {
        const matchingAgeGroup = ageGroupsQuery.data?.find((g) => g.id === selectedAgeGroupId);
        if (matchingAgeGroup) {
          // Convert franjaEdad ("5–8 años") to match filter name ("Semillas")
          const cleanName = matchingAgeGroup.nombre.toLowerCase();
          if (cleanName.includes("semilla") && !t.franjaEdad.includes("5–8")) return false;
          if (cleanName.includes("explora") && !t.franjaEdad.includes("9–12")) return false;
          if (cleanName.includes("embaja") && !t.franjaEdad.includes("13–17")) return false;
        }
      }
      return true;
    });
  }, [mappedThemes, activeTab, searchValue, selectedSendaId, selectedAgeGroupId, sendasQuery.data, ageGroupsQuery.data]);

  // Tab count stats
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

  // Senda and Age Group items formatted for filter select options
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
          <span className="text-sm text-neutro ml-2">Cargando temas del catálogo...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left main block (3/4 width) */}
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          {/* Header */}
          <AdminThemesHeader onCrearTema={() => navigate({ to: "/admin/temas/new" })} />

          {/* Search and Filters */}
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

          {/* Table Container Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col">
            {/* Tabs */}
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

            {/* Table */}
            <AdminThemesTable
              temas={filteredThemes}
              onEditar={(id) => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId: id } })}
              onCRECER={(id) => navigate({ to: "/admin/temas/$themeId/crecer", params: { themeId: id } })}
              onActivities={(id) => navigate({ to: "/admin/temas/$themeId/activities", params: { themeId: id } })}
              onPreview={(id) => navigate({ to: "/admin/temas/$themeId/preview", params: { themeId: id } })}
              onPublicar={(id) => publishMutation.mutate(id)}
              onDespublicar={(id) => unpublishMutation.mutate(id)}
            />

            {/* Table Footer / Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-100 gap-4 text-xs font-semibold text-[#5c5c5c] select-none">
              <span>
                Mostrando {filteredThemes.length > 0 ? "1" : "0"} a {filteredThemes.length} de {filteredThemes.length} temas
              </span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer" disabled>
                  <i className="fa-solid fa-chevron-left text-[10px]" />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2e9e5b] text-white transition-colors font-bold cursor-pointer">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  3
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  4
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  5
                </button>
                <span className="px-1 text-slate-450">...</span>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-205 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                  14
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>
              <select className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 focus:outline-none cursor-pointer">
                <option>10 por página</option>
                <option>20 por página</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right side summary panel (1/4 width) */}
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
