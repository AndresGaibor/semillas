import * as React from "react";
import ninosImg from "@/assets/images/Ilustraciones/Ninños 2.png";
import progresoIcon from "@/assets/images/icons/progreso.png";
import escudoIcon from "@/assets/images/icons/entorno_seguro.png";
import candadoIcon from "@/assets/images/icons/candado.png";

export const LoginHeroPanel: React.FC = () => {
  return (
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
  );
};
