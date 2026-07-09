import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { TemasSearchBar } from "./temas-search-bar";

describe("TemasSearchBar mobile", () => {
  it("queda oculta en móvil", () => {
    const html = renderToStaticMarkup(
      <TemasSearchBar valor="" onChange={() => undefined} />,
    );

    expect(html).toContain("hidden gap-4 mb-6 flex-wrap md:flex");
  });
});
