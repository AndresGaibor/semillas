import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { AdminMediaDetailPanel } from "./admin-media-detail-panel";

const recurso = {
  id: "recurso-1",
  nombre: "Ilustración de prueba",
  tipo: "imagen" as const,
  tipoLabel: "Imagen",
  imgUrl: "https://example.test/recurso.png",
  usadoEnCount: 3,
  subidoPor: "admin",
  fechaSubido: "1 ene 2026, 10:00",
  fechaTimestamp: 1704103200000,
  tamano: "42 KB",
  tamanoBytes: 43_008,
  formato: "PNG",
  tipoMime: "image/png",
  resolucion: "1200 × 800 px",
  dimensiones: "1200 × 800 px",
  anchoPx: 1200,
  altoPx: 800,
  duracionSeg: null,
  altText: "Una ilustración sobre la creación",
};

describe("AdminMediaDetailPanel", () => {
  it("muestra un inspector compacto con acciones y metadatos reales", () => {
    const html = renderToStaticMarkup(
      <AdminMediaDetailPanel
        selectedResource={recurso}
        onClose={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(html).toContain("Detalles del recurso");
    expect(html).toContain("Ilustración de prueba");
    expect(html).toContain("Copiar URL");
    expect(html).toContain("Abrir archivo");
    expect(html).toContain("Información técnica");
    expect(html).toContain("Texto alternativo");
    expect(html).toContain("Usado en 3 contenidos");
    expect(html).toContain("Eliminar recurso");
    expect(html).toContain('aria-label="Cerrar inspector"');
  });
});
