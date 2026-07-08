import { peticion } from "../../shared/api/api";
import type { Actividad } from "../../shared/api/api";

export function obtenerActividad(idActividad: string) {
  return peticion<Actividad>(`/actividades/${idActividad}`, {
    autenticar: false,
  });
}

export function obtenerActividades() {
  return peticion<Actividad[]>("/actividades");
}

export function responderActividad(
  idActividad: string,
  datos: {
    evento_id_cliente: string;
    opcion_id_seleccionada?: string;
    texto_respuesta?: string;
    ocurrido_en_cliente?: string;
    dispositivo_id?: string;
  }
) {
  return peticion<{
    resultado: { correcta: boolean; xp_otorgada: number };
    duplicado: boolean;
  }>(`/actividades/${idActividad}/responder`, {
    metodo: "POST",
    cuerpo: datos,
  });
}
