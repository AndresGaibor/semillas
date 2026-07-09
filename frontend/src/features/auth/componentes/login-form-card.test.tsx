import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { LoginFormCard } from "./login-form-card";

describe("LoginFormCard", () => {
  it("desactiva Facebook visualmente", () => {
    const html = renderToStaticMarkup(
      <LoginFormCard
        onGoogleClick={() => undefined}
        onFacebookClick={() => undefined}
        onGuestClick={() => undefined}
        onDevAdminClick={() => undefined}
      />,
    );

    expect(html).toContain("Facebook desactivado");
    expect(html).toContain("disabled");
  });

  it("muestra estado de carga para Google", () => {
    const html = renderToStaticMarkup(
      <LoginFormCard
        onGoogleClick={() => undefined}
        onFacebookClick={() => undefined}
        onGuestClick={() => undefined}
        onDevAdminClick={() => undefined}
        googlePending={true}
      />,
    );

    expect(html).toContain("Conectando...");
  });
});
