import { apiRequest } from "../../shared/api/http";
import type { SendaApi } from "../../shared/api/contrato";

export type Senda = SendaApi;

export function getSendas() {
  return apiRequest<Senda[]>("/sendas", {
    auth: false
  });
}
