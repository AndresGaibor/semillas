import { apiRequest } from "../../shared/api/http";
import type { Activity } from "../themes/themes.api";

export function getActivity(activityId: string) {
  return apiRequest<Activity>(`/activities/${activityId}`, {
    auth: false
  });
}

export type AnswerActivityPayload = {
  clientEventId: string;
  selectedOptionId?: string;
  answerText?: string;
  occurredAtClient?: string;
  deviceId?: string;
};

export type AnswerActivityResponse = {
  isCorrect: boolean;
  xpAwarded: number;
};

export function answerActivity(activityId: string, payload: AnswerActivityPayload) {
  return apiRequest<{
    result: AnswerActivityResponse;
  }>(`/activities/${activityId}/answer`, {
    method: "POST",
    body: payload
  });
}
