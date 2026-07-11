import * as React from "react";
import { LockKeyhole } from "lucide-react";
import { EmailAuthForm } from "./email-auth-form";
import { SocialLoginButton } from "./social-login-button";
import googleIcon from "@/assets/images/icons/google.png";
import guestIcon from "@/assets/images/icons/invitado.png";

export interface LoginFormCardProps {
  onGoogleClick: () => void;
  onGuestClick: () => void;
  googlePending?: boolean;
  guestPending?: boolean;
  guestError?: boolean;
  onEmailSuccess: () => void;
  tabActivo: "social" | "email";
  onCambiarTab: (tab: "social" | "email") => void;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  onGoogleClick,
  onGuestClick,
  googlePending,
  guestPending,
  guestError,
  onEmailSuccess,
  tabActivo,
  onCambiarTab,
}) => {
  return (
    <section className="login-panel login-panel--form" aria-label="Opciones de inicio de sesión">
      <div className="login-form-wrapper">
        <div className="login-welcome">
          <span className="login-welcome__eyebrow">Tu aventura comienza aquí</span>
          <h1 className="login-welcome__title">Bienvenido a Semillas</h1>
          <p className="login-welcome__subtitle">
            Inicia sesión para continuar tu aventura de fe y aprendizaje.
          </p>
        </div>

        <div className="login-tabs" role="tablist" aria-label="Métodos de acceso">
          <button
            type="button"
            role="tab"
            aria-selected={tabActivo === "social"}
            className={`login-tab ${tabActivo === "social" ? "is-active" : ""}`}
            onClick={() => onCambiarTab("social")}
          >
            Redes sociales
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tabActivo === "email"}
            className={`login-tab ${tabActivo === "email" ? "is-active" : ""}`}
            onClick={() => onCambiarTab("email")}
          >
            Correo electrónico
          </button>
        </div>

        {tabActivo === "social" && (
          <div className="login-social" role="group" aria-label="Opciones de acceso">
            <SocialLoginButton
              tipo="google"
              logo={googleIcon}
              label="Continuar con Google"
              onClick={onGoogleClick}
              isPending={googlePending}
            />

            <div className="login-divider" role="separator" aria-hidden="true">
              <span className="login-divider__line"></span>
              <span className="login-divider__label">o explora sin cuenta</span>
              <span className="login-divider__line"></span>
            </div>

            <SocialLoginButton
              tipo="guest"
              logo={guestIcon}
              label="Jugar como invitado"
              guestNote="Explora sin cuenta. Tu progreso no se guardará."
              onClick={onGuestClick}
              isPending={guestPending}
            />

            {guestError && (
              <p className="login-feedback login-feedback--error">
                No se pudo crear el invitado. Asegúrate de que el backend esté activo.
              </p>
            )}
          </div>
        )}

        {tabActivo === "email" && <EmailAuthForm onSuccess={onEmailSuccess} />}

        <p className="login-mobile-privacy">
          <LockKeyhole size={16} aria-hidden="true" />
          <span>Tu información está protegida.</span>
        </p>
      </div>
    </section>
  );
};
