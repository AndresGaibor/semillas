import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Leaf, Shield } from "lucide-react";
import { crearSesionInvitado, configurarDevAdmin } from "../features/auth/auth.api";
import { sessionStorageApi } from "../shared/api/session";

import "../estilos.css";
import "./login.css";

import logoImg from "@/assets/images/logos/Logotipo.png";
import googleIcon from "@/assets/images/icons/google.png";
import facebookIcon from "@/assets/images/icons/facebook.png";
import guestIcon from "@/assets/images/icons/invitado.png";
import ninosImg from "@/assets/images/Ilustraciones/Ninños 2.png";
import progresoIcon from "@/assets/images/icons/progreso.png";
import escudoIcon from "@/assets/images/icons/entorno_seguro.png";
import candadoIcon from "@/assets/images/icons/candado.png";

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
        {/* Panel Formulario */}
        <section className="login-panel login-panel--form" aria-label="Opciones de inicio de sesión">
          <div className="login-form-wrapper">
            <div className="login-welcome">
              <h1 className="login-welcome__title">Bienvenido a Semillas</h1>
              <p className="login-welcome__subtitle">Inicia sesión para continuar tu aventura de fe y aprendizaje.</p>
            </div>

            <div className="login-social" role="group" aria-label="Opciones de acceso">
              <button type="button" className="login-social__btn login-social__btn--google">
                <img src={googleIcon} alt="" className="login-social__icon" width="22" height="22" />
                <span>Continuar con Google</span>
              </button>

              <button type="button" className="login-social__btn login-social__btn--facebook">
                <img src={facebookIcon} alt="" className="login-social__icon" width="22" height="22" />
                <span>Continuar con Facebook</span>
              </button>
              
              <div className="login-divider" role="separator" aria-hidden="true">
                <span className="login-divider__line"></span>
                <span className="login-divider__label">o explora sin cuenta</span>
                <span className="login-divider__line"></span>
              </div>

              <button 
                type="button" 
                className="login-social__btn login-social__btn--guest relative overflow-hidden" 
                onClick={() => guestMutation.mutate({ apodo: "Semillero" })}
                disabled={guestMutation.isPending}
              >
                <img src={guestIcon} alt="" className="login-social__icon" width="36" height="36" />
                <div className="login-social__guest-text text-left flex flex-col items-start ml-2">
                  <span className="login-social__guest-title">{guestMutation.isPending ? "Entrando..." : "Jugar como invitado"}</span>
                  <span className="login-social__guest-note">Explora sin cuenta. Tu progreso no se guardará.</span>
                </div>
              </button>
            </div>
            
            {guestMutation.isError && (
              <p className="text-[#ee6c4d] text-sm mt-4 text-center">No se pudo crear el invitado. Asegúrate de que el backend esté activo.</p>
            )}

            <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
              <button
                onClick={() => devAdminMutation.mutate()}
                disabled={devAdminMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#2e9e5b]/30 text-xs text-[#2e9e5b] font-medium hover:bg-[#2e9e5b]/5 transition-colors disabled:opacity-50"
              >
                <Shield size={14} />
                {devAdminMutation.isPending ? "Creando admin..." : "Modo desarrollo: crear admin de prueba"}
              </button>
              {devAdminMutation.isSuccess && (
                <p className="text-[#2e9e5b] text-xs mt-2 text-center">Admin creado. Redirigiendo al panel...</p>
              )}
            </div>

          </div>
        </section>

        {/* Panel Visual */}
        <section className="login-panel login-panel--visual" aria-label="Ilustración y beneficios">
          <div className="login-visual-bg"></div>

          <div className="login-illustration">
            <div className="login-bubble" aria-hidden="true">
              <span>💜 Aprende, crece<br/>y comparte su amor.</span>
            </div>
            <img src={ninosImg} alt="Niños leyendo la Biblia" className="login-illustration__img" draggable="false" />
          </div>

          <div className="login-benefits">
            <article className="login-benefit">
              <div className="login-benefit__icon-wrap login-benefit__icon-wrap--cloud">
                <img src={progresoIcon} alt="" className="login-benefit__icon" width="24" height="24" />
              </div>
              <div className="login-benefit__content">
                <h2 className="login-benefit__title">Tu progreso se sincroniza</h2>
                <p className="login-benefit__desc">Continúa aprendiendo desde cualquier dispositivo.</p>
              </div>
            </article>

            <article className="login-benefit">
              <div className="login-benefit__icon-wrap login-benefit__icon-wrap--shield">
                <img src={escudoIcon} alt="" className="login-benefit__icon" width="24" height="24" />
              </div>
              <div className="login-benefit__content">
                <h2 className="login-benefit__title">Un entorno seguro</h2>
                <p className="login-benefit__desc">Contenido apropiado y protegido para niños.</p>
              </div>
            </article>
          </div>

          <p className="login-privacy">
            <img src={candadoIcon} alt="" aria-hidden="true" className="login-privacy__icon" width="14" height="14" />
            Privacidad protegida. Nunca compartimos tu información.
          </p>
        </section>
      </main>
    </div>
  );
}
