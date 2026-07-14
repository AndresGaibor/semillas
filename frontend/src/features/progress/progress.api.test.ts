import { afterAll, describe, expect, it, mock } from "bun:test";

const obtenerMiProgresoOffline = mock(async () => ({
  progresos_tema: [
    {
      usuario_id: "usuario-1",
      tema_id: "tema-descargado",
      estado: "en_progreso",
      porcentaje: 40,
      iniciado_en: "2026-07-13T00:00:00.000Z",
      completado_en: null,
      ultimo_paso_id: "paso-2",
      actualizado_en: "2026-07-13T00:00:00.000Z",
    },
  ],
  progresos_actividad: [],
}));

mock.module("../perfil/profile.api", () => ({
  obtenerMiProgreso: obtenerMiProgresoOffline,
}));

afterAll(() => {
  mock.restore();
});

describe("obtenerMiProgreso", () => {
  it("reutiliza el fallback offline compartido", async () => {
    const { obtenerMiProgreso } = await import("./progress.api");

    const progreso = await obtenerMiProgreso();

    expect(obtenerMiProgresoOffline).toHaveBeenCalledTimes(1);
    expect(progreso.progresos_tema[0]?.tema_id).toBe("tema-descargado");
  });
});
