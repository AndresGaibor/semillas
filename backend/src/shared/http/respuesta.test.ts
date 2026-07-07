import { describe, expect, it } from "bun:test";
import { responderError, responderExito } from "./respuesta";

describe("respuesta HTTP", () => {
  it("serializa la respuesta de exito en el envelope canónico", async () => {
    const response = responderExito({ id: "1" });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      exito: true,
      datos: { id: "1" }
    });
  });

  it("serializa la respuesta de error en el envelope canónico", async () => {
    const response = responderError("No encontrado", "NO_ENCONTRADO");

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      exito: false,
      error: "No encontrado",
      codigo: "NO_ENCONTRADO"
    });
  });
});
