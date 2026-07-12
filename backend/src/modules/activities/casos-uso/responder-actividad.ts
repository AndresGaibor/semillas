import type { AuthUser } from "../../../config/env";
import { NotFoundError } from "../../../shared/errors/http-error";
import { evaluarActividadConfigurada } from "../activity-evaluator";
import type { ActivitiesRepository } from "../activities.repository";

type Dependencias = {
  actividades: ActivitiesRepository;
};

type EntradaResponderActividad = {
  evento_id_cliente: string;
  opcion_id_seleccionada?: string;
  texto_respuesta?: string;
  respuesta?: unknown;
  confirmacion?: boolean;
  ocurrido_en_cliente?: string;
  dispositivo_id?: string;
};

export function crearCasoResponderActividad({ actividades }: Dependencias) {
  return async function responderActividad(
    usuario: AuthUser,
    actividadId: string,
    entrada: EntradaResponderActividad,
  ) {
    const actividad = await actividades.obtenerActividadParaRespuesta(actividadId);
    if (!actividad) throw new NotFoundError("Actividad no encontrada");

    let correcta = false;
    let puntaje = 0;
    let retroalimentacion: string | null = actividad.retroalimentacion ?? null;
    let opcionCorrectaId: string | null = null;

    if (entrada.opcion_id_seleccionada) {
      const opcion = await actividades.obtenerOpcionDeActividad(
        actividadId,
        entrada.opcion_id_seleccionada,
      );
      if (!opcion) throw new NotFoundError("Opción no encontrada");

      const opcionCorrecta = await actividades.obtenerOpcionCorrecta(actividadId);
      correcta = Boolean(opcion.correcta);
      puntaje = correcta ? 100 : 0;
      opcionCorrectaId = opcionCorrecta?.id ?? null;
      retroalimentacion =
        opcion.retroalimentacion ?? opcionCorrecta?.retroalimentacion ?? retroalimentacion;
    } else {
      const evaluacion = evaluarActividadConfigurada(
        {
          tipoCodigo: actividad.tipoCodigo,
          configuracion: actividad.configuracion,
          retroalimentacion: actividad.retroalimentacion,
        },
        {
          texto: entrada.texto_respuesta,
          respuesta: entrada.respuesta,
          confirmacion: entrada.confirmacion,
        },
      );
      correcta = evaluacion.correcta;
      puntaje = evaluacion.puntaje;
      retroalimentacion = evaluacion.retroalimentacion;
    }

    // La respuesta y el evento se registran antes de entregar recompensas. El XP
    // enviado por el navegador nunca se consulta ni se persiste.
    const evento = await actividades.registrarEventoProgreso({
      usuarioId: usuario.id,
      idEventoCliente: entrada.evento_id_cliente,
      actividadId,
      temaId: actividad.temaId,
      correcta,
      xpOtorgada: 0,
      puntaje,
      datos: {
        opcion_id_seleccionada: entrada.opcion_id_seleccionada ?? null,
        texto_respuesta: entrada.texto_respuesta ?? null,
        respuesta: entrada.respuesta ?? null,
        confirmacion: entrada.confirmacion ?? null,
        tipo_actividad: actividad.tipoCodigo,
        validado_en_servidor: true,
      },
      ocurridoEnCliente: entrada.ocurrido_en_cliente
        ? new Date(entrada.ocurrido_en_cliente)
        : new Date(),
      dispositivoId: entrada.dispositivo_id ?? null,
    });

    if (!evento) {
      return {
        resultado: {
          correcta,
          puntaje,
          xp_otorgada: 0,
          opcion_correcta_id: opcionCorrectaId,
          retroalimentacion,
        },
        duplicado: true,
        correcta,
        xp_otorgada: 0,
        logros_desbloqueados: [],
      };
    }

    await actividades.upsertProgresoActividad(usuario.id, actividadId, correcta, puntaje);

    let xpOtorgada = 0;
    let logrosDesbloqueados: Array<{
      id: string;
      codigo: string;
      nombre: string;
      bonoXp: number;
    }> = [];

    if (correcta) {
      await actividades.upsertProgresoTema(usuario.id, actividad.temaId);
      const gamificacion = await actividades.procesarGamificacionActividad(
        usuario.id,
        actividadId,
        Number(actividad.xpRecompensa ?? 0),
      );
      xpOtorgada = gamificacion.xpOtorgada;
      logrosDesbloqueados = gamificacion.logros;
      await actividades.actualizarXpEvento(evento.id, xpOtorgada);
    }

    return {
      resultado: {
        correcta,
        puntaje,
        xp_otorgada: xpOtorgada,
        opcion_correcta_id: opcionCorrectaId,
        retroalimentacion,
      },
      duplicado: false,
      correcta,
      xp_otorgada: xpOtorgada,
      logros_desbloqueados: logrosDesbloqueados.map((logro) => ({
        id: logro.id,
        codigo: logro.codigo,
        nombre: logro.nombre,
        bono_xp: logro.bonoXp,
      })),
    };
  };
}
