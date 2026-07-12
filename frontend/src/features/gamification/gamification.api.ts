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
  reclamado_en: string | null;
  logro: LogroGamificacion | null;
};

export type ReglaNivelGamificacion = {
  id?: string;
  numero_nivel: number;
  nombre: string;
  xp_minima: number;
  color_insignia?: string | null;
};

export type GamificacionPropia = {
  nivel: {
    usuario_id: string | null;
    xp_total: number;
    numero_nivel: number;
    nombre_nivel: string;
  } | null;
  logros: LogroUsuarioGamificacion[];
  catalogo_logros?: Array<LogroGamificacion & {
    obtenido?: boolean;
    ganado_en?: string | null;
    progreso_actual?: number;
    progreso_objetivo?: number;
    porcentaje?: number;
    reclamado_en?: string | null;
  }>;
  reglas_nivel?: ReglaNivelGamificacion[];
  /** Cantidad de logros desbloqueados que el usuario aún no ha reclamado. */
  pendientes_reclamar?: number;
  racha?: { dias_actuales: number; dias_maximos: number; ultima_actividad_fecha: string | null };
  movimientos_recientes?: Array<{
    id: string;
    origen: string;
    origen_id: string | null;
    cantidad: number;
    metadatos: Record<string, unknown>;
    creado_en: string;
  }>;
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

export async function reclamarLogroApi(logroId: string): Promise<{ bono_xp: number; nombre: string }> {
  return peticion<{ bono_xp: number; nombre: string }>(`/gamificacion/logros/${logroId}/reclamar`, { metodo: "POST" });
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
