import { describe, expect, it } from "bun:test";
import { serializarActividad } from "./actividad.serializer";
import { serializarPerfil } from "./perfil.serializer";
import { serializarProgresoActividad, serializarProgresoTema, serializarNivelUsuario } from "./progreso.serializer";
import { serializarTema } from "./tema.serializer";
import { serializarUsuario } from "./usuario.serializer";

describe("serializadores", () => {
  it("serializa usuario con claves exactas en español", () => {
    expect(
      serializarUsuario({
        id: "usuario-1",
        rol: "usuario",
        proveedor: "google",
        nombre_visible: "Semillero",
        correo: "semillero@ejemplo.com"
      })
    ).toEqual({
      id: "usuario-1",
      rol: "usuario",
      proveedor: "google",
      nombre_visible: "Semillero",
      correo: "semillero@ejemplo.com"
    });
  });

  it("serializa perfil con claves exactas en español", () => {
    expect(
      serializarPerfil({
        id: "perfil-1",
        usuario_id: "usuario-1",
        apodo: "Semillero",
        grupo_edad_id: "grupo-1",
        url_avatar: "https://cdn.ejemplo.com/avatar.png",
        clave_avatar: "semilla",
        prefiere_audio: true,
        tamano_texto_preferido: "medio"
      })
    ).toEqual({
      id: "perfil-1",
      usuario_id: "usuario-1",
      apodo: "Semillero",
      grupo_edad_id: "grupo-1",
      url_avatar: "https://cdn.ejemplo.com/avatar.png",
      clave_avatar: "semilla",
      prefiere_audio: true,
      tamano_texto_preferido: "medio"
    });
  });

  it("serializa tema con claves exactas en español", () => {
    expect(
      serializarTema({
        id: "tema-1",
        senda_id: "senda-1",
        titulo: "La creación",
        slug: "la-creacion",
        objetivo: "Entender que Dios creó todo",
        resumen: "Resumen",
        portada_recurso_id: "recurso-1",
        estado: "publicado",
        version_biblica_id: "biblia-1",
        xp_recompensa: 50,
        minutos_estimados: 15,
        version_contenido: 2,
        publicado_en: "2026-01-01T00:00:00.000Z"
      })
    ).toEqual({
      id: "tema-1",
      senda_id: "senda-1",
      titulo: "La creación",
      slug: "la-creacion",
      objetivo: "Entender que Dios creó todo",
      resumen: "Resumen",
      portada_recurso_id: "recurso-1",
      estado: "publicado",
      version_biblica_id: "biblia-1",
      xp_recompensa: 50,
      minutos_estimados: 15,
      version_contenido: 2,
      publicado_en: "2026-01-01T00:00:00.000Z"
    });
  });

  it("serializa actividad con claves exactas en español", () => {
    expect(
      serializarActividad({
        id: "actividad-1",
        tema_id: "tema-1",
        paso_id: "paso-1",
        grupo_edad_id: "grupo-1",
        tipo_actividad_id: "tipo-1",
        titulo: "Pregunta",
        consigna: "Selecciona la respuesta",
        orden: 1,
        xp_recompensa: 10,
        dificultad: "facil",
        limite_tiempo_seg: 30,
        obligatorio: true,
        retroalimentacion: "Bien",
        configuracion: { intentos: 3 },
        creado_en: "2026-01-01T00:00:00.000Z",
        actualizado_en: "2026-01-02T00:00:00.000Z"
      })
    ).toEqual({
      id: "actividad-1",
      tema_id: "tema-1",
      paso_id: "paso-1",
      grupo_edad_id: "grupo-1",
      tipo_actividad_id: "tipo-1",
      titulo: "Pregunta",
      consigna: "Selecciona la respuesta",
      orden: 1,
      xp_recompensa: 10,
      dificultad: "facil",
      limite_tiempo_seg: 30,
      obligatorio: true,
      retroalimentacion: "Bien",
      configuracion: { intentos: 3 },
      creado_en: "2026-01-01T00:00:00.000Z",
      actualizado_en: "2026-01-02T00:00:00.000Z"
    });
  });

  it("serializa progreso con claves exactas en español", () => {
    expect(
      serializarProgresoTema({
        usuario_id: "usuario-1",
        tema_id: "tema-1",
        estado: "en_progreso",
        porcentaje: 50,
        iniciado_en: "2026-01-01T00:00:00.000Z",
        completado_en: null,
        ultimo_paso_id: "paso-1",
        actualizado_en: "2026-01-02T00:00:00.000Z"
      })
    ).toEqual({
      usuario_id: "usuario-1",
      tema_id: "tema-1",
      estado: "en_progreso",
      porcentaje: 50,
      iniciado_en: "2026-01-01T00:00:00.000Z",
      completado_en: null,
      ultimo_paso_id: "paso-1",
      actualizado_en: "2026-01-02T00:00:00.000Z"
    });

    expect(
      serializarProgresoActividad({
        usuario_id: "usuario-1",
        actividad_id: "actividad-1",
        intentos: 2,
        mejor_puntaje: 100,
        completado: true,
        completado_en: "2026-01-02T00:00:00.000Z",
        actualizado_en: "2026-01-03T00:00:00.000Z"
      })
    ).toEqual({
      usuario_id: "usuario-1",
      actividad_id: "actividad-1",
      intentos: 2,
      mejor_puntaje: 100,
      completado: true,
      completado_en: "2026-01-02T00:00:00.000Z",
      actualizado_en: "2026-01-03T00:00:00.000Z"
    });
  });

  it("serializa el nivel del usuario con claves exactas en español", () => {
    expect(
      serializarNivelUsuario({
        usuario_id: "usuario-1",
        xp_total: 150,
        numero_nivel: 3,
        nombre_nivel: "Explorador"
      })
    ).toEqual({
      usuario_id: "usuario-1",
      xp_total: 150,
      numero_nivel: 3,
      nombre_nivel: "Explorador"
    });
  });
});
