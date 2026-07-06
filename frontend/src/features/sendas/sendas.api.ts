import { apiRequest } from "../../shared/api/http";

export type Senda = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  color_hex: string;
  icon_name: string | null;
  sort_order: number;
};

export function getSendas() {
  return apiRequest<Senda[]>("/sendas", {
    auth: false
  });
}
