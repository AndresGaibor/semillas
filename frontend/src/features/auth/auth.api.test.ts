import { describe, expect, it, mock } from "bun:test";

const peticionMock = mock(async () => ({
  usuario: { id: "usuario-1" },
  perfil: { id: "perfil-1" },
  autenticacion: { tipo: "invitado", encabezado: "x-guest-user-id", valor: "abc" },
}));

mock.module("../../shared/api/api", () => ({
  peticion: peticionMock,
}));

const iniciarSesionGoogleMock = mock(async () => "https://supabase.example/auth/v1/authorize");

mock.module("../../shared/auth/supabase", () => ({
  iniciarSesionGoogle: iniciarSesionGoogleMock,
}));

describe("auth.api", () => {
  it("crearSesionInvitado envía apodo y lee usuario/perfil/autenticacion", async () => {
    const { crearSesionInvitado } = await import("./auth.api");

    const respuesta = await crearSesionInvitado({
      apodo: "Semillero",
      grupo_edad_id: "grupo-1",
      url_avatar: "https://ejemplo.com/avatar.png",
    });

    expect(peticionMock).toHaveBeenCalledWith("/autenticacion/invitado", {
      metodo: "POST",
      cuerpo: {
        apodo: "Semillero",
        grupo_edad_id: "grupo-1",
        url_avatar: "https://ejemplo.com/avatar.png",
      },
      autenticar: false,
    });
    expect(respuesta.usuario.id).toBe("usuario-1");
    expect(respuesta.perfil.id).toBe("perfil-1");
    expect(respuesta.autenticacion.encabezado).toBe("x-guest-user-id");
  });

  it("iniciarSesionGoogle delega al helper compartido", async () => {
    const { iniciarSesionGoogle } = await import("./auth.api");

    const url = await iniciarSesionGoogle("https://semillas.org/app");

    expect(iniciarSesionGoogleMock).toHaveBeenCalledWith("https://semillas.org/app");
    expect(url).toBe("https://supabase.example/auth/v1/authorize");
  });
});
