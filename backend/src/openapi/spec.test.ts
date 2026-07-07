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

  it("documenta el tema detallado con senda, portada, versiculo y referencia biblica", () => {
    const detalle = spec.components.schemas.TemaDetallado.allOf[1].properties;

    expect(Object.keys(detalle)).toEqual(["senda", "portada_recurso", "versiculo_clave", "referencia_biblica"]);
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

  it("documenta actividad con tipo_actividad y opciones", () => {
    expect(Object.keys(spec.components.schemas.Actividad.properties)).toEqual([
      "id",
      "tema_id",
      "paso_id",
      "tipo_actividad_id",
      "grupo_edad_id",
      "titulo",
      "consigna",
      "orden",
      "xp_recompensa",
      "dificultad",
      "limite_tiempo_seg",
      "obligatorio",
      "retroalimentacion",
      "configuracion",
      "creado_en",
      "actualizado_en",
      "tipo_actividad",
      "opciones"
    ]);
    expect(spec.components.schemas.Actividad.properties).not.toHaveProperty("activity_type");
    expect(spec.components.schemas.Actividad.properties).not.toHaveProperty("options");
  });

  it("documenta /progreso/eventos con el envelope canónico exito + datos", () => {
    const responseCreado = spec.paths["/progreso/eventos"].post.responses[201].content["application/json"].schema;
    const responseDuplicado = spec.paths["/progreso/eventos"].post.responses[200].content["application/json"].schema;

    expect(Object.keys(responseCreado.properties)).toEqual(["exito", "datos"]);
    expect(Object.keys(responseCreado.properties.datos.properties)).toEqual(["duplicado", "evento"]);
    expect(Object.keys(responseDuplicado.properties)).toEqual(["exito", "datos"]);
    expect(Object.keys(responseDuplicado.properties.datos.properties)).toEqual(["duplicado", "mensaje"]);
    expect(responseCreado.properties).not.toHaveProperty("duplicado");
    expect(responseDuplicado.properties).not.toHaveProperty("duplicado");
  });
});
