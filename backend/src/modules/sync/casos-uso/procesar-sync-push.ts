import type { SyncRepository } from "../sync.repository";
import type { SyncPushEvent } from "../sync.schemas";

type Dependencias = {
  repositorio: SyncRepository;
};

function calcularIncrementoTema(evento: SyncPushEvent) {
  return evento.tipo_evento === "tema_iniciado" || evento.tipo_evento === "bloque_iniciado" || evento.tipo_evento === "actividad_completada" || evento.tipo_evento === "actividad_respondida"
    ? 16
    : 0;
}

export function crearCasoProcesarSyncPush({ repositorio }: Dependencias) {
  return async function procesarSyncPush(usuarioId: string, eventos: SyncPushEvent[]) {
    let procesados = 0;
    let omitidos = 0;
    const errores: { evento_id_cliente: string; error: string }[] = [];

    for (const evento of eventos) {
      try {
        const insertado = await repositorio.registrarEvento(usuarioId, evento);

        if (!insertado) {
          omitidos++;
          continue;
        }

        procesados++;
        const ahora = new Date();

        if (evento.tema_id) {
          const existente = await repositorio.obtenerProgresoTema(usuarioId, evento.tema_id);
          const inicio = evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : ahora;

          if (!existente) {
            await repositorio.crearProgresoTema(usuarioId, evento.tema_id, {
              estado: evento.tipo_evento === "tema_completado" ? "completado" : "en_progreso",
              porcentaje: evento.tipo_evento === "tema_completado" ? 100 : calcularIncrementoTema(evento),
              iniciadoEn: inicio,
              completadoEn: evento.tipo_evento === "tema_completado" ? inicio : null,
              actualizadoEn: ahora
            });
          } else {
            const porcentaje = evento.tipo_evento === "tema_completado"
              ? 100
              : existente.porcentaje < 100
                ? Math.min(existente.porcentaje + calcularIncrementoTema(evento), 99)
                : existente.porcentaje;

            await repositorio.actualizarProgresoTema(usuarioId, evento.tema_id, {
              ...(evento.tipo_evento === "tema_iniciado" && !existente.iniciadoEn ? { iniciadoEn: inicio } : {}),
              ...(evento.tipo_evento === "tema_completado" ? { estado: "completado", completadoEn: inicio } : {}),
              porcentaje,
              actualizadoEn: ahora
            });
          }
        }

        if (evento.actividad_id) {
          const existente = await repositorio.obtenerProgresoActividad(usuarioId, evento.actividad_id);
          const completado = evento.correcta === true || evento.tipo_evento === "actividad_completada";
          const puntaje = evento.puntaje ?? 0;

          if (!existente) {
            await repositorio.crearProgresoActividad(usuarioId, evento.actividad_id, {
              intentos: 1,
              mejorPuntaje: puntaje,
              completado,
              completadoEn: completado ? ahora : null,
              actualizadoEn: ahora
            });
          } else {
            await repositorio.actualizarProgresoActividad(usuarioId, evento.actividad_id, {
              intentos: existente.intentos + 1,
              mejorPuntaje: Math.max(existente.mejorPuntaje, puntaje),
              completado: completado ? true : existente.completado,
              completadoEn: completado && !existente.completado ? ahora : existente.completadoEn,
              actualizadoEn: ahora
            });
          }
        }
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        errores.push({ evento_id_cliente: evento.evento_id_cliente, error: mensaje });
      }
    }

    return { procesados, omitidos, errores };
  };
}
