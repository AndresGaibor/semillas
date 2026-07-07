import { describe, expect, it } from "bun:test";
import {
  construirAltaInvitado,
  desenvolverRespuesta,
  normalizarPerfil,
  normalizarUsuario
} from "./contrato";

describe("contrato API", () => {
  it("desenvolverRespuesta devuelve los datos cuando exito es true", () => {
    expect(desenvolverRespuesta({ exito: true, datos: { id: "1" } })).toEqual({ id: "1" });
  });

  it("construirAltaInvitado emite solo claves en español", () => {
    expect(
      construirAltaInvitado({
        apodo: "Semillero",
        grupo_edad_id: "grupo-1",
        url_avatar: "https://ejemplo.com/avatar.png"
      })
    ).toEqual({
      apodo: "Semillero",
      grupo_edad_id: "grupo-1",
      url_avatar: "https://ejemplo.com/avatar.png"
    });
  });

  it("normalizarUsuario preserva las claves españolas", () => {
    expect(
      normalizarUsuario({
        id: "usuario-1",
        rol: "usuario",
        proveedor: "invitado",
        nombre_visible: "Semillero",
        correo: null
      })
    ).toEqual({
      id: "usuario-1",
      rol: "usuario",
      proveedor: "invitado",
      nombre_visible: "Semillero",
      correo: null
    });
  });

  it("normalizarPerfil preserva las claves españolas", () => {
    expect(
      normalizarPerfil({
        id: "perfil-1",
        usuario_id: "usuario-1",
        apodo: "Semillero",
        grupo_edad_id: "grupo-1",
        url_avatar: "https://ejemplo.com/avatar.png",
        clave_avatar: "leaf",
        prefiere_audio: true,
        tamano_texto_preferido: "mediano"
      })
    ).toEqual({
      id: "perfil-1",
      usuario_id: "usuario-1",
      apodo: "Semillero",
      grupo_edad_id: "grupo-1",
      url_avatar: "https://ejemplo.com/avatar.png",
      clave_avatar: "leaf",
      prefiere_audio: true,
      tamano_texto_preferido: "mediano"
    });
  });
});
