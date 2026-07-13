import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { NuevaActividadDialogContenido, estadosTemaParaNuevaActividad } from "./nueva-actividad-dialog";

describe("NuevaActividadDialog", () => {
  it("consulta los estados editables del tema con nombres en español", () => {
    expect(estadosTemaParaNuevaActividad).toEqual(["borrador", "revision", "publicado"]);
  });

  it("expone un diálogo accesible con cierre explícito", () => {
    const html = renderToStaticMarkup(
      <NuevaActividadDialogContenido
        temas={[]}
        isLoading={false}
        selectedThemeId=""
        onThemeChange={() => undefined}
        onClose={() => undefined}
        onContinue={() => undefined}
      />,
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby="nueva-actividad-titulo"');
    expect(html).toContain('aria-label="Cerrar diálogo"');
  });
});
