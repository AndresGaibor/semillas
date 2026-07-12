import { peticion } from "../../shared/api/api";

export type LogroGamificacion = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  url_icono: string | null;
  bono_xp: number;
  codigo_criterio: string;
  valor_criterio: number | null;
  activo: boolean;
  creado_en: string;
};

export type LogroUsuarioGamificacion = {
  usuario_id: string;
  logro_id: string;
  ganado_en: string;
  logro: LogroGamificacion | null;
};

export type ReglaNivelGamificacion = {
  numero_nivel: number;
  nombre: string;
  xp_minima: number;
};

export type GamificacionPropia = {
  nivel: {
    usuario_id: string | null;
    xp_total: number;
    numero_nivel: number;
    nombre_nivel: string;
  } | null;
  logros: LogroUsuarioGamificacion[];
  catalogo_logros?: LogroGamificacion[];
  reglas_nivel?: ReglaNivelGamificacion[];
};

const CACHE_KEY = "semillas_gamification_cache_v1";

export async function obtenerGamificacionPropia() {
  if (!navigator.onLine) return leerCacheGamificacion() ?? { nivel: null, logros: [], catalogo_logros: [], reglas_nivel: [] };

  try {
    const data = await peticion<GamificacionPropia>("/gamificacion/mi");
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: new Date().toISOString() }));
    } catch {
      // El contenido descargado sigue funcionando aunque el navegador bloquee localStorage.
    }
    return data;
  } catch (error) {
    const cached = leerCacheGamificacion();
    if (cached) return cached;
    throw error;
  }
}

function leerCacheGamificacion(): GamificacionPropia | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { data?: GamificacionPropia };
      if (parsed.data) return parsed.data;
    }
  } catch {
    // Se devuelve un resumen vacío seguro si no hay cache legible.
  }

  return null;
}
