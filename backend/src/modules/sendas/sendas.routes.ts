import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { responderExito } from "../../shared/http/respuesta";

function serializarSenda(senda: Record<string, unknown>) {
  return {
    id: String(senda.id ?? ""),
    codigo: String(senda.codigo ?? senda.code ?? ""),
    nombre: String(senda.nombre ?? senda.name ?? ""),
    descripcion: (senda.descripcion ?? senda.description ?? null) as string | null,
    color_hex: String(senda.color_hex ?? ""),
    nombre_icono: (senda.nombre_icono ?? senda.icon_name ?? null) as string | null,
    orden: Number(senda.orden ?? senda.sort_order ?? 0)
  };
}

export const sendasRoutes = new Hono<AppBindings>();

sendasRoutes.get("/", async (c) => {
  const db = c.get("db");

  const { data, error } = await db
    .from("senda")
    .select("id, codigo, nombre, descripcion, color_hex, nombre_icono, orden")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) {
    throw error;
  }

  return responderExito((data ?? []).map((senda) => serializarSenda(senda as Record<string, unknown>)));
});
