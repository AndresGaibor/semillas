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
      errores: []
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
});
