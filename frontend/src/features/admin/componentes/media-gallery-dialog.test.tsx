import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { MediaGalleryDialog } from "./media-gallery-dialog";

describe("MediaGalleryDialog", () => {
  it("presenta una galería accesible que permite previsualizar recursos antes de elegirlos", () => {
    const html = renderToStaticMarkup(
      <MediaGalleryDialog
        open
        title="Recurso visual"
        acceptedTypes={["imagen", "video"]}
        resources={[{
          id: "recurso-1",
          tipo: "imagen",
          bucket_almacenamiento: "media",
          clave_almacenamiento: "imagen/recurso.png",
          url_publica: "https://example.test/recurso.png",
          texto_alternativo: "Ilustración",
          titulo: "Ilustración de prueba",
          tipo_mime: "image/png",
          tamano_bytes: 1024,
          creado_por: "admin",
          activo: true,
          creado_en: "2026-01-01T00:00:00.000Z",
          actualizado_en: "2026-01-01T00:00:00.000Z",
        }]}
        selectedResourceId="recurso-1"
        onClose={() => undefined}
        onRemove={() => undefined}
        onSelect={() => undefined}
        onUpload={() => undefined}
      />,
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain("Buscar en Medios");
    expect(html).toContain("Imágenes");
    expect(html).toContain("Videos");
    expect(html).toContain("Quitar recurso");
    expect(html).toContain("Ver vista previa de Ilustración de prueba");
    expect(html).toContain('z-[100]');
    expect(html).not.toContain("Texto alternativo");
    expect(html).not.toContain("Subir y seleccionar");
  });
});
