import type { Actividad } from "@/shared/api/api";

const BASE_ACTIVITY: Actividad = {
  id: "activity-story-001", tema_id: "theme-story-001", paso_id: null, grupo_edad_id: "group-exploradores", tipo_actividad_id: "type-quiz", titulo: "Los frutos del Espíritu", consigna: "Selecciona la respuesta correcta.", orden: 1, xp_recompensa: 25, dificultad: "facil", limite_tiempo_seg: null, obligatorio: true, retroalimentacion: "¡Muy bien!", configuracion: {},
  tipo_actividad: { id: "type-quiz", codigo: "cuestionario", nombre: "Quiz bíblico", descripcion: "Actividad de selección", es_juego: true, activo: true, creado_en: "2026-07-01T12:00:00.000Z" }, opciones: [],
};

export function buildActivity(overrides: Partial<Actividad> = {}): Actividad {
  return { ...BASE_ACTIVITY, ...overrides, tipo_actividad: { ...BASE_ACTIVITY.tipo_actividad, ...overrides.tipo_actividad } };
}

export const activityEmptyFixture = buildActivity({ opciones: [] });
export const activityTypicalFixture = buildActivity({ opciones: [
  { id: "option-story-001", actividad_id: "activity-story-001", etiqueta: "A", texto: "Amor", orden: 1, correcta: true, retroalimentacion: "Correcto" },
  { id: "option-story-002", actividad_id: "activity-story-001", etiqueta: "B", texto: "Enojo", orden: 2, correcta: false, retroalimentacion: "Intenta de nuevo" },
] });
