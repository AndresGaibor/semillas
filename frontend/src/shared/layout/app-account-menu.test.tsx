import { describe, expect, it } from "bun:test";

import { OPCIONES_CUENTA } from "./app-account-menu";

describe("AppAccountMenu", () => {
  it("expone las opciones secundarias esperadas", () => {
    expect(OPCIONES_CUENTA.map((opcion) => opcion.label)).toEqual([
      "Mi perfil",
      "Preferencias",
      "Mis insignias",
      "Descargas",
    ]);
  });
});
