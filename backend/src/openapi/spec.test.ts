import { describe, expect, it } from "bun:test";
import { openApiSpec } from "./spec";

const spec = openApiSpec as unknown as {
  paths: Record<string, any>;
  components: { schemas: Record<string, any> };
};

describe("openapi spec", () => {
  it("expone parámetros canónicos en español para temas y actividades", () => {
    expect(spec.paths["/temas/{tema_id}"]).toBeDefined();
    expect(spec.paths["/actividades/{actividad_id}"]).toBeDefined();

    expect(spec.paths["/temas/{tema_id}"].get.parameters[0].name).toBe("tema_id");
    expect(spec.paths["/actividades/{actividad_id}"].get.parameters[0].name).toBe("actividad_id");
  });

  it("documenta sendas con claves canónicas en español", () => {
    expect(Object.keys(spec.components.schemas.Senda.properties)).toEqual([
      "id",
      "codigo",
      "nombre",
      "descripcion",
      "color_hex",
      "nombre_icono",
      "orden"
    ]);
  });

  it("documenta libros bíblicos con claves canónicas en español", () => {
    const libros = spec.paths["/catalogo/libros-biblicos"].get.responses[200].content["application/json"].schema;

    expect(Object.keys(libros.properties.datos.items.properties)).toEqual([
      "codigo",
      "nombre",
      "orden",
      "testamento_id"
    ]);
  });

  it("usa logro y no achievement en gamificación", () => {
    expect(Object.keys(spec.components.schemas.LogroUsuario.properties)).toEqual([
      "usuario_id",
      "logro_id",
      "ganado_en",
      "logro"
    ]);
  });
});
