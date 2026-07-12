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
  /**
   * Campos opcionales para que la API pueda dejar de depender de catálogos
   * locales sin romper clientes antiguos.
   */
  catalogo_logros?: LogroGamificacion[];
  reglas_nivel?: ReglaNivelGamificacion[];
};

export function obtenerGamificacionPropia() {
  return peticion<GamificacionPropia>("/gamificacion/mi");
}
