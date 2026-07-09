import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ProfileDashboard } from "./profile-dashboard";

describe("ProfileDashboard", () => {
  it("muestra resumen de XP, logros y progreso", () => {
    const html = renderToStaticMarkup(
      <ProfileDashboard
        usuario={{
          id: "usuario-1",
          rol: "usuario",
          proveedor: "google",
          nombre_visible: "Semillero",
          correo: "semillero@ejemplo.com",
        }}
        perfil={{
          id: "perfil-1",
          usuario_id: "usuario-1",
          apodo: "Semillero",
          grupo_edad_id: "grupo-1",
          url_avatar: null,
          clave_avatar: null,
          prefiere_audio: true,
          tamano_texto_preferido: "medium",
        }}
        gamificacion={{
          nivel: {
            usuario_id: "usuario-1",
            xp_total: 180,
            numero_nivel: 4,
            nombre_nivel: "Explorador",
          },
          logros: [
            {
              usuario_id: "usuario-1",
              logro_id: "logro-1",
              ganado_en: "2026-01-01T00:00:00.000Z",
              logro: {
                id: "logro-1",
                codigo: "primer-paso",
                nombre: "Primer paso",
                descripcion: "Completó su primer tema",
                codigo_criterio: "temas_completados",
                valor_criterio: 1,
                bono_xp: 25,
                url_icono: null,
                activo: true,
                creado_en: "2026-01-01T00:00:00.000Z",
              },
            },
          ],
        }}
        progreso={{
          progresos_tema: [
            {
              usuario_id: "usuario-1",
              tema_id: "tema-1",
              estado: "completado",
              porcentaje: 100,
              iniciado_en: "2026-01-01T00:00:00.000Z",
              completado_en: "2026-01-02T00:00:00.000Z",
              ultimo_paso_id: "paso-1",
              actualizado_en: "2026-01-02T00:00:00.000Z",
            },
          ],
          progresos_actividad: [
            {
              usuario_id: "usuario-1",
              actividad_id: "actividad-1",
              intentos: 2,
              mejor_puntaje: 100,
              completado: true,
              completado_en: "2026-01-02T00:00:00.000Z",
              actualizado_en: "2026-01-02T00:00:00.000Z",
            },
          ],
        }}
        onVincularGoogle={() => undefined}
        onVincularCorreo={() => undefined}
      />,
    );

    expect(html).toContain("XP total");
    expect(html).toContain("180");
    expect(html).toContain("Primer paso");
    expect(html).toContain("Temas completados");
    expect(html).toContain("1");
    expect(html).toContain("Vincular Google");
  });

  it("muestra acciones de vinculación para invitado", () => {
    const html = renderToStaticMarkup(
      <ProfileDashboard
        usuario={{
          id: "usuario-guest",
          rol: "invitado",
          proveedor: "invitado",
          nombre_visible: "Visitante",
          correo: null,
        }}
        perfil={{
          id: "perfil-guest",
          usuario_id: "usuario-guest",
          apodo: "Visitante",
          grupo_edad_id: null,
          url_avatar: null,
          clave_avatar: null,
          prefiere_audio: false,
          tamano_texto_preferido: "medium",
        }}
        gamificacion={{ nivel: null, logros: [] }}
        progreso={{ progresos_tema: [], progresos_actividad: [] }}
        onVincularGoogle={() => undefined}
        onVincularCorreo={() => undefined}
      />,
    );

    expect(html).toContain("Vincular con Google");
    expect(html).toContain("Vincular con correo");
  });
});
