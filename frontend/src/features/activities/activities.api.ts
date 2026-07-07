import { apiRequest } from "../../shared/api/http";
import type { Activity } from "../themes/themes.api";

export function getActivity(activityId: string) {
  return apiRequest<Activity>(`/actividades/${activityId}`, {
    auth: false
  });
}

export type ResponderActividadPayload = {
  evento_id_cliente: string;
  opcion_id_seleccionada?: string;
  texto_respuesta?: string;
  ocurrido_en_cliente?: string;
  dispositivo_id?: string;
};

export type ResponderActividadRespuesta = {
  resultado: {
    correcta: boolean;
    xp_otorgada: number;
  };
  duplicado: boolean;
  correcta: boolean;
  xp_otorgada: number;
};

export function answerActivity(activityId: string, payload: ResponderActividadPayload) {
  return apiRequest<ResponderActividadRespuesta>(`/actividades/${activityId}/responder`, {
    method: "POST",
    body: payload
  });
}
