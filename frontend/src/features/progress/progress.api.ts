import { peticion, RUTAS_API } from "../../shared/api/api";
import type { EventoProgreso } from "../../shared/api/api";

export type ProgresoResumen = {
  xp_total: number;
  lecciones_completadas: number;
  actividades_respondidas: number;
  racha_actual: number;
  insignias_obtenidas: number;
};

/**
 * Registra y procesa eventos de progreso del usuario de manera segura e idempotente.
 * 
 * HTTP Verb: POST
 * Endpoint: /progreso/eventos
 * Auth: Requerido
 */
export function enviarEventosProgreso(eventos: EventoProgreso[]) {
  return peticion<{ procesados: number; error?: string }>(RUTAS_API.PROGRESO.REGISTRAR, {
    metodo: "POST",
    cuerpo: { eventos },
  });
}

/**
 * Obtiene el historial y resumen de progreso acumulado del usuario autenticado.
 * 
 * HTTP Verb: GET
 * Endpoint: /progreso/mi
 * Auth: Requerido
 */
export function obtenerMiProgreso() {
  return peticion<ProgresoResumen>(RUTAS_API.PROGRESO.MI);
}
