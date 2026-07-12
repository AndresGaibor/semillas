import { describe, expect, it } from "bun:test";
import { crearCasoProcesarSyncPush } from "./procesar-sync-push";

describe("procesar-sync-push", () => {
  it("confirma cada evento, omite duplicados y no confía en XP del cliente", async () => {
    const operaciones: string[] = [];
    const eventosGuardados: Array<Record<string, unknown>> = [];

    const repositorio = {
      registrarEvento: async (_usuarioId: string, evento: Record<string, unknown>) => {
        operaciones.push(`registrar:${evento.evento_id_cliente}`);
        eventosGuardados.push(evento);
        return evento.evento_id_cliente === "550e8400-e29b-41d4-a716-446655440002" ? false : true;
      },
      obtenerProgresoTema: async () => undefined,
      crearProgresoTema: async () => {
        operaciones.push("crear-tema");
      },
      actualizarProgresoTema: async () => {
        operaciones.push("actualizar-tema");
      },
      obtenerProgresoActividad: async () => undefined,
      crearProgresoActividad: async () => undefined,
      actualizarProgresoActividad: async () => undefined,
      validarActividadCompletada: async () => ({
        temaId: "550e8400-e29b-41d4-a716-446655440010",
        xpOtorgada: 15,
      }),
      aplicarActividadCompletada: async () => {
        operaciones.push("completar-actividad");
      },
      listarEventosUsuario: async () => [],
      listarProgresoTemas: async () => [],
      listarProgresoActividades: async () => []
    } as never;

    const procesarSyncPush = crearCasoProcesarSyncPush({ repositorio });

    const resultado = await procesarSyncPush("usuario-1", [
      {
        evento_id_cliente: "550e8400-e29b-41d4-a716-446655440001",
        tipo_evento: "tema_iniciado",
        tema_id: "550e8400-e29b-41d4-a716-446655440010",
        correcta: true,
        puntaje: 100,
        xp_otorgada: 999999,
        datos: {},
        creado_en_cliente: "2026-01-01T00:00:00.000Z"
      },
      {
        evento_id_cliente: "550e8400-e29b-41d4-a716-446655440002",
        tipo_evento: "actividad_completada",
        actividad_id: "550e8400-e29b-41d4-a716-446655440020",
        correcta: true,
        puntaje: 100,
        xp_otorgada: 15,
        datos: {},
        creado_en_cliente: "2026-01-01T01:00:00.000Z"
      }
    ]);

    expect(resultado).toEqual({
      procesados: 1,
      omitidos: 1,
      procesados_ids: ["550e8400-e29b-41d4-a716-446655440001"],
      omitidos_ids: ["550e8400-e29b-41d4-a716-446655440002"],
      errores: [],
      logros_desbloqueados: []
    });
    expect(eventosGuardados[0]).toMatchObject({
      correcta: undefined,
      puntaje: undefined,
      xp_otorgada: 0
    });
    expect(operaciones).toEqual([
      "registrar:550e8400-e29b-41d4-a716-446655440001",
      "crear-tema",
      "registrar:550e8400-e29b-41d4-a716-446655440002"
    ]);
  });

  it("valida actividad_completada en servidor, ignora XP del cliente y proyecta progreso una sola vez", async () => {
    const eventosGuardados: Array<Record<string, unknown>> = [];
    const proyecciones: string[] = [];
    const eventoId = "550e8400-e29b-41d4-a716-446655440003";
    const actividadId = "550e8400-e29b-41d4-a716-446655440030";
    const temaId = "550e8400-e29b-41d4-a716-446655440040";

    const repositorio = {
      registrarEvento: async (_usuarioId: string, evento: Record<string, unknown>) => {
        eventosGuardados.push(evento);
        return eventosGuardados.filter((guardado) => guardado.evento_id_cliente === evento.evento_id_cliente).length === 1;
      },
      validarActividadCompletada: async (idActividad: string) => {
        expect(idActividad).toBe(actividadId);
        return { temaId, xpOtorgada: 25 };
      },
      aplicarActividadCompletada: async (usuarioId: string, idActividad: string, idTema: string) => {
        proyecciones.push(`${usuarioId}:${idActividad}:${idTema}`);
      },
      obtenerProgresoTema: async () => undefined,
      crearProgresoTema: async () => undefined,
      actualizarProgresoTema: async () => undefined,
      obtenerProgresoActividad: async () => undefined,
      crearProgresoActividad: async () => undefined,
      actualizarProgresoActividad: async () => undefined,
      listarEventosUsuario: async () => [],
      listarProgresoTemas: async () => [],
      listarProgresoActividades: async () => [],
      validarRespuestaActividad: async () => null,
      aplicarRespuestaActividad: async () => undefined,
      registrarPasoActual: async () => undefined,
      validarTemaCompletable: async () => null,
      marcarTemaCompletado: async () => undefined,
      evaluarLogrosUsuario: async () => [],
      validarRespuestaConfigurada: async () => null,
      procesarGamificacionActividad: async () => ({ xpOtorgada: 25, racha: null, logros: [] }),
      procesarGamificacionTema: async () => ({ xpOtorgada: 40, racha: null, logros: [] }),
      actualizarXpEvento: async () => undefined,
    } as never;

    const procesarSyncPush = crearCasoProcesarSyncPush({ repositorio });
    const evento = {
      evento_id_cliente: eventoId,
      tipo_evento: "actividad_completada" as const,
      actividad_id: actividadId,
      tema_id: "550e8400-e29b-41d4-a716-446655440099",
      correcta: false,
      puntaje: 1,
      xp_otorgada: 999_999,
      datos: { validado_en_servidor: false },
      creado_en_cliente: "2026-01-01T01:00:00.000Z",
    };

    const primero = await procesarSyncPush("usuario-1", [evento]);
    const segundo = await procesarSyncPush("usuario-1", [evento]);

    expect(primero.procesados_ids).toEqual([eventoId]);
    expect(segundo.omitidos_ids).toEqual([eventoId]);
    expect(eventosGuardados[0]).toMatchObject({
      tema_id: temaId,
      actividad_id: actividadId,
      correcta: true,
      puntaje: 100,
      xp_otorgada: 0,
      datos: { validado_en_servidor: true },
    });
    expect(proyecciones).toEqual([`usuario-1:${actividadId}:${temaId}`]);
  });

  it("proyecta respuestas validadas, pasos y temas solo con los datos de servidor", async () => {
    const eventosGuardados: Array<Record<string, unknown>> = [];
    const operaciones: string[] = [];
    const actividadId = "550e8400-e29b-41d4-a716-446655440050";
    const temaId = "550e8400-e29b-41d4-a716-446655440060";
    const pasoId = "550e8400-e29b-41d4-a716-446655440070";

    const repositorio = {
      registrarEvento: async (_usuarioId: string, evento: Record<string, unknown>) => {
        eventosGuardados.push(evento);
        return true;
      },
      validarRespuestaActividad: async () => ({
        temaId,
        correcta: true,
        xpOtorgada: 12,
        puntaje: 100,
        retroalimentacion: null,
        opcionCorrectaId: "550e8400-e29b-41d4-a716-446655440080",
      }),
      aplicarRespuestaActividad: async () => {
        operaciones.push("respuesta");
      },
      validarActividadCompletada: async () => null,
      aplicarActividadCompletada: async () => undefined,
      registrarPasoActual: async () => {
        operaciones.push("paso");
      },
      validarTemaCompletable: async () => ({ xpOtorgada: 40 }),
      marcarTemaCompletado: async () => {
        operaciones.push("tema");
      },
      evaluarLogrosUsuario: async () => [],
      validarRespuestaConfigurada: async () => null,
      procesarGamificacionActividad: async () => ({
        xpOtorgada: 12,
        racha: null,
        logros: [{
          id: "550e8400-e29b-41d4-a716-446655440090",
          codigo: "primer-logro",
          nombre: "Primer logro",
          bonoXp: 5,
        }],
      }),
      procesarGamificacionTema: async () => ({ xpOtorgada: 40, racha: null, logros: [] }),
      actualizarXpEvento: async () => undefined,
      obtenerProgresoTema: async () => undefined,
      crearProgresoTema: async () => undefined,
      actualizarProgresoTema: async () => undefined,
      obtenerProgresoActividad: async () => undefined,
      crearProgresoActividad: async () => undefined,
      actualizarProgresoActividad: async () => undefined,
      listarEventosUsuario: async () => [],
      listarProgresoTemas: async () => [],
      listarProgresoActividades: async () => [],
    } as never;

    const procesarSyncPush = crearCasoProcesarSyncPush({ repositorio });
    const resultado = await procesarSyncPush("usuario-1", [
      {
        evento_id_cliente: "550e8400-e29b-41d4-a716-446655440101",
        tipo_evento: "actividad_respondida",
        actividad_id: actividadId,
        xp_otorgada: 999_999,
        datos: { opcion_id_seleccionada: "550e8400-e29b-41d4-a716-446655440080" },
      },
      {
        evento_id_cliente: "550e8400-e29b-41d4-a716-446655440102",
        tipo_evento: "bloque_completado",
        tema_id: temaId,
        paso_id: pasoId,
        xp_otorgada: 0,
        datos: {},
      },
      {
        evento_id_cliente: "550e8400-e29b-41d4-a716-446655440103",
        tipo_evento: "tema_completado",
        tema_id: temaId,
        xp_otorgada: 999_999,
        datos: {},
      },
    ]);

    expect(eventosGuardados[0]).toMatchObject({
      tema_id: temaId,
      correcta: true,
      puntaje: 100,
      xp_otorgada: 0,
      datos: {
        opcion_correcta_id: "550e8400-e29b-41d4-a716-446655440080",
        validado_en_servidor: true,
      },
    });
    expect(eventosGuardados[2]).toMatchObject({ xp_otorgada: 0, puntaje: 100 });
    expect(operaciones).toEqual(["respuesta", "paso", "tema"]);
    expect(resultado.logros_desbloqueados).toEqual([{
      id: "550e8400-e29b-41d4-a716-446655440090",
      codigo: "primer-logro",
      nombre: "Primer logro",
      bono_xp: 5,
    }]);
  });
});
