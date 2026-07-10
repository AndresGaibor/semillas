import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { HttpError } from "../errors/http-error";
import { errorHandler } from "./error-handler";

describe("errorHandler", () => {
  it("expone el detalle de HttpError en la respuesta", async () => {
    const app = new Hono<AppBindings>();

    app.get("/", () => {
      throw new HttpError(409, "Conflicto", "CONFLICT", {
        recurso: "tema"
      });
    });

    app.onError(errorHandler);

    const response = await app.fetch(new Request("http://localhost/"), {
      APP_ENV: "test",
      CORS_ORIGIN: "http://localhost",
      SUPABASE_URL: "https://ejemplo.supabase.co",
      SUPABASE_ANON_KEY: "anon-key-de-prueba",
      SUPABASE_SERVICE_ROLE_KEY: "service-key-de-prueba"
    });

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      exito: false,
      error: "Conflicto",
      codigo: "CONFLICT",
      detalle: {
        recurso: "tema"
      }
    });
  });
});
