import { describe, expect, it } from "bun:test";
import { crearCasoProcesarSyncPush } from "./procesar-sync-push";

describe("procesar-sync-push", () => {
  it("omite duplicados y actualiza progreso localmente", async () => {
    const operaciones: string[] = [];

    const repositorio = {
      registrarEvento: async (_usuarioId: string, evento: { evento_id_cliente: string }) => {
        operaciones.push(`registrar:${evento.evento_id_cliente}`);
        return evento.evento_id_cliente === "duplicado" ? false : true;
      },
      obtenerProgresoTema: async () => undefined,
      crearProgresoTema: async () => {
        operaciones.push("crear-tema");
      },
      actualizarProgresoTema: async () => {
        operaciones.push("actualizar-tema");
      },
      obtenerProgresoActividad: async () => undefined,
      crearProgresoActividad: async () => {
        operaciones.push("crear-actividad");
      },
      actualizarProgresoActividad: async () => {
        operaciones.push("actualizar-actividad");
      },
      listarEventosUsuario: async () => [],
      listarProgresoTemas: async () => [],
      listarProgresoActividades: async () => []
    } as const;

    const procesarSyncPush = crearCasoProcesarSyncPush({ repositorio });

    const resultado = await procesarSyncPush("usuario-1", [
      {
        evento_id_cliente: "nuevo",
        tipo_evento: "tema_iniciado",
        tema_id: "tema-1",
        xp_otorgada: 10,
        datos: {},
        creado_en_cliente: "2026-01-01T00:00:00.000Z"
      },
      {
        evento_id_cliente: "duplicado",
        tipo_evento: "actividad_completada",
        actividad_id: "actividad-1",
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
      errores: []
    });
    expect(operaciones).toEqual([
      "registrar:nuevo",
      "crear-tema",
      "registrar:duplicado"
    ]);
  });
});
