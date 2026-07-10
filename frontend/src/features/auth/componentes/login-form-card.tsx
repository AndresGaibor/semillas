import * as React from "react";
import { SocialLoginButton } from "./social-login-button";
import { EmailAuthForm } from "./email-auth-form";
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
          <h1 className="login-welcome__title">Bienvenido a Semillas</h1>
          <p className="login-welcome__subtitle">Inicia sesión para continuar tu aventura de fe y aprendizaje.</p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => onCambiarTab("social")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tabActivo === "social"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Redes sociales
          </button>
          <button
            onClick={() => onCambiarTab("email")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tabActivo === "email"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
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
              <p className="text-red-500 text-sm mt-2 text-center">No se pudo crear el invitado. Asegúrate de que el backend esté activo.</p>
            )}
          </div>
        )}

        {tabActivo === "email" && (
          <EmailAuthForm onSuccess={onEmailSuccess} />
        )}
      </div>
    </section>
  );
};
