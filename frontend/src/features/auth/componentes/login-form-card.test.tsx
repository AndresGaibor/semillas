import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { LoginFormCard } from "./login-form-card";

describe("LoginFormCard", () => {
  it("renderiza tabs de redes sociales y correo", () => {
    const html = renderToStaticMarkup(
      <LoginFormCard
        onGoogleClick={() => undefined}
        onGuestClick={() => undefined}
        onEmailSuccess={() => undefined}
        tabActivo="social"
        onCambiarTab={() => undefined}
      />,
    );

    expect(html).toContain("Redes sociales");
    expect(html).toContain("Correo electrónico");
  });

  it("muestra opciones sociales cuando tabActivo es social", () => {
    const html = renderToStaticMarkup(
      <LoginFormCard
        onGoogleClick={() => undefined}
        onGuestClick={() => undefined}
        onEmailSuccess={() => undefined}
        tabActivo="social"
        onCambiarTab={() => undefined}
      />,
    );

    expect(html).toContain("Continuar con Google");
  });

  it("muestra formulario de correo cuando tabActivo es email", () => {
    const html = renderToStaticMarkup(
      <LoginFormCard
        onGoogleClick={() => undefined}
        onGuestClick={() => undefined}
        onEmailSuccess={() => undefined}
        tabActivo="email"
        onCambiarTab={() => undefined}
      />,
    );

    expect(html).toContain("Iniciar sesión");
  });

  it("no incluye el botón de modo desarrollo", () => {
    const html = renderToStaticMarkup(
      <LoginFormCard
        onGoogleClick={() => undefined}
        onGuestClick={() => undefined}
        onEmailSuccess={() => undefined}
        tabActivo="social"
        onCambiarTab={() => undefined}
      />,
    );

    expect(html).not.toContain("Modo desarrollo");
    expect(html).not.toContain("admin de prueba");
  });
});
