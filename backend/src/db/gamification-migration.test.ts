import { expect, test } from "bun:test";

const rutaMigracion = new URL("../../../supabase/migrations/20260712000006_logro_usuario_reclamado_en.sql", import.meta.url);
const rutaScriptInseguro = new URL("../../../scripts/migrar-reclamado-en.ts", import.meta.url);
const rutaEsquemaBase = new URL("../../../semilla_base.sql", import.meta.url);

test("versiona la columna reclamado_en para los logros existentes", async () => {
  const migracion = await Bun.file(rutaMigracion).text();

  expect(migracion).toContain("ALTER TABLE logro_usuario");
  expect(migracion).toContain("ADD COLUMN IF NOT EXISTS reclamado_en TIMESTAMPTZ");
  expect(migracion).toContain("SET reclamado_en = ganado_en");
});

test("no conserva el script de migración con credenciales", () => {
  expect(Bun.file(rutaScriptInseguro).size).toBe(0);
});

test("declara reclamado_en en el esquema base de logro_usuario", async () => {
  const esquemaBase = await Bun.file(rutaEsquemaBase).text();
  const bloqueLogroUsuario = esquemaBase.match(/CREATE TABLE IF NOT EXISTS logro_usuario \(([\s\S]*?)\n\);/i)?.[1] ?? "";

  expect(bloqueLogroUsuario).toMatch(/reclamado_en\s+timestamptz/i);
});
