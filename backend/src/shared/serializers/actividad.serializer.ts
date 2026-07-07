export type FilaActividad = {
  id: string;
  tema_id: string;
  paso_id: string | null;
  grupo_edad_id: string;
  tipo_actividad_id: string;
  titulo: string;
  consigna: string;
  orden: number;
  xp_recompensa: number;
  dificultad: string;
  limite_tiempo_seg: number | null;
  obligatorio: boolean;
  retroalimentacion: string | null;
  configuracion: Record<string, unknown>;
  creado_en: string;
  actualizado_en: string;
};

export function serializarActividad(fila: FilaActividad) {
  return {
    id: fila.id,
    tema_id: fila.tema_id,
    paso_id: fila.paso_id,
    grupo_edad_id: fila.grupo_edad_id,
    tipo_actividad_id: fila.tipo_actividad_id,
    titulo: fila.titulo,
    consigna: fila.consigna,
    orden: fila.orden,
    xp_recompensa: fila.xp_recompensa,
    dificultad: fila.dificultad,
    limite_tiempo_seg: fila.limite_tiempo_seg,
    obligatorio: fila.obligatorio,
    retroalimentacion: fila.retroalimentacion,
    configuracion: fila.configuracion,
    creado_en: fila.creado_en,
    actualizado_en: fila.actualizado_en
  };
}
