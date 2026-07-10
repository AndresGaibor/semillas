import { Button } from "@/componentes/ui/button";
import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/images/logos/Logotipo.png";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <div className="footer__logo-inner">
          <img src={logoImg} alt="Semillas Logo" />
          <span className="brand">Semillas</span>
        </div>
        <span className="tagline">Crecer en la Palabra, vivir Su verdad</span>
        <p className="copyright">© 2026 Semillas. Todos los derechos reservados.</p>
      </div>

      <div className="footer__heart">
        <i className="fa-regular fa-heart text-pink"></i>
        <span>Hecho con amor para la próxima generación.</span>
      </div>

      <div className="footer__verse">
        <p className="verse-text">
          "Id por todo el mundo y predicad el evangelio a toda criatura."
        </p>
        <span className="verse-ref">Marcos 16:15</span>
      </div>
    </footer>
  );
}
