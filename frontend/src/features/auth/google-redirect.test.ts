import { describe, expect, it } from "bun:test";

import { obtenerRedirectGoogle } from "./google-redirect";

describe("obtenerRedirectGoogle", () => {
  it("apunta a app", () => {
    expect(obtenerRedirectGoogle("http://localhost:5173")).toBe("http://localhost:5173/app");
  });
});
