import { describe, expect, it } from "bun:test";

import { obtenerNavMovilActivo, obtenerNavegacionMovil } from "./app-mobile-nav";

describe("app-mobile-nav", () => {
  it("expone cuatro accesos principales para móvil sin Sendas", () => {
    const nav = obtenerNavegacionMovil();

    expect(nav).toHaveLength(4);
    expect(nav.map((item) => item.id)).toEqual(["inicio", "jugar", "clubes", "perfil"]);
  });

  it("mapea rutas internas al acceso móvil correcto", () => {
    expect(obtenerNavMovilActivo("/app")).toBe("inicio");
    expect(obtenerNavMovilActivo("/app/temas/xyz")).toBe("jugar");
    expect(obtenerNavMovilActivo("/app/E_ensenar/xyz")).toBe("jugar");
    expect(obtenerNavMovilActivo("/app/clubes")).toBe("clubes");
    expect(obtenerNavMovilActivo("/app/perfil")).toBe("perfil");
  });
});
