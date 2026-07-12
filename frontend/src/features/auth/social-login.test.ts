import { describe, expect, it } from "bun:test";

import { esFacebookPermitidoEnOrigen } from "./social-login";

describe("esFacebookPermitidoEnOrigen", () => {
  it("permite localhost", () => {
    expect(esFacebookPermitidoEnOrigen("http://localhost:5173")).toBe(true);
  });

  it("permite 127.0.0.1", () => {
    expect(esFacebookPermitidoEnOrigen("http://127.0.0.1:5173")).toBe(true);
  });

  it("permite produccion", () => {
    expect(esFacebookPermitidoEnOrigen("https://semillas.pages.dev")).toBe(true);
  });
});
