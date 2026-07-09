import * as React from "react";
import { Shield } from "lucide-react";
import { SocialLoginButton } from "./social-login-button";
import googleIcon from "@/assets/images/icons/google.png";
import facebookIcon from "@/assets/images/icons/facebook.png";
import guestIcon from "@/assets/images/icons/invitado.png";

export interface LoginFormCardProps {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  onGuestClick: () => void;
  onDevAdminClick: () => void;
  googlePending?: boolean;
  guestPending?: boolean;
  guestError?: boolean;
  devAdminPending?: boolean;
  devAdminSuccess?: boolean;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  onGoogleClick,
  onFacebookClick,
  onGuestClick,
  onDevAdminClick,
  googlePending,
  guestPending,
  guestError,
  devAdminPending,
  devAdminSuccess,
}) => {
  return (
    <section className="login-panel login-panel--form" aria-label="Opciones de inicio de sesión">
      <div className="login-form-wrapper">
        <div className="login-welcome">
          <h1 className="login-welcome__title">Bienvenido a Semillas</h1>
          <p className="login-welcome__subtitle">Inicia sesión para continuar tu aventura de fe y aprendizaje.</p>
        </div>

        <div className="login-social" role="group" aria-label="Opciones de acceso">
          <SocialLoginButton
            tipo="google"
            logo={googleIcon}
            label="Continuar con Google"
            onClick={onGoogleClick}
            isPending={googlePending}
          />

          <SocialLoginButton
            tipo="facebook"
            logo={facebookIcon}
            label="Facebook desactivado"
            onClick={onFacebookClick}
            disabled={true}
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
        </div>
        
        {guestError && (
          <p className="text-[#ee6c4d] text-sm mt-4 text-center">No se pudo crear el invitado. Asegúrate de que el backend esté activo.</p>
        )}

        <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
          <button
            onClick={onDevAdminClick}
            disabled={devAdminPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#2e9e5b]/30 text-xs text-[#2e9e5b] font-medium hover:bg-[#2e9e5b]/5 transition-colors disabled:opacity-50"
          >
            <Shield size={14} />
            {devAdminPending ? "Creando admin..." : "Modo desarrollo: crear admin de prueba"}
          </button>
          {devAdminSuccess && (
            <p className="text-[#2e9e5b] text-xs mt-2 text-center">Admin creado. Redirigiendo al panel...</p>
          )}
        </div>
      </div>
    </section>
  );
};
