import { describe, expect, it } from "bun:test";
import app from "./app";
import type { AppBindings } from "./config/env";

const env: AppBindings["Bindings"] = {
  APP_ENV: "development",
  CORS_ORIGIN: "http://localhost:3000",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
  SUPABASE_SERVER_KEY: "test-server-key",
  SUPABASE_PROJECT_REF: "test-project-ref"
};

describe("app", () => {
  it("expone la raiz de la API en español", async () => {
    const response = await app.fetch(new Request("http://localhost/"), env);
    const body = (await response.json()) as {
      exito: true;
      datos: { nombre: string; version: string };
    };

    expect(response.status).toBe(200);
    expect(body).toEqual({
      exito: true,
      datos: {
        nombre: "Semillas",
        version: "0.1.0"
      }
    });
  });

  it("mantiene viva la ruta health", async () => {
    const response = await app.fetch(new Request("http://localhost/health"), env);
    const body = (await response.json()) as {
      exito: true;
      datos: { estado: string; entorno: string };
    };

    expect(response.status).toBe(200);
    expect(body).toEqual({
      exito: true,
      datos: {
        estado: "healthy",
        entorno: "development"
      }
    });
  });
});
