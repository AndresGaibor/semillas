import { createFileRoute, Link } from "@tanstack/react-router";
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
const { tabActivo, setTabActivo, guestMutation, googleMutation, handleEmailSuccess } = useLoginPage({
    redirectTo: search.redirect,
  });
  return (
    <div className="login-page">
      <header className="login-topbar" role="banner">
        <Link to="/" className="login-brand" aria-label="Ir al inicio de Semilla">
          <img src={logoImg} alt="Logo de Semilla" className="login-brand__img" width="56" height="56" />
          <div className="login-brand__text">
            <span className="login-brand__name">Semillas</span>
            <span className="login-brand__tagline">Crecer en la Palabra, vivir Su verdad</span>
          </div>
        </Link>
        <div className="login-lang">
          <span className="flex items-center gap-1.5">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Español
          </span>
        </div>
      </header>

      <main className="login-main" id="main-content" role="main">
        <LoginFormCard
          onGoogleClick={() => googleMutation.mutate()}
          onGuestClick={() => guestMutation.mutate({ apodo: "Semillero" })}
          googlePending={googleMutation.isPending}
          guestPending={guestMutation.isPending}
          guestError={guestMutation.isError}
          onEmailSuccess={handleEmailSuccess}
          tabActivo={tabActivo}
          onCambiarTab={setTabActivo}
        />
        <LoginHeroPanel />
      </main>
    </div>
  );
}
