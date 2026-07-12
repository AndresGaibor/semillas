import { peticion, RUTAS_API } from "../../shared/api/api";
import type { EventoProgreso } from "../../shared/api/api";

export type ProgresoResumen = {
  progresos_tema: Array<{
    tema_id: string;
    estado: "en_progreso" | "completado";
    porcentaje: number;
    iniciado_en: string | null;
    completado_en: string | null;
    ultimo_paso_id: string | null;
  }>;
  progresos_actividad: Array<{
    actividad_id: string;
    intentos: number;
    mejor_puntaje: number;
    completado: boolean;
  }>;
};

/**
 * Registra y procesa eventos de progreso del usuario de manera segura e idempotente.
 * 
 * HTTP Verb: POST
 * Endpoint: /progreso/eventos
 * Auth: Requerido
 */
export function enviarEventosProgreso(eventos: EventoProgreso[]) {
  return peticion<{ procesados: number; error?: string }>(RUTAS_API.SYNC.PUSH, {
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
