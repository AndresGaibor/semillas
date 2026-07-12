import type { SyncRepository } from "../sync.repository";
import type { SyncPushEvent } from "../sync.schemas";

type Dependencias = { repositorio: SyncRepository };

type EventoServidor = SyncPushEvent & {
  correcta?: boolean;
  puntaje?: number;
  xp_otorgada?: number;
};

function sanitizarEvento(evento: SyncPushEvent): EventoServidor {
  return { ...evento, correcta: undefined, puntaje: undefined, xp_otorgada: 0 };
}

export function crearCasoProcesarSyncPush({ repositorio }: Dependencias) {
  return async function procesarSyncPush(usuarioId: string, eventos: SyncPushEvent[]) {
    const procesados_ids: string[] = [];
    const omitidos_ids: string[] = [];
    const errores: { evento_id_cliente: string; error: string }[] = [];
    const logrosDesbloqueados = new Map<string, { id: string; codigo: string; nombre: string; bono_xp: number }>();

    for (const eventoRecibido of eventos) {
      try {
        let evento = sanitizarEvento(eventoRecibido);
        let respuestaValidada: { actividadId: string; temaId: string; correcta: boolean; puntaje: number; xpConfigurada: number } | null = null;
        let actividadCompletadaValidada: { actividadId: string; temaId: string; xpConfigurada: number } | null = null;
        let temaCompleto: { temaId: string; xpConfigurada: number } | null = null;

        if (evento.tipo_evento === "actividad_respondida") {
          const actividadId = evento.actividad_id;
          if (!actividadId) throw new Error("La respuesta offline no contiene una actividad válida");

          const opcionId = typeof evento.datos?.opcion_id_seleccionada === "string"
            ? evento.datos.opcion_id_seleccionada
            : null;
          const validacion = opcionId
            ? await repositorio.validarRespuestaActividad(actividadId, opcionId)
            : await repositorio.validarRespuestaConfigurada(actividadId, evento.datos ?? {});
          if (!validacion) throw new Error("La actividad o la respuesta ya no está disponible");

          evento = {
            ...evento,
            tema_id: validacion.temaId,
            correcta: validacion.correcta,
            puntaje: validacion.puntaje,
            xp_otorgada: 0,
            datos: {
              ...evento.datos,
              ...(opcionId && "opcionCorrectaId" in validacion
                ? { opcion_correcta_id: validacion.opcionCorrectaId }
                : {}),
              retroalimentacion_servidor: validacion.retroalimentacion,
              validado_en_servidor: true,
            },
          };
          respuestaValidada = {
            actividadId,
            temaId: validacion.temaId,
            correcta: validacion.correcta,
            puntaje: validacion.puntaje,
            xpConfigurada: validacion.xpOtorgada,
          };
        }

        if (evento.tipo_evento === "actividad_completada") {
          const actividadId = evento.actividad_id;
          if (!actividadId) throw new Error("La actividad completada no contiene una actividad válida");
          const validacion = await repositorio.validarActividadCompletada(actividadId);
          if (!validacion) throw new Error("Esta actividad requiere una respuesta verificable del servidor");

          evento = {
            ...evento,
            tema_id: validacion.temaId,
            correcta: true,
            puntaje: 100,
            xp_otorgada: 0,
            datos: { ...evento.datos, validado_en_servidor: true },
          };
          actividadCompletadaValidada = {
            actividadId,
            temaId: validacion.temaId,
            xpConfigurada: validacion.xpOtorgada,
          };
        }

        if (evento.tipo_evento === "tema_completado" && evento.tema_id) {
          const validacion = await repositorio.validarTemaCompletable(usuarioId, evento.tema_id);
          if (!validacion) throw new Error("El tema todavía no cumple las condiciones para completarse");
          temaCompleto = { temaId: evento.tema_id, xpConfigurada: validacion.xpOtorgada };
          evento = { ...evento, xp_otorgada: 0, puntaje: 100 };
        }

        const eventoId = await repositorio.registrarEvento(usuarioId, evento);
        if (!eventoId) {
          omitidos_ids.push(evento.evento_id_cliente);
          continue;
        }
        procesados_ids.push(evento.evento_id_cliente);

        let xpReal = 0;
        if (respuestaValidada) {
          await repositorio.aplicarRespuestaActividad(
            usuarioId,
            respuestaValidada.actividadId,
            respuestaValidada.temaId,
            respuestaValidada.correcta,
            respuestaValidada.puntaje,
          );
          if (respuestaValidada.correcta) {
            const resultado = await repositorio.procesarGamificacionActividad(usuarioId, respuestaValidada.actividadId, respuestaValidada.xpConfigurada);
            xpReal = resultado.xpOtorgada;
            resultado.logros.forEach((logro) => logrosDesbloqueados.set(logro.id, { id: logro.id, codigo: logro.codigo, nombre: logro.nombre, bono_xp: logro.bonoXp }));
          }
        }

        if (actividadCompletadaValidada) {
          await repositorio.aplicarActividadCompletada(usuarioId, actividadCompletadaValidada.actividadId, actividadCompletadaValidada.temaId);
          const resultado = await repositorio.procesarGamificacionActividad(usuarioId, actividadCompletadaValidada.actividadId, actividadCompletadaValidada.xpConfigurada);
          xpReal = resultado.xpOtorgada;
          resultado.logros.forEach((logro) => logrosDesbloqueados.set(logro.id, { id: logro.id, codigo: logro.codigo, nombre: logro.nombre, bono_xp: logro.bonoXp }));
        }

        if ((evento.tipo_evento === "bloque_iniciado" || evento.tipo_evento === "bloque_completado") && evento.tema_id && evento.paso_id) {
          await repositorio.registrarPasoActual(usuarioId, evento.tema_id, evento.paso_id);
        }

        if (temaCompleto) {
          await repositorio.marcarTemaCompletado(usuarioId, temaCompleto.temaId);
          const resultado = await repositorio.procesarGamificacionTema(usuarioId, temaCompleto.temaId, temaCompleto.xpConfigurada);
          xpReal = resultado.xpOtorgada;
          resultado.logros.forEach((logro) => logrosDesbloqueados.set(logro.id, { id: logro.id, codigo: logro.codigo, nombre: logro.nombre, bono_xp: logro.bonoXp }));
        }

        if (xpReal > 0) await repositorio.actualizarXpEvento(eventoId, xpReal);

        if (evento.tipo_evento === "tema_iniciado" && evento.tema_id) {
          const existente = await repositorio.obtenerProgresoTema(usuarioId, evento.tema_id);
          const ahora = new Date();
          const inicioCliente = evento.creado_en_cliente ? new Date(evento.creado_en_cliente) : ahora;
          const inicio = Number.isNaN(inicioCliente.getTime()) || inicioCliente > ahora ? ahora : inicioCliente;
          if (!existente) {
            await repositorio.crearProgresoTema(usuarioId, evento.tema_id, { estado: "en_progreso", porcentaje: 0, iniciadoEn: inicio, completadoEn: null, actualizadoEn: ahora });
          } else if (!existente.iniciadoEn) {
            await repositorio.actualizarProgresoTema(usuarioId, evento.tema_id, { estado: "en_progreso", iniciadoEn: inicio, actualizadoEn: ahora });
          }
        }
      } catch (error) {
        errores.push({
          evento_id_cliente: eventoRecibido.evento_id_cliente,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    return {
      procesados: procesados_ids.length,
      omitidos: omitidos_ids.length,
      procesados_ids,
      omitidos_ids,
      errores,
      logros_desbloqueados: [...logrosDesbloqueados.values()],
    };
  };
}
