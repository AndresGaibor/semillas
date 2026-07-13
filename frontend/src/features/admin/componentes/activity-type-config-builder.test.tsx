import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  ActivityTypeConfigBuilder,
  obtenerAfirmaciones,
  obtenerPares,
  obtenerListaTexto,
} from "./activity-type-config-builder";

describe("constructores de configuración de actividades", () => {
  it("convierte valores incompletos en filas editables sin cambiar el contrato", () => {
    expect(obtenerAfirmaciones([{ texto: "Dios es amor", es_verdadero: true }])).toMatchObject([
      { texto: "Dios es amor", es_verdadero: true },
    ]);
    expect(obtenerPares([{ izquierda: "Fe", derecha: "Confiar" }])).toEqual([
      { izquierda: "Fe", derecha: "Confiar" },
    ]);
    expect(obtenerListaTexto(["Orar", 12, "Servir"])).toEqual(["Orar", "Servir"]);
  });

  it("muestra constructores visuales y no instrucciones con separadores", () => {
    const html = renderToStaticMarkup(
      <ActivityTypeConfigBuilder
        codigo="verdadero_falso"
        configuracion={{ afirmaciones: [{ texto: "Dios es amor", es_verdadero: true }] }}
        onChange={() => undefined}
        onUpload={() => undefined}
        uploading={false}
      />,
    );

    expect(html).toContain("Afirmaciones");
    expect(html).toContain("Verdadera");
    expect(html).not.toContain("texto|true");
  });

  it("muestra campos separados para una manualidad", () => {
    const html = renderToStaticMarkup(
      <ActivityTypeConfigBuilder
        codigo="manualidad"
        configuracion={{ materiales: ["Papel"], pasos: ["Dobla el papel"] }}
        onChange={() => undefined}
        onUpload={() => undefined}
        uploading={false}
      />,
    );

    expect(html).toContain("Materiales");
    expect(html).toContain("Pasos");
    expect(html).toContain("Agregar material");
  });
});
