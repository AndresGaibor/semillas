import { describe, expect, it } from "bun:test";
import {
  INTERVALO_RENOVACION_PORTADA_ADMIN_MS,
  obtenerIdPortadaTemaAdmin,
  resolverPortadaTemaAdmin,
} from "./admin-theme-cover";

describe("resolverPortadaTemaAdmin", () => {
  it("renueva la firma antes de que venza", () => {
    expect(INTERVALO_RENOVACION_PORTADA_ADMIN_MS).toBeLessThan(300_000);
  });

  it("obtiene el recurso anidado de un tema no publicado", () => {
    expect(
      obtenerIdPortadaTemaAdmin({
        id: "tema-borrador",
        portada_recurso_id: null,
        portada_recurso: { id: "portada-borrador" },
      }),
    ).toBe("portada-borrador");
  });

  it("prioriza la URL firmada sobre la URL pública de un bucket privado", () => {
    expect(
      resolverPortadaTemaAdmin({
        titulo: "El amor de Dios",
        urlFirmada: "https://storage.ejemplo.com/object/sign/media/portada.png?token=temporal",
        urlPublica: "https://storage.ejemplo.com/object/public/media/portada.png",
      }),
    ).toBe("https://storage.ejemplo.com/object/sign/media/portada.png?token=temporal");
  });

  it("muestra una imagen de respaldo cuando el tema no tiene portada", () => {
    expect(
      resolverPortadaTemaAdmin({
        titulo: "El amor de Dios",
        urlFirmada: null,
        urlPublica: null,
      }),
    ).toBe("https://api.dicebear.com/7.x/shapes/svg?seed=El%20amor%20de%20Dios");
  });
});
