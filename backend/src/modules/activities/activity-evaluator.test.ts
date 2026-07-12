import { describe, expect, it } from "bun:test";
import { evaluarActividadConfigurada } from "./activity-evaluator";

describe("evaluarActividadConfigurada", () => {
  it("normaliza acentos y espacios al completar un versículo", () => {
    const resultado = evaluarActividadConfigurada(
      {
        tipoCodigo: "completar_versiculo",
        configuracion: { respuesta: "Dios amó al mundo" },
        retroalimentacion: "Muy bien",
      },
      { texto: "  dios amo   al mundo " },
    );

    expect(resultado).toEqual({
      correcta: true,
      puntaje: 100,
      retroalimentacion: "Muy bien",
    });
  });

  it("calcula puntaje parcial de verdadero o falso en el servidor", () => {
    const resultado = evaluarActividadConfigurada(
      {
        tipoCodigo: "verdadero_falso",
        configuracion: {
          afirmaciones: [
            { texto: "A", es_verdadero: true },
            { texto: "B", es_verdadero: false },
            { texto: "C", es_verdadero: true },
            { texto: "D", es_verdadero: false },
          ],
        },
        retroalimentacion: null,
      },
      { respuesta: [true, true, true, false] },
    );

    expect(resultado.correcta).toBe(false);
    expect(resultado.puntaje).toBe(75);
  });

  it("no acepta una confirmación genérica cuando la actividad exige validación del servidor", () => {
    expect(() => evaluarActividadConfigurada(
      {
        tipoCodigo: "actividad_video",
        configuracion: { validacion_servidor: true },
        retroalimentacion: null,
      },
      { confirmacion: true },
    )).toThrow("La actividad multimedia no tiene respuesta correcta configurada");
  });
});
