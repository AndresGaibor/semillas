import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  obtenerGamificacionPropia,
  type LogroGamificacion,
  type ReglaNivelGamificacion,
} from "../../gamification/gamification.api";
import type { CategoriaLogro } from "../../gamification/componentes/logros-tabs-filter";
import { crearTarjetaInsignia, descargarTarjetaInsignia } from "../utils/crear-tarjeta-insignia";

/**
 * Fallback alineado con los INSERT iniciales del SQL de Semillas.
 * La fuente preferida es `catalogo_logros` entregada por la API.
 */
const LOGROS_FALLBACK: LogroGamificacion[] = [
  {
    id: "fallback-primera-leccion",
    codigo: "primera_leccion",
    nombre: "Primer paso",
    descripcion: "Completaste tu primera lección.",
    url_icono: null,
    codigo_criterio: "temas_completados",
    valor_criterio: 1,
    bono_xp: 20,
    activo: true,
    creado_en: "",
  },
  {
    id: "fallback-racha-siete-dias",
    codigo: "racha_siete_dias",
    nombre: "Semilla constante",
    descripcion: "Mantén una racha de 7 días seguidos.",
    url_icono: null,
    codigo_criterio: "dias_racha",
    valor_criterio: 7,
    bono_xp: 50,
    activo: true,
    creado_en: "",
  },
  {
    id: "fallback-explorador-palabra",
    codigo: "explorador_palabra",
    nombre: "Explorador de la Palabra",
    descripcion: "Completa 10 actividades en total.",
    url_icono: null,
    codigo_criterio: "actividades_completadas",
    valor_criterio: 10,
    bono_xp: 50,
    activo: true,
    creado_en: "",
  },
];

/** Fallback alineado con `regla_nivel` del SQL. */
const REGLAS_NIVEL_FALLBACK: ReglaNivelGamificacion[] = [
  { numero_nivel: 1, nombre: "Brote", xp_minima: 0 },
  { numero_nivel: 2, nombre: "Raíz", xp_minima: 100 },
  { numero_nivel: 3, nombre: "Tallo", xp_minima: 250 },
  { numero_nivel: 4, nombre: "Rama", xp_minima: 500 },
  { numero_nivel: 5, nombre: "Árbol", xp_minima: 1000 },
  { numero_nivel: 6, nombre: "Cosecha", xp_minima: 2000 },
  { numero_nivel: 7, nombre: "Explorador", xp_minima: 3000 },
];

export type InsigniaPresentacion = LogroGamificacion & {
  criterio: string;
  obtenido: boolean;
  ganadoEn: string | null;
};

export function useLogrosPage() {
  const [activeTab, setActiveTab] = useState<CategoriaLogro>("todas");
  const [sharedBadge, setSharedBadge] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: obtenerGamificacionPropia,
  });

  const nivel = query.data?.nivel;
  const logrosObtenidos = query.data?.logros ?? [];
  const catalogo = useMemo(
    () => (query.data?.catalogo_logros?.length ? query.data.catalogo_logros : LOGROS_FALLBACK).filter((logro) => logro.activo),
    [query.data?.catalogo_logros],
  );

  const reglasNivel = useMemo(
    () => (query.data?.reglas_nivel?.length ? query.data.reglas_nivel : REGLAS_NIVEL_FALLBACK).slice().sort((a, b) => a.xp_minima - b.xp_minima),
    [query.data?.reglas_nivel],
  );

  const xpInfo = useMemo(() => {
    const xpTotal = nivel?.xp_total ?? 0;
    const reglaActual =
      reglasNivel
        .filter((regla) => regla.xp_minima <= xpTotal)
        .at(-1) ?? reglasNivel[0] ?? REGLAS_NIVEL_FALLBACK[0]!;
    const siguienteRegla = reglasNivel.find((regla) => regla.xp_minima > xpTotal) ?? null;
    const tramo = siguienteRegla ? siguienteRegla.xp_minima - reglaActual.xp_minima : 1;
    const avance = Math.max(0, xpTotal - reglaActual.xp_minima);
    const porcentaje = siguienteRegla ? Math.min(100, Math.round((avance / tramo) * 100)) : 100;

    return {
      xpTotal,
      numNivel: nivel?.numero_nivel ?? reglaActual.numero_nivel,
      nombreNivel: nivel?.nombre_nivel || reglaActual.nombre,
      xpRestantes: siguienteRegla ? Math.max(0, siguienteRegla.xp_minima - xpTotal) : 0,
      porcentaje,
      nombreSiguienteNivel: siguienteRegla?.nombre ?? null,
      esNivelMaximo: siguienteRegla === null,
    };
  }, [nivel, reglasNivel]);

  const insigniasCompletas = useMemo<InsigniaPresentacion[]>(() => {
    const obtenidosPorCodigo = new Map(
      logrosObtenidos
        .filter((registro) => registro.logro?.codigo)
        .map((registro) => [registro.logro!.codigo, registro]),
    );

    return catalogo.map((logro) => {
      const registro = obtenidosPorCodigo.get(logro.codigo);
      return {
        ...logro,
        criterio: construirCriterio(logro.codigo_criterio, logro.valor_criterio),
        obtenido: Boolean(registro),
        ganadoEn: registro?.ganado_en ?? null,
      };
    });
  }, [catalogo, logrosObtenidos]);

  const insignias = useMemo(() => {
    if (activeTab === "obtenidas") return insigniasCompletas.filter((insignia) => insignia.obtenido);
    if (activeTab === "pendientes") return insigniasCompletas.filter((insignia) => !insignia.obtenido);
    return insigniasCompletas;
  }, [activeTab, insigniasCompletas]);

  const resumen = useMemo(() => {
    const obtenidas = insigniasCompletas.filter((insignia) => insignia.obtenido).length;
    return {
      total: insigniasCompletas.length,
      obtenidas,
      pendientes: Math.max(0, insigniasCompletas.length - obtenidas),
    };
  }, [insigniasCompletas]);

  const primerLogroObtenido = insigniasCompletas.find((insignia) => insignia.obtenido) ?? null;
  const proximaInsignia = insigniasCompletas.find((insignia) => !insignia.obtenido) ?? null;

  const handleShare = async (badgeNombre: string, imagenUrl: string) => {
    const texto = `¡Obtuve la insignia "${badgeNombre}" en Semillas!`;
    try {
      const archivo = await crearTarjetaInsignia(badgeNombre, imagenUrl);
      const puedeCompartirArchivo =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [archivo] });

      if (puedeCompartirArchivo) {
        await navigator.share({
          title: "Mi logro en Semillas",
          text: texto,
          files: [archivo],
        });
      } else {
        descargarTarjetaInsignia(archivo);
      }

      setSharedBadge(badgeNombre);
      window.setTimeout(() => setSharedBadge(null), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("No se pudo compartir la insignia", error);
    }
  };

  return {
    query,
    xpInfo,
    insignias,
    resumen,
    primerLogroObtenido,
    proximaInsignia,
    activeTab,
    setActiveTab,
    sharedBadge,
    handleShare,
  };
}

function construirCriterio(codigo: string, valor: number | null): string {
  const cantidad = valor ?? 1;
  switch (codigo) {
    case "temas_completados":
      return `Completa ${cantidad} ${cantidad === 1 ? "tema" : "temas"}`;
    case "actividades_completadas":
      return `Completa ${cantidad} actividades`;
    case "dias_racha":
      return `${cantidad} días de racha`;
    default:
      return "Sigue aprendiendo para desbloquearla";
  }
}
