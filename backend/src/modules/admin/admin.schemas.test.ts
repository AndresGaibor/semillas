import { describe, expect, it } from "bun:test";
import {
  createActivitySchema,
  createThemeSchema,
  updateActivitySchema,
  updateThemeSchema,
  upsertStepContentSchema
} from "./admin.schemas";

const temaId = "550e8400-e29b-41d4-a716-446655440000";
const grupoEdadId = "660e8400-e29b-41d4-a716-446655440000";
const pasoId = "770e8400-e29b-41d4-a716-446655440000";
const actividadId = "880e8400-e29b-41d4-a716-446655440000";

describe("admin.schemas", () => {
  it("acepta el DTO canónico en español para crear temas", () => {
    const resultado = createThemeSchema.safeParse({
      senda_id: temaId,
      titulo: "La creación",
      slug: "la-creacion",
      objetivo: "Que el niño entienda que Dios creó todo",
      resumen: "Historia de la creación",
      version_biblica_id: temaId,
      minutos_estimados: 10,
      xp_recompensa: 50,
      grupo_edad_ids: [grupoEdadId]
    });

    expect(resultado.success).toBe(true);
  });

  it("acepta el DTO canónico en español para actualizar temas", () => {
    const resultado = updateThemeSchema.safeParse({
      titulo: "La creación",
      objetivo: "Que el niño entienda que Dios creó todo",
      resumen: "Historia de la creación",
      version_biblica_id: temaId,
      minutos_estimados: 12,
      xp_recompensa: 60,
      grupo_edad_ids: [grupoEdadId]
    });

    expect(resultado.success).toBe(true);
  });

  it("acepta el DTO canónico en español para crear contenido CRECER", () => {
    const resultado = upsertStepContentSchema.safeParse({
      tipo_paso_id: pasoId,
      grupo_edad_id: grupoEdadId,
      titulo: "Conectar",
      cuerpo: "Conecta con la historia bíblica",
      instruccion_corta: "Mira y escucha"
    });

    expect(resultado.success).toBe(true);
  });

  it("acepta el DTO canónico en español para crear actividades", () => {
    const resultado = createActivitySchema.safeParse({
      tema_id: temaId,
      paso_id: pasoId,
      grupo_edad_id: grupoEdadId,
      tipo_actividad_id: actividadId,
      titulo: "Pregunta",
      consigna: "Selecciona la respuesta correcta",
      orden: 1,
      xp_recompensa: 10,
      limite_tiempo_seg: 30,
      dificultad: "facil",
      obligatorio: true,
      retroalimentacion: "Bien hecho",
      configuracion: { intentos: 3 },
      opciones: [
        {
          etiqueta: "A",
          texto: "Dios",
          correcta: true,
          orden: 1,
          retroalimentacion: "Correcto"
        }
      ]
    });

    expect(resultado.success).toBe(true);
  });

  it("acepta el DTO canónico en español para actualizar actividades", () => {
    const resultado = updateActivitySchema.safeParse({
      titulo: "Pregunta",
      consigna: "Selecciona la respuesta correcta",
      retroalimentacion: "Bien hecho",
      orden: 1,
      xp_recompensa: 10,
      limite_tiempo_seg: 30,
      dificultad: "facil",
      obligatorio: true,
      configuracion: { intentos: 3 },
      opciones: [
        {
          etiqueta: "A",
          texto: "Dios",
          correcta: true,
          orden: 1,
          retroalimentacion: "Correcto"
        }
      ]
    });

    expect(resultado.success).toBe(true);
  });
});
