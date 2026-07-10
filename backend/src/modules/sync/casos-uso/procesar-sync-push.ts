import type { SyncRepository } from "../sync.repository";
import type { SyncPushEvent } from "../sync.schemas";

type Dependencias = {
  repositorio: SyncRepository;
};

/**
 * Los eventos offline son declaraciones del cliente, no una fuente confiable
 * para XP, respuestas correctas ni finalización. Esos datos se calculan en
 * endpoints de dominio (por ejemplo /actividades/:id/responder).
 */
function sanitizarEvento(evento: SyncPushEvent): SyncPushEvent {
  return {
    ...evento,
    correcta: undefined,
    puntaje: undefined,
    xp_otorgada: 0
  };
}

export function crearCasoProcesarSyncPush({ repositorio }: Dependencias) {
  return async function procesarSyncPush(usuarioId: string, eventos: SyncPushEvent[]) {
    const procesados_ids: string[] = [];
    const omitidos_ids: string[] = [];
    const errores: { evento_id_cliente: string; error: string }[] = [];

    for (const eventoRecibido of eventos) {
      try {
        const evento = sanitizarEvento(eventoRecibido);
        const insertado = await repositorio.registrarEvento(usuarioId, evento);

        if (!insertado) {
          omitidos_ids.push(evento.evento_id_cliente);
          continue;
        }

        procesados_ids.push(evento.evento_id_cliente);

        // Solo se proyecta un inicio de tema. Completar temas o actividades y
        // otorgar XP requiere validación de dominio y nunca se confía al cliente.
        if (evento.tipo_evento === "tema_iniciado" && evento.tema_id) {
          const existente = await repositorio.obtenerProgresoTema(usuarioId, evento.tema_id);
          const ahora = new Date();
          const inicioCliente = evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : ahora;
          const inicio = Number.isNaN(inicioCliente.getTime()) || inicioCliente > ahora ? ahora : inicioCliente;

          if (!existente) {
            await repositorio.crearProgresoTema(usuarioId, evento.tema_id, {
              estado: "en_progreso",
              porcentaje: 0,
              iniciadoEn: inicio,
              completadoEn: null,
              actualizadoEn: ahora
            });
          } else if (!existente.iniciadoEn) {
            await repositorio.actualizarProgresoTema(usuarioId, evento.tema_id, {
              estado: "en_progreso",
              iniciadoEn: inicio,
              actualizadoEn: ahora
            });
          }
        }
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        errores.push({ evento_id_cliente: eventoRecibido.evento_id_cliente, error: mensaje });
      }
    }

    return {
      procesados: procesados_ids.length,
      omitidos: omitidos_ids.length,
      procesados_ids,
      omitidos_ids,
      errores
    };
  };
}
