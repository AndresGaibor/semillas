import { describe, expect, it, mock } from "bun:test";

const apiRequestMock = mock(async () => ({
  usuario: { id: "usuario-1" },
  perfil: { id: "perfil-1" },
  autenticacion: { tipo: "invitado", encabezado: "x-guest-user-id", valor: "abc" }
}));

mock.module("../../shared/api/http", () => ({
  apiRequest: apiRequestMock
}));

describe("auth.api", () => {
  it("createGuestSession envía apodo y lee usuario/perfil/autenticacion", async () => {
    const { createGuestSession } = await import("./auth.api");

    const respuesta = await createGuestSession({
      apodo: "Semillero",
      grupo_edad_id: "grupo-1",
      url_avatar: "https://ejemplo.com/avatar.png"
    });

    expect(apiRequestMock).toHaveBeenCalledWith("/autenticacion/invitado", {
      method: "POST",
      body: {
        apodo: "Semillero",
        grupo_edad_id: "grupo-1",
        url_avatar: "https://ejemplo.com/avatar.png"
      },
      auth: false
    });
    expect(respuesta.usuario.id).toBe("usuario-1");
    expect(respuesta.perfil.id).toBe("perfil-1");
    expect(respuesta.autenticacion.encabezado).toBe("x-guest-user-id");
  });
});
