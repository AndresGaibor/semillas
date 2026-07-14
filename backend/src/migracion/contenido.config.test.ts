import { describe, test, expect } from "bun:test";
import { cargarConfiguracionMigracion } from "./contenido.config.ts";

const ENTORNO_COMPLETO = {
  ORIGEN_SUPABASE_URL: "https://origen.supabase.co",
  ORIGEN_SUPABASE_SECRET_KEY: "sk-origen-xxxx",
  ORIGEN_SUPABASE_DATABASE_URL: "postgresql://postgres:pass@origen/db",
  DESTINO_SUPABASE_URL: "https://destino.supabase.co",
  DESTINO_SUPABASE_SECRET_KEY: "sk-destino-yyyy",
  DESTINO_SUPABASE_DATABASE_URL: "postgresql://postgres:pass@destino/db",
};

describe("cargarConfiguracionMigracion", () => {
  test("rechaza entorno vacío lanzando error sin exponer secretos", () => {
    expect(() => cargarConfiguracionMigracion({})).toThrow(/faltantes/i);
  });

  test("el mensaje de error no incluye valores de credenciales", () => {
    const entornoParcial = {
      ORIGEN_SUPABASE_SECRET_KEY: "clave-super-secreta-12345",
    };
    let mensajeError = "";
    try {
      cargarConfiguracionMigracion(entornoParcial);
    } catch (e) {
      mensajeError = String(e);
    }
    expect(mensajeError).not.toContain("clave-super-secreta-12345");
    expect(mensajeError).toContain("ORIGEN_SUPABASE_URL");
  });

  test("acepta entorno completo con DESTINO_SUPABASE_DATABASE_URL explícita", () => {
    const config = cargarConfiguracionMigracion(ENTORNO_COMPLETO);

    expect(config.origen.url).toBe("https://origen.supabase.co");
    expect(config.destino.url).toBe("https://destino.supabase.co");
    expect(config.destino.databaseUrl).toBe("postgresql://postgres:pass@destino/db");
    expect(config.destinoAdminAuthUserId).toBeUndefined();
  });

  test("usa SUPABASE_DATABASE_URL como fallback para el destino", () => {
    const { DESTINO_SUPABASE_DATABASE_URL: _, ...sinDestinoDB } = ENTORNO_COMPLETO;
    const config = cargarConfiguracionMigracion({
      ...sinDestinoDB,
      SUPABASE_DATABASE_URL: "postgresql://postgres:pass@fallback/db",
    });

    expect(config.destino.databaseUrl).toBe("postgresql://postgres:pass@fallback/db");
  });

  test("lee DESTINO_ADMIN_AUTH_USER_ID cuando está presente", () => {
    const config = cargarConfiguracionMigracion({
      ...ENTORNO_COMPLETO,
      DESTINO_ADMIN_AUTH_USER_ID: "uuid-del-admin-nuevo",
    });

    expect(config.destinoAdminAuthUserId).toBe("uuid-del-admin-nuevo");
  });

  test("falla si no hay database URL para el destino (ni directa ni fallback)", () => {
    const { DESTINO_SUPABASE_DATABASE_URL: _, ...sinDestinoDB } = ENTORNO_COMPLETO;
    expect(() => cargarConfiguracionMigracion(sinDestinoDB)).toThrow(
      /DESTINO_SUPABASE_DATABASE_URL/
    );
  });
});
