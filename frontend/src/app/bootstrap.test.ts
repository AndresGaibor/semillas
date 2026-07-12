import { describe, expect, it } from "bun:test";
import { ErrorApi } from "@/shared/api/error-api";
import { clasificarErrorVinculacion } from "./bootstrap";

describe("clasificarErrorVinculacion", () => {
  it("devuelve conflicto para ErrorApi 409", () => {
    const error = new ErrorApi(
      "El correo an***@gmail.com ya pertenece a otra cuenta",
      409,
      "CONFLICTO",
    );

    const resultado = clasificarErrorVinculacion(error);

    expect(resultado.tipo).toBe("conflicto");
    if (resultado.tipo === "conflicto") {
      expect(resultado.mensaje).toContain("an***@gmail.com");
    }
  });

  it("devuelve error para ErrorApi 401", () => {
    const error = new ErrorApi("No autorizado", 401, "NO_AUTORIZADO");

    const resultado = clasificarErrorVinculacion(error);

    expect(resultado.tipo).toBe("error");
  });

  it("devuelve error para excepciones genericas", () => {
    const resultado = clasificarErrorVinculacion(new Error("red caida"));

    expect(resultado.tipo).toBe("error");
  });
});
