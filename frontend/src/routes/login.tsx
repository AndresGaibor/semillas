import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { LoginFormCard } from "../features/auth/componentes/login-form-card";
import { LoginHeroPanel } from "../features/auth/componentes/login-hero-panel";
import { useLoginPage } from "../features/auth/hooks/use-login-page";
import logoImg from "@/assets/images/logos/Logotipo.png";
import "../estilos.css";
import "./login.css";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/onboarding",
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const {
    tabActivo,
    setTabActivo,
    guestMutation,
    googleMutation,
    facebookMutation,
    facebookDisponible,
    handleEmailSuccess,
  } = useLoginPage({
    redirectTo: search.redirect,
  });

  return (
    <div className="login-page">
      <div className="login-shell">
        <header className="login-topbar" role="banner">
          <Link to="/" className="login-brand" aria-label="Ir al inicio de Semillas">
            <img src={logoImg} alt="Logo de Semillas" className="login-brand__img" width="56" height="56" />
            <div className="login-brand__text">
              <span className="login-brand__name">Semillas</span>
              <span className="login-brand__tagline">Crecer en la Palabra, vivir Su verdad</span>
            </div>
          </Link>

          <div className="login-lang" aria-label="Idioma actual: Español">
            <Globe size={20} aria-hidden="true" />
            <span className="login-lang__label login-lang__label--full">Español</span>
            <span className="login-lang__label login-lang__label--compact" aria-hidden="true">ES</span>
          </div>
        </header>

        <main className="login-main" id="main-content" role="main">
          <LoginFormCard
            onGoogleClick={() => googleMutation.mutate()}
            onFacebookClick={() => facebookMutation.mutate()}
            onGuestClick={() => guestMutation.mutate({ apodo: "Semillero" })}
            googlePending={googleMutation.isPending}
            facebookPending={facebookMutation.isPending}
            guestPending={guestMutation.isPending}
            guestError={guestMutation.isError}
            onEmailSuccess={handleEmailSuccess}
            tabActivo={tabActivo}
            onCambiarTab={setTabActivo}
            facebookDisponible={facebookDisponible}
          />
          <LoginHeroPanel />
        </main>
      </div>
    </div>
  );
}
