import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerGamificacionPropia } from "../../gamification/gamification.api";
import type { CategoriaLogro } from "../../gamification/componentes/logros-tabs-filter";

const INSIGNIAS_CATALOGO = [
  {
    codigo: "primera_leccion",
    nombre: "Primer paso",
    descripcion: "Completaste tu primera lección.",
    criterio: "Completa 1 tema",
    bono_xp: 20,
    categoria: "especial" as CategoriaLogro,
  },
  {
    codigo: "explorador_palabra",
    nombre: "Explorador de la Fe",
    descripcion: "Completa 10 actividades en total.",
    criterio: "Completa 10 actividades",
    bono_xp: 50,
    categoria: "hijo" as CategoriaLogro,
  },
  {
    codigo: "racha_siete_dias",
    nombre: "Semilla constante",
    descripcion: "Mantén una racha de 7 días seguidos.",
    criterio: "7 días de racha",
    bono_xp: 50,
    categoria: "padre" as CategoriaLogro,
  },
  {
    codigo: "crecer_completo",
    nombre: "Cosechador del Saber",
    descripcion: "Completa todos los pasos CRECER de un tema.",
    criterio: "Completa un tema CRECER",
    bono_xp: 100,
    categoria: "especial" as CategoriaLogro,
  }
];

export function useLogrosPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CategoriaLogro>("todas");
  const [sharedBadge, setSharedBadge] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: obtenerGamificacionPropia,
  });

  const nivel = query.data?.nivel;
  const logrosObtenidos = query.data?.logros ?? [];

  const xpInfo = useMemo(() => {
    const xpTotal = nivel?.xp_total ?? 0;
    const numNivel = nivel?.numero_nivel ?? 1;
    const xpEnNivel = xpTotal % 1000;
    const xpRestantes = 1000 - xpEnNivel;
    const porcentaje = Math.round((xpEnNivel / 1000) * 100);

    return {
      xpTotal,
      numNivel,
      nombreNivel: nivel?.nombre_nivel || "Semilla",
      xpEnNivel,
      xpRestantes,
      porcentaje,
    };
  }, [nivel]);

  const insignias = useMemo(() => {
    return INSIGNIAS_CATALOGO.filter(
      (insignia) => activeTab === "todas" || insignia.categoria === activeTab
    ).map((insignia) => {
      const obtenido = logrosObtenidos.some(
        (l) => l.logro?.codigo === insignia.codigo
      );
      return {
        ...insignia,
        obtenido,
      };
    });
  }, [activeTab, logrosObtenidos]);

  const primerLogroObtenido = useMemo(() => {
    const primerObtenido = INSIGNIAS_CATALOGO.find((insignia) =>
      logrosObtenidos.some((l) => l.logro?.codigo === insignia.codigo)
    );
    return primerObtenido ?? null;
  }, [logrosObtenidos]);

  const handleShare = async (badgeNombre: string) => {
    const texto = `¡Obtuve la insignia "${badgeNombre}" en Semillas!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mi logro en Semillas", text: texto });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
      } else {
        throw new Error("Este navegador no permite compartir ni copiar al portapapeles");
      }
      setSharedBadge(badgeNombre);
      setTimeout(() => setSharedBadge(null), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("No se pudo compartir la insignia", error);
    }
  };

  const handleVerDetalles = () => {
    navigate({ to: "/app/perfil" });
  };

  return {
    query,
    nivel,
    xpInfo,
    insignias,
    primerLogroObtenido,
    activeTab,
    setActiveTab,
    sharedBadge,
    handleShare,
    handleVerDetalles,
  };
}
