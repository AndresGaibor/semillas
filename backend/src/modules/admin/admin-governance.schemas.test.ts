import { describe, expect, it } from "bun:test";
import {
  createAdminUserSchema,
  reportsQuerySchema,
  reviewListQuerySchema,
  updatePlatformSettingsSchema,
} from "./admin.schemas";

describe("admin governance schemas", () => {
  it("valida la creación de una cuenta administrativa completa", () => {
    const result = createAdminUserSchema.safeParse({
      correo: "persona@semillas.test",
      password: "Temporal-2026",
      nombre_visible: "Persona Semillas",
      apodo: "Persona",
      rol: "usuario",
      grupo_edad_id: "660e8400-e29b-41d4-a716-446655440000",
      prefiere_audio: true,
      tamano_texto_preferido: "mediano",
      confirmar_correo: true,
    });

    expect(result.success).toBe(true);
  });

  it("rechaza credenciales y perfiles inválidos", () => {
    expect(createAdminUserSchema.safeParse({
      correo: "correo-invalido",
      password: "123",
      nombre_visible: "A",
    }).success).toBe(false);
  });

  it("normaliza paginación y limita estados de revisión", () => {
    const result = reviewListQuerySchema.parse({ limit: "12", offset: "24", estado: "enviado" });

    expect(result).toMatchObject({ limit: 12, offset: 24, estado: "enviado" });
  });

  it("acepta solo rangos ordenados de hasta 366 días", () => {
    expect(reportsQuerySchema.safeParse({ desde: "2026-07-01", hasta: "2026-07-31" }).success).toBe(true);
    expect(reportsQuerySchema.safeParse({ desde: "2026-08-01", hasta: "2026-07-01" }).success).toBe(false);
    expect(reportsQuerySchema.safeParse({ desde: "2025-01-01", hasta: "2026-07-01" }).success).toBe(false);
  });

  it("acepta ajustes completos y rechaza un correo de soporte inválido", () => {
    const base = {
      nombre_plataforma: "Semillas",
      zona_horaria: "America/Guayaquil",
      notas_obligatorias_cambios: true,
      notas_obligatorias_rechazo: true,
    };

    expect(updatePlatformSettingsSchema.safeParse({ ...base, correo_soporte: "" }).success).toBe(true);
    expect(updatePlatformSettingsSchema.safeParse({ ...base, correo_soporte: "soporte@semillas.test" }).success).toBe(true);
    expect(updatePlatformSettingsSchema.safeParse({ ...base, correo_soporte: "correo-invalido" }).success).toBe(false);
  });
});
