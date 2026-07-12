import { describe, expect, it } from "bun:test";

import { esFacebookPermitidoEnOrigen } from "./social-login";

describe("esFacebookPermitidoEnOrigen", () => {
  it("bloquea localhost", () => {
    expect(esFacebookPermitidoEnOrigen("http://localhost:5173")).toBe(false);
  });

  it("bloquea 127.0.0.1", () => {
    expect(esFacebookPermitidoEnOrigen("http://127.0.0.1:5173")).toBe(false);
  });

  it("permite produccion", () => {
    expect(esFacebookPermitidoEnOrigen("https://semillas.pages.dev")).toBe(true);
  });
});
