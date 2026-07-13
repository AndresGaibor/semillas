import { describe, expect, it } from "bun:test";
import { ErrorApi } from "@/shared/api/error-api";
import { obtenerMensajeErrorApi } from "@/shared/api/api";

describe("ErrorApi", () => {
  it("preserva el estado HTTP y el codigo del backend", () => {
    const error = new ErrorApi(
      "El correo an***@gmail.com ya pertenece a otra cuenta",
      409,
      "CONFLICTO",
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.estado).toBe(409);
    expect(error.codigo).toBe("CONFLICTO");
    expect(error.message).toBe("El correo an***@gmail.com ya pertenece a otra cuenta");
    expect(error.name).toBe("ErrorApi");
  });
});

describe("obtenerMensajeErrorApi", () => {
  it("extrae un mensaje legible cuando la API devuelve un error estructurado", () => {
    expect(obtenerMensajeErrorApi({ message: "El contenido debe tener al menos 5 caracteres" })).toBe(
      "El contenido debe tener al menos 5 caracteres",
    );
  });
});
