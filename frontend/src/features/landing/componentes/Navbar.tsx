import { Link } from "@tanstack/react-router";
import { Button } from "@/componentes/ui/button";
import logoImg from "@/assets/images/logos/Logotipo.png";

interface NavbarProps {
  variante?: "landing" | "simple";
}

export function Navbar({ variante = "landing" }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar__logo">
        <img src={logoImg} alt="Semillas Logo" />
        <div className="navbar__logo-text">
          <span className="brand">Semillas</span>
          <span className="tagline">Crecer en la Palabra, vivir Su verdad</span>
        </div>
      </div>

      <nav className="navbar__nav">
        <a href="#" className="nav-item active">Inicio</a>
        <a href="#como-funciona" className="nav-item">Cómo funciona</a>
        <a href="#sendas" className="nav-item">Sendas</a>
        <a href="#clubes" className="nav-item">Clubes</a>
        <a href="#metodologia" className="nav-item">Metodología</a>
      </nav>

      <div className="navbar__actions">
        <Button
          asChild
          className="btn btn-secundario rounded-full px-5 py-2 h-auto text-sm bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-50 hover:text-green-600"
        >
          <Link to="/login" search={{ redirect: "/onboarding" }}>
            <i className="fa-solid fa-desktop mr-2"></i> Entrar Web
          </Link>
        </Button>
        <Button
          asChild
          className="btn btn-primario rounded-full px-5 py-2 h-auto text-sm bg-green-600 text-white hover:bg-green-700"
        >
          <a href="#">
            <i className="fa-solid fa-download mr-2"></i> Descargar APK
          </a>
        </Button>
      </div>
    </header>
  );
}
