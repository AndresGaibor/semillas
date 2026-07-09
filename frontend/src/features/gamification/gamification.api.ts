import { peticion } from "../../shared/api/api";

export type GamificacionPropia = {
  nivel: {
    usuario_id: string | null;
    xp_total: number;
    numero_nivel: number;
    nombre_nivel: string;
  } | null;
  logros: Array<unknown>;
};

export function obtenerGamificacionPropia() {
  return peticion<GamificacionPropia>("/gamificacion/mi");
}
