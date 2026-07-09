import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { archivarTema, duplicarTema } from "./admin.api";

const originalFetch = globalThis.fetch;
const originalLocalStorage = globalThis.localStorage;

beforeEach(() => {
  globalThis.fetch = originalFetch;
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
    clear: () => undefined,
    key: () => null,
    length: 0
  } as Storage;
});

afterEach(() => {
  globalThis.localStorage = originalLocalStorage;
});

describe("admin.api", () => {
  it("expone una mutación para archivar temas", async () => {
    let metodo = "";
    let ruta = "";

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      metodo = request.method;
      ruta = new URL(request.url).pathname;

      return new Response(JSON.stringify({ exito: true, datos: { id: "tema-1", estado: "archivado" } }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }) as typeof fetch;

    const resultado = await archivarTema("tema-1");

    expect(metodo).toBe("POST");
    expect(ruta).toBe("/administracion/temas/tema-1/archivar");
    expect(resultado.estado).toBe("archivado");
  });

  it("expone una mutación para duplicar temas", async () => {
    let metodo = "";
    let ruta = "";

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      metodo = request.method;
      ruta = new URL(request.url).pathname;

      return new Response(JSON.stringify({
        exito: true,
        datos: {
          id: "tema-duplicado",
          slug: "la-creacion-copia-12345678",
          estado: "borrador"
        }
      }), {
        status: 201,
        headers: { "content-type": "application/json" }
      });
    }) as typeof fetch;

    const resultado = await duplicarTema("tema-1");

    expect(metodo).toBe("POST");
    expect(ruta).toBe("/administracion/temas/tema-1/duplicar");
    expect(resultado.id).toBe("tema-duplicado");
    expect(resultado.estado).toBe("borrador");
  });
});
