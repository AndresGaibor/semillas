import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { Compass, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { obtenerTemas } from "@/features/themes/themes.api";
import { obtenerMiProgreso } from "@/features/progress/progress.api";
import { CardLeccion } from "@/componentes/ui/card-leccion";
import { Chip } from "@/componentes/ui/chip";
import { TemasTabsFilter, type FiltroTab } from "@/features/themes/componentes/temas-tabs-filter";
import { TemasSearchBar } from "@/features/themes/componentes/temas-search-bar";
import { ResumenTemasCard } from "@/features/themes/componentes/resumen-temas-card";
import { ContinuarAprendiendoCard } from "@/features/themes/componentes/continuar-aprendiendo-card";
import { usePortadasFirmadas } from "@/features/themes/hooks/usePortadasFirmadas";
import type { TemaUI, EstadoTema } from "@/features/themes/types";
import type { Tema } from "@/shared/api/api";

type SendaFiltro = "padre" | "hijo" | "espiritu";

interface TemasSearch {
  senda?: SendaFiltro;
}

export const Route = createFileRoute("/app/temas/")({
  component: PaginaTemas,
  validateSearch: (search: Record<string, unknown>): TemasSearch => ({
    senda:
      search.senda === "padre" || search.senda === "hijo" || search.senda === "espiritu"
        ? search.senda
        : undefined,
  }),
});

const STORAGE_KEY = "semillas:favoritos";

function leerFavoritos(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function guardarFavoritos(favs: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

function mapearTema(t: Tema, porcentajeReal: number): TemaUI {
  const progreso = porcentajeReal;
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
    favorito: false,
    imagenUrl: null,
    estado,
  };
}

const SENDAS = [
  { id: "todas", label: "Todas las sendas", color: "gris" as const },
  { id: "padre", label: "Senda del Padre", color: "amarillo" as const },
  { id: "hijo", label: "Senda del Hijo", color: "azul" as const },
  { id: "espiritu", label: "Senda del Espíritu Santo", color: "verde" as const },
];

function normalizarSenda(senda: string) {
  const valor = senda.toLowerCase();
  if (valor.includes("padre")) return "padre";
  if (valor.includes("hijo")) return "hijo";
  if (valor.includes("espíritu") || valor.includes("espiritu")) return "espiritu";
  return "todas";
}

function PaginaTemas() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const [filtroTab, setFiltroTab] = useState<FiltroTab>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [favoritosLocales, setFavoritosLocales] = useState<Record<string, boolean>>(leerFavoritos);

  const { data: temasApi, isLoading, isError } = useQuery({
    queryKey: ["temas"],
    queryFn: () => obtenerTemas(),
  });

  const { data: progressApi } = useQuery({
    queryKey: ["progress"],
    queryFn: obtenerMiProgreso,
  });

  const toggleFavorito = useCallback((slug: string) => {
    setFavoritosLocales((prev) => {
      const nuevos = { ...prev, [slug]: !prev[slug] };
      guardarFavoritos(nuevos);
      return nuevos;
    });
  }, []);

  const temasBase = useMemo<TemaUI[]>(() => {
    if (!temasApi) return [];
    return temasApi.map((t) => {
      const progresoActual = progressApi?.progresos_tema?.find(
        (p) => p.tema_id === t.id,
      );
      const porcentaje = progresoActual ? progresoActual.porcentaje : 0;
      return {
        ...mapearTema(t, porcentaje),
        favorito: favoritosLocales[t.slug] ?? false,
      };
    });
  }, [temasApi, favoritosLocales, progressApi]);

  const portadas = usePortadasFirmadas(temasApi ?? []);

  const temasConPortadas = useMemo<TemaUI[]>(
    () => temasBase.map((t) => ({ ...t, imagenUrl: portadas.get(t.id) ?? null })),
    [temasBase, portadas],
  );

  const { temasFiltrados, stats, temaParaContinuar } = useMemo(() => {
    const filtrados = temasConPortadas.filter((tema) => {
      const cumpleBusqueda =
        tema.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        tema.descripcion.toLowerCase().includes(busqueda.toLowerCase());

      const cumpleTab =
        filtroTab === "todos" ||
        (filtroTab === "completados" && tema.estado === "completada") ||
        (filtroTab === "progreso" && tema.estado === "enProgreso") ||
        (filtroTab === "favoritos" && tema.favorito);

      const cumpleSenda = !search.senda || normalizarSenda(tema.senda) === search.senda;

      return cumpleBusqueda && cumpleTab && cumpleSenda;
    });

    return {
      temasFiltrados: filtrados,
      stats: {
        totales: temasConPortadas.length,
        completados: temasConPortadas.filter((t) => t.estado === "completada").length,
        enProgreso: temasConPortadas.filter((t) => t.estado === "enProgreso").length,
      },
      temaParaContinuar: temasConPortadas.find((t) => t.estado === "enProgreso"),
    };
  }, [temasConPortadas, filtroTab, busqueda, search.senda]);

  const cambiarSenda = useCallback(
    (senda: SendaFiltro | "todas") => {
      navigate({
        search: (prev) => ({
          ...prev,
          senda: senda === "todas" ? undefined : senda,
        }),
      });
    },
    [navigate],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="size-8 text-primario animate-spin" />
        <p className="text-sm font-semibold text-neutro">Cargando temas bíblicos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
        <AlertCircle className="size-12 text-red-400 mb-3" />
        <h4 className="text-sm font-black text-slate-700 mb-1">Error al cargar temas</h4>
        <p className="text-xs text-slate-400 font-semibold max-w-[280px]">
          No pudimos obtener los temas. Revisa tu conexión e intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 w-full font-sans text-left items-start">
      <div className="flex flex-col min-w-0">
        <div className="mb-4 flex flex-wrap gap-2">
          {SENDAS.map((senda) => {
            const activa = (senda.id === "todas" && !search.senda) || search.senda === senda.id;

            return (
              <button
                key={senda.id}
                type="button"
                onClick={() => cambiarSenda(senda.id as SendaFiltro | "todas")}
                className="focus-visible:outline-none"
              >
                <Chip
                  color={senda.color}
                  forma="badgePildora"
                  icono={<ArrowRight />}
                  className={activa ? "ring-2 ring-offset-2 ring-slate-900/10" : "opacity-80"}
                >
                  {senda.label}
                </Chip>
              </button>
            );
          })}
        </div>
        <TemasTabsFilter activo={filtroTab} onChange={setFiltroTab} />
        <TemasSearchBar valor={busqueda} onChange={setBusqueda} />

        {temasFiltrados.length === 0 ? (
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
                mostrarSendaBadge={!search.senda}
                onFavorito={() => {
                  const slug = temasApi?.find((t) => t.id === tema.id)?.slug ?? tema.id;
                  toggleFavorito(slug);
                }}
                onAccion={() =>
                  navigate({ to: "/app/temas/$themeId", params: { themeId: tema.id } })
                }
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
              navigate({ to: "/app/temas/$themeId", params: { themeId: temaParaContinuar.id } });
            }
          }}
        />
      </div>
    </div>
  );
}
