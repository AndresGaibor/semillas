import { apiRequest } from "../../shared/api/http";

export type GamificationMe = {
  nivel: {
    usuario_id: string | null;
    xp_total: number;
    numero_nivel: number;
    nombre_nivel: string;
  } | null;
  logros: Array<unknown>;
};

export function getMyGamification() {
  return apiRequest<GamificationMe>("/gamificacion/mi");
}
