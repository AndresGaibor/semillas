import { describe, expect, it } from "bun:test";

import {
  normalizarConfiguracionActividad,
  validarActividadParaGuardar,
} from "./activity-configuration";

describe("normalizarConfiguracionActividad", () => {
  it("usa es_verdadero para las afirmaciones de verdadero o falso", () => {
    expect(
      normalizarConfiguracionActividad("verdadero_falso", {
        afirmaciones: [{ texto: "Dios es amor", correcta: true }],
      }),
    ).toEqual({
      afirmaciones: [{ texto: "Dios es amor", es_verdadero: true }],
    });
  });

  it("guarda el orden de arrastrar y soltar como índices", () => {
    expect(
      normalizarConfiguracionActividad("arrastrar_soltar", {
        items: ["Orar", "Escuchar", "Compartir"],
      }),
    ).toEqual({
      items: ["Orar", "Escuchar", "Compartir"],
      orden_correcto: [0, 1, 2],
    });
  });

  it("convierte la letra de una canción en líneas", () => {
    expect(
      normalizarConfiguracionActividad("cancion", {
        letra: "Dios es bueno\nSiempre fiel",
      }),
    ).toEqual({
      letra: ["Dios es bueno", "Siempre fiel"],
    });
  });

  it("reemplaza una secuencia inválida por el orden de los elementos", () => {
    expect(
      normalizarConfiguracionActividad("arrastrar_soltar", {
        items: ["Orar", "Escuchar"],
        orden_correcto: [0, 0],
      }),
    ).toEqual({
      items: ["Orar", "Escuchar"],
      orden_correcto: [0, 1],
    });
  });
});

describe("validarActividadParaGuardar", () => {
  it("rechaza un cuestionario sin una única respuesta correcta", () => {
    const resultado = validarActividadParaGuardar({
      codigo: "cuestionario",
      configuracion: {},
      opciones: [
        { etiqueta: "A", texto: "Primera", correcta: false, orden: 1 },
        { etiqueta: "B", texto: "Segunda", correcta: false, orden: 2 },
      ],
    });

    expect(resultado).toContain("exactamente una respuesta correcta");
  });

  it("rechaza una actividad de video sin URL", () => {
    const resultado = validarActividadParaGuardar({
      codigo: "actividad_video",
      configuracion: {},
      opciones: [],
    });

    expect(resultado).toContain("URL del video");
  });

  it("rechaza afirmaciones de verdadero o falso incompletas", () => {
    const resultado = validarActividadParaGuardar({
      codigo: "verdadero_falso",
      configuracion: { afirmaciones: [{ texto: "Dios es amor" }] },
      opciones: [],
    });

    expect(resultado).toContain("afirmaciones");
  });

  it("rechaza una secuencia con índices duplicados", () => {
    const resultado = validarActividadParaGuardar({
      codigo: "arrastrar_soltar",
      configuracion: {
        items: ["Orar", "Escuchar"],
        orden_correcto: [0, 0],
      },
      opciones: [],
    });

    expect(resultado).toContain("orden válido");
  });
});
