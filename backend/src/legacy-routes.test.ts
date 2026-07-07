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

describe("legacy routes", () => {
  it("rechaza aliases legacy con 404", async () => {
    const rutasLegacy = ["/auth", "/me", "/themes", "/activities", "/progress", "/admin", "/catalog", "/gamification"];

    const respuestas = await Promise.all(rutasLegacy.map((ruta) => app.fetch(new Request(`http://localhost${ruta}`), env)));

    expect(respuestas.map((response) => response.status)).toEqual([404, 404, 404, 404, 404, 404, 404, 404]);
  });
});
