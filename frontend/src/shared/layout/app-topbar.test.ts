import { describe, expect, it } from "bun:test";

import { obtenerDatosCuentaTopbar } from "./app-topbar";

describe("obtenerDatosCuentaTopbar", () => {
  it("muestra Invitado cuando el usuario es invitado", () => {
    const cuenta = obtenerDatosCuentaTopbar(
      { apodo: "Semillero", url_avatar: null } as never,
      { proveedor: "invitado", correo: null, nombre_visible: "Semillero" } as never,
    );

    expect(cuenta.nombre).toBe("Invitado");
    expect(cuenta.correo).toBe("Invitado");
    expect(cuenta.avatarUrl).toBeTruthy();
  });

  it("usa el apodo y correo de la cuenta real", () => {
    const cuenta = obtenerDatosCuentaTopbar(
      { apodo: "Semillero", url_avatar: "1" } as never,
      { proveedor: "correo", correo: "admin@semillas.org", nombre_visible: "Semillero" } as never,
    );

    expect(cuenta.nombre).toBe("Semillero");
    expect(cuenta.correo).toBe("admin@semillas.org");
  });
});
