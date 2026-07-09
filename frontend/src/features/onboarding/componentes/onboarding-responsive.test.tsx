import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { AvatarSelector } from "./AvatarSelector";
import { GrupoEdadCard } from "./GrupoEdadCard";
import { FormNavigation } from "./FormNavigation";
import { OnboardingTopbar } from "./OnboardingTopbar";
import { ProfilePreview } from "./ProfilePreview";

describe("onboarding responsive layout", () => {
  it("expone clases para una estructura móvil compacta", () => {
    const html = renderToStaticMarkup(
      <OnboardingTopbar onHelpClick={() => undefined} />,
    );

    expect(html).toContain("onboarding-topbar");
    expect(html).toContain("onboarding-brand");
    expect(html).toContain("onboarding-help-button");
  });

  it("usa una grilla de avatares adaptativa", () => {
    const html = renderToStaticMarkup(
      <AvatarSelector selectedAvatar={3} onSelect={() => undefined} />,
    );

    expect(html).toContain("onboarding-avatar-grid");
    expect(html).toContain("onboarding-avatar-card");
  });

  it("presenta el preview como una card secundaria", () => {
    const html = renderToStaticMarkup(
      <ProfilePreview selectedAvatar={2} nickname="Ana" />,
    );

    expect(html).toContain("onboarding-preview");
    expect(html).toContain("onboarding-preview-card");
  });

  it("mantiene la navegación como una barra de acciones táctil", () => {
    const html = renderToStaticMarkup(
      <FormNavigation onBack={() => undefined} onFinish={() => undefined} isEnabled isLoading={false} />,
    );

    expect(html).toContain("onboarding-actions");
    expect(html).toContain("onboarding-actions__secondary");
    expect(html).toContain("onboarding-actions__primary");
  });

  it("expande las tarjetas de franja de edad en móvil", () => {
    const html = renderToStaticMarkup(
      <GrupoEdadCard
        grupo={{
          id: "semillas",
          codigo: "semillas",
          nombre: "Semillas",
          edad_minima: 5,
          edad_maxima: 8,
          descripcion: "Descubre a Dios.",
          imagen_url: null,
          orden: 1,
        }}
        seleccionado={false}
        onSelect={() => undefined}
      />,
    );

    expect(html).toContain("onboarding-age-card");
  });
});
