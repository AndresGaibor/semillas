import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueries } from "@tanstack/react-query";
import * as React from "react";
import { useState, useMemo } from "react";
import { Compass, Loader2 } from "lucide-react";
import { obtenerTemas, obtenerUrlPortadaTema } from "@/features/themes/themes.api";
import type { Tema } from "@/shared/api/api";
import { CardLeccion } from "@/componentes/ui/card-leccion";

// Componentes descompuestos
import { TemasTabsFilter, type FiltroTab } from "@/features/themes/componentes/temas-tabs-filter";
import { TemasSearchBar } from "@/features/themes/componentes/temas-search-bar";
import { ResumenTemasCard } from "@/features/themes/componentes/resumen-temas-card";
import { ContinuarAprendiendoCard, type TemaUI } from "@/features/themes/componentes/continuar-aprendiendo-card";

export const Route = createFileRoute("/app/temas/")({
  component: PaginaTemas,
});

type EstadoTema = "porDefecto" | "enProgreso" | "completada";

function usePortadasFirmadas(temas: Tema[]) {
  return useQueries({
    queries: temas.map((t) => ({
      queryKey: ["tema-portada", t.id],
      queryFn: () => obtenerUrlPortadaTema(t.id),
      enabled: Boolean(t.portada_recurso?.id),
      // Las URLs firmadas expiran en 300s (5 min).
      // staleTime < 300s para refrescar antes de que venzan.
      staleTime: 3 * 60 * 1000,        // 3 min → considera stale antes del vencimiento
      gcTime: 4 * 60 * 1000,           // 4 min → saca URLs vencidas del caché
      retry: 1,                         // 1 reintento si el endpoint falla
      refetchOnWindowFocus: true,       // refresca al volver a la pestaña
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

const PROGRESO_POR_TEMA: Record<string, number> = {
  "la-creacion-del-mundo": 100,
  "parabolas-de-jesus": 50
};

const FAVORITOS_INICIALES = new Set<string>(["la-creacion-del-mundo", "parabolas-de-jesus"]);

function mapearTema(t: Tema): TemaUI {
  const slug = t.slug;
  const progreso = PROGRESO_POR_TEMA[slug] ?? 0;
  const estado: EstadoTema =
    progreso >= 100 ? "completada" : progreso > 0 ? "enProgreso" : "porDefecto";

  return {
    id: t.id,
    titulo: t.titulo,
    descripcion: t.resumen ?? t.objetivo ?? "Explora este increíble tema bíblico.",
    senda: t.senda?.nombre ?? "Senda de Aprendizaje",
    duracion: `${t.minutos_estimados ?? 10} min`,
    xp: t.xp_recompensa ?? 100,
    progreso,
    favorito: FAVORITOS_INICIALES.has(slug),
    imagenUrl: null,
    estado
  };
}

function PaginaTemas() {
  const [filtroTab, setFiltroTab] = useState<FiltroTab>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [favoritosLocales, setFavoritosLocales] = useState<Record<string, boolean>>({});

  const { data: temasApi, isLoading } = useQuery({
    queryKey: ["temas"],
    queryFn: () => obtenerTemas()
  });

  const temasBase = useMemo<TemaUI[]>(() => {
    if (!temasApi) return [];
    return temasApi.map((t) => {
      const mapeado = mapearTema(t);
      return {
        ...mapeado,
        favorito: favoritosLocales[t.slug] ?? mapeado.favorito
      };
    });
  }, [temasApi, favoritosLocales]);

  const portadas = usePortadasFirmadas(temasApi ?? []);

  const temasConPortadas = useMemo<TemaUI[]>(
    () => temasBase.map((t) => ({ ...t, imagenUrl: portadas.get(t.id) ?? null })),
    [temasBase, portadas],
  );

  const toggleFavorito = (slug: string) => {
    setFavoritosLocales((prev) => ({
      ...prev,
      [slug]: !(prev[slug] ?? FAVORITOS_INICIALES.has(slug))
    }));
  };

  const temasFiltrados = useMemo(() => {
    return temasConPortadas.filter((tema) => {
      const cumpleBusqueda =
        tema.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        tema.descripcion.toLowerCase().includes(busqueda.toLowerCase());

      const cumpleTab =
        filtroTab === "todos" ||
        (filtroTab === "completados" && tema.estado === "completada") ||
        (filtroTab === "progreso" && tema.estado === "enProgreso") ||
        (filtroTab === "favoritos" && tema.favorito);

      return cumpleBusqueda && cumpleTab;
    });
  }, [temasConPortadas, filtroTab, busqueda]);

  const stats = useMemo(() => {
    return {
      totales: temasConPortadas.length,
      completados: temasConPortadas.filter((t) => t.estado === "completada").length,
      enProgreso: temasConPortadas.filter((t) => t.estado === "enProgreso").length
    };
  }, [temasConPortadas]);

  const temaParaContinuar = useMemo(() => {
    return temasConPortadas.find((t) => t.estado === "enProgreso");
  }, [temasConPortadas]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 w-full font-sans text-left items-start">
      <div className="flex flex-col min-w-0">
        <TemasTabsFilter activo={filtroTab} onChange={setFiltroTab} />
        <TemasSearchBar valor={busqueda} onChange={setBusqueda} />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-8 text-primario animate-spin" />
            <p className="text-sm font-semibold text-neutro">Cargando temas bíblicos...</p>
          </div>
        ) : temasFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
            <Compass className="size-12 text-slate-300 mb-3" />
            <h4 className="text-sm font-black text-slate-700 mb-1">No se encontraron temas</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-[280px]">
              Intenta buscar con otros términos o cambia la pestaña seleccionada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {temasFiltrados.map((tema) => (
              <CardLeccion
                key={tema.id}
                senda={tema.senda}
                titulo={tema.titulo}
                descripcion={tema.descripcion}
                duracion={tema.duracion}
                xp={tema.xp}
                progreso={tema.progreso}
                favorito={tema.favorito}
                imagenUrl={tema.imagenUrl ?? undefined}
                estado={tema.estado}
                onFavorito={() => toggleFavorito(temasApi?.find((t) => t.id === tema.id)?.slug ?? tema.id)}
                onAccion={() => alert(`Iniciando lección de: ${tema.titulo}`)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <ResumenTemasCard 
          totales={stats.totales} 
          completados={stats.completados} 
          enProgreso={stats.enProgreso} 
        />
        <ContinuarAprendiendoCard 
          tema={temaParaContinuar ?? null} 
          onContinuar={() => {
            if (temaParaContinuar) {
              alert(`Continuando lección de: ${temaParaContinuar.titulo}`);
            }
          }}
        />
      </div>
    </div>
  );
}