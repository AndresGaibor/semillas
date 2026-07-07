import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { TarjetaMetricaCompacta } from "./card-metrica";
import { FilaListaCompacta } from "./fila-lista-compacta";

describe("primitivos compactos", () => {
  it("renderiza la tarjeta de métrica compacta con icono, valor y subtexto", () => {
    const html = renderToStaticMarkup(
      <TarjetaMetricaCompacta
        titulo="Temas publicados"
        valor={18}
        subtexto="5 temas listos"
        icono={<span>TM</span>}
      />,
    );

    expect(html).toContain("Temas publicados");
    expect(html).toContain(">18<");
    expect(html).toContain("5 temas listos");
    expect(html).toContain("TM");
  });

  it("renderiza la fila compacta con contenido lateral y derecho", () => {
    const html = renderToStaticMarkup(
      <FilaListaCompacta
        izquierda={<span>IC</span>}
        titulo="Revisión semanal"
        subtitulo="Mañana"
        derecha={<span>OK</span>}
      />,
    );

    expect(html).toContain("Revisión semanal");
    expect(html).toContain("Mañana");
    expect(html).toContain("IC");
    expect(html).toContain("OK");
  });
});
