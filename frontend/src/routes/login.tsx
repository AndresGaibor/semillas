import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { crearSesionInvitado, configurarDevAdmin, iniciarSesionGoogle } from "../features/auth/auth.api";
import { sessionStorageApi } from "../shared/api/session";

import "../estilos.css";
import "./login.css";

import logoImg from "@/assets/images/logos/Logotipo.png";

// Subcomponentes descompuestos
import { LoginFormCard } from "../features/auth/componentes/login-form-card";
import { LoginHeroPanel } from "../features/auth/componentes/login-hero-panel";

export const Route = createFileRoute("/login")({
  component: LoginPage
});

function LoginPage() {
  const navigate = useNavigate();

  const guestMutation = useMutation({
    mutationFn: crearSesionInvitado,
    onSuccess(data) {
      sessionStorageApi.setGuestUserId(data.autenticacion.valor);
      navigate({ to: "/onboarding" });
    }
  });

  const googleMutation = useMutation({
    mutationFn: () => iniciarSesionGoogle(`${window.location.origin}/app`),
  });

  const devAdminMutation = useMutation({
    mutationFn: configurarDevAdmin,
    onSuccess(data) {
      sessionStorageApi.setGuestUserId(data.usuario.id);
      navigate({ to: "/admin" });
    }
  });

  return (
    <div className="login-page">
      {/* BARRA SUPERIOR */}
      <header className="login-topbar" role="banner">
        <Link to="/" className="login-brand" aria-label="Ir al inicio de Semilla">
          <img src={logoImg} alt="Logo de Semilla" className="login-brand__img" width="56" height="56" />
          <div className="login-brand__text">
            <span className="login-brand__name">Semillas</span>
            <span className="login-brand__tagline">Crecer en la Palabra, vivir Su verdad</span>
          </div>
        </Link>
        {/* Idioma */}
        <div className="login-lang">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fuente-tam-sm)', fontWeight: 'var(--fuente-peso-negrita)', color: 'var(--color-neutro-oscuro)' }}>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Español
          </span>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="login-main" id="main-content" role="main">
        <LoginFormCard
          onGoogleClick={() => googleMutation.mutate()}
          onFacebookClick={() => undefined}
          onGuestClick={() => guestMutation.mutate({ apodo: "Semillero" })}
          onDevAdminClick={() => devAdminMutation.mutate()}
          googlePending={googleMutation.isPending}
          guestPending={guestMutation.isPending}
          guestError={guestMutation.isError}
          devAdminPending={devAdminMutation.isPending}
          devAdminSuccess={devAdminMutation.isSuccess}
        />

        <LoginHeroPanel />
      </main>
    </div>
  );
}
