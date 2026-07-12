import { describe, expect, it } from "bun:test";
import { ErrorApi } from "@/shared/api/error-api";

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
