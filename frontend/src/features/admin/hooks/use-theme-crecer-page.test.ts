import { describe, expect, it } from "bun:test";

import { subirImagenMarkdown } from "./use-theme-crecer-page";

const archivo = new File(["imagen"], "leccion.png", { type: "image/png" });

describe("subirImagenMarkdown", () => {
  it("sube la imagen y retorna la URL firmada para insertarla en Markdown", async () => {
    const llamadas: string[] = [];

    const url = await subirImagenMarkdown(
      archivo,
      async (recibido, tipo) => {
        llamadas.push(`${recibido.name}:${tipo}`);
        return { id: "recurso-1" };
      },
      async (id) => {
        llamadas.push(id);
        return { url: "https://firmada.example/leccion.png" };
      },
    );

    expect(url).toBe("https://firmada.example/leccion.png");
    expect(llamadas).toEqual(["leccion.png:imagen", "recurso-1"]);
  });

  it("propaga el error de subida sin producir una URL para modificar el cuerpo", async () => {
    await expect(
      subirImagenMarkdown(
        archivo,
        async () => {
          throw new Error("Archivo rechazado");
        },
        async () => ({ url: "https://firmada.example/no-debe-usarse.png" }),
      ),
    ).rejects.toThrow("Archivo rechazado");
  });
});
