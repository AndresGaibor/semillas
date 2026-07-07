import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueries } from "@tanstack/react-query";
import * as React from "react";
import { useState, useMemo } from "react";
import { Search, Filter, BookOpen, CheckCircle, Loader2, Flame, Play, Star, Route as RouteIcon, Compass, TrendingUp } from "lucide-react";
import { obtenerTemas, obtenerUrlPortadaTema } from "@/features/themes/themes.api";
import type { Tema } from "@/shared/api/api";
import { CardLeccion } from "@/componentes/ui/card-leccion";
import { Card } from "@/componentes/ui/card-base";
import { Boton } from "@/componentes/ui/boton";

export const Route = createFileRoute("/app/temas/")({
  component: PaginaTemas,
});

type EstadoTema = "porDefecto" | "enProgreso" | "completada";

type TemaUI = {
  id: string;
  titulo: string;
  descripcion: string;
  senda: string;
  duracion: string;
  xp: number;
  progreso: number;
  favorito: boolean;
  imagenUrl: string | null;
  estado: EstadoTema;
};

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
  const [filtroTab, setFiltroTab] = useState<"todos" | "completados" | "progreso" | "favoritos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [favoritosLocales, setFavoritosLocales] = useState<Record<string, boolean>>({});
  const [errorPortadaContinuar, setErrorPortadaContinuar] = useState(false);
  const defaultTemaImg = "";

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

        <div className="flex gap-8 border-b border-slate-100 mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: "todos", label: "Todos los temas" },
            { id: "completados", label: "Completados" },
            { id: "progreso", label: "En progreso" },
            { id: "favoritos", label: "Favoritos" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroTab(tab.id as typeof filtroTab)}
              className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                filtroTab === tab.id
                  ? "text-primario font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primario after:rounded-t-lg"
                  : "text-neutro hover:text-primario"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutro size-4" />
            <input
              type="text"
              placeholder="Buscar temas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-neutro-oscuro-max outline-none focus:border-primario focus:ring-1 focus:ring-primario transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-extrabold text-neutro-oscuro rounded-xl cursor-pointer">
            <Filter className="size-4" /> Filtrar
          </button>
        </div>

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

        <Card sombra="sm" hoverEffect="none" clase="p-6 rounded-[24px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17.5px] font-extrabold text-[#1e293b]">
              Resumen de temas
            </h3>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-[#f3e8ff] flex items-center justify-center mb-2.5">
                <BookOpen className="size-6 text-[#9333ea]" strokeWidth={2.2} />
              </div>
              <span className="font-bold text-2xl text-slate-800 leading-none">{stats.totales}</span>
              <span className="text-[13px] font-medium text-slate-500 mt-1.5 leading-tight">Temas totales</span>
            </div>

            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center mb-2.5">
                <CheckCircle className="size-6 text-[#16a34a]" strokeWidth={2.2} />
              </div>
              <span className="font-bold text-2xl text-slate-800 leading-none">{stats.completados}</span>
              <span className="text-[13px] font-medium text-slate-500 mt-1.5 leading-tight">Completados</span>
            </div>

            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center mb-2.5">
                <Flame className="size-6 text-[#2563eb]" strokeWidth={2.2} />
              </div>
              <span className="font-bold text-2xl text-slate-800 leading-none">{stats.enProgreso}</span>
              <span className="text-[13px] font-medium text-slate-500 mt-1.5 leading-tight">En progreso</span>
            </div>
          </div>
        </Card>

        {temaParaContinuar ? (
          <Card sombra="sm" hoverEffect="none" clase="p-6 rounded-[24px] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="text-[17.5px] font-extrabold text-[#1e293b]">
                Continuar aprendiendo
              </h3>
              <TrendingUp className="size-6 text-[#10b981]" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3.5 items-center">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-slate-100">
                  {temaParaContinuar.imagenUrl ? (
                    <img
                      src={temaParaContinuar.imagenUrl}
                      alt={temaParaContinuar.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="size-6 text-primario" />
                  )}
                </div>
                <div className="flex flex-col text-left justify-center">
                  <h4 className="text-base font-bold text-slate-800 leading-tight">
                    {temaParaContinuar.titulo}
                  </h4>
                  <p className="text-xs text-[#2563eb] font-bold mt-1">
                    En progreso • {temaParaContinuar.progreso}%
                  </p>
                </div>
              </div>

              <p className="text-[13px] text-slate-500 font-medium leading-normal text-left">
                Te falta poco para terminar este tema. ¡Sigue avanzando!
              </p>

              <Boton
                variante="contorno"
                className="w-full text-sm py-2.5 border-[#2E9E5B] text-[#2E9E5B] hover:bg-[#2E9E5B]/5 font-bold rounded-xl cursor-pointer bg-white transition-all"
                iconoIzquierdo={<Play className="size-4 fill-[#2E9E5B] text-[#2E9E5B]" />}
                onClick={() => alert(`Continuando lección de: ${temaParaContinuar.titulo}`)}
              >
                Continuar lección
              </Boton>
            </div>
          </Card>
        ) : (
          <Card sombra="sm" hoverEffect="none" clase="p-6 rounded-[24px] flex flex-col items-center justify-center text-center gap-3">
            <RouteIcon className="size-8 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">¡Al día con tus temas!</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-[200px]">
              No tienes lecciones en progreso. Elige una nueva senda y comienza.
            </p>
          </Card>
        )}

      </div>
    </div>
  );
}