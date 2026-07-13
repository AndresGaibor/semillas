import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Boton } from "@/componentes/ui/boton";
import { Download, Menu, Monitor, X } from "lucide-react";
import logoImg from "@/assets/images/logos/Logotipo.png";
import { esEnlaceLandingActivo, obtenerHrefLandingInicial, crearScrollSpy } from "./Navbar.helpers";
import { BotonTemaToggle } from "@/componentes/ui/boton-tema-toggle";

interface NavbarProps {
  variante?: "landing" | "simple";
}

const navItems = [
  { label: "Inicio", href: "#top" },
  { label: "Sendas", href: "#sendas" },
  { label: "Clubes", href: "#clubes" },
  { label: "Metodología", href: "#metodologia" },
];

const apkUrl = import.meta.env.VITE_APK_URL;

export function Navbar({ variante = "landing" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hrefActivo, setHrefActivo] = useState(obtenerHrefLandingInicial());

  useEffect(() => {
    return crearScrollSpy(
      navItems.map((item) => item.href),
      (seccion) => setHrefActivo(seccion)
    );
  }, []);

  return (
    <header className="landing-navbar">
      <div className="landing-navbar__bar">
        <a href="#top" className="landing-navbar__brand" aria-label="Ir al inicio de Semillas">
          <img src={logoImg} alt="Logo de Semillas" />
          <div className="landing-navbar__brand-text">
            <span className="brand">Semillas</span>
            <span className="tagline">Crecer en la Palabra, vivir Su verdad</span>
          </div>
        </a>

        <button
          type="button"
          className="landing-navbar__toggle"
          aria-expanded={isOpen}
          aria-controls="landing-nav-panel"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div id="landing-nav-panel" className={`landing-navbar__panel ${isOpen ? "is-open" : ""}`}>
        <nav className="landing-navbar__nav" aria-label="Navegación principal">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`landing-navbar__link ${esEnlaceLandingActivo(hrefActivo, item.href) ? "is-active" : ""}`}
              aria-current={esEnlaceLandingActivo(hrefActivo, item.href) ? "location" : undefined}
              onClick={() => {
                setHrefActivo(item.href);
                setIsOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="landing-navbar__actions">
          <BotonTemaToggle />
          <Boton
            asChild
            className="landing-button landing-button--ghost h-auto rounded-full px-5 py-3"
          >
            <Link to="/login" search={{ redirect: "/onboarding" }} onClick={() => setIsOpen(false)}>
              <Monitor size={18} aria-hidden="true" />
              <span>Entrar Web</span>
            </Link>
          </Boton>

          {apkUrl ? (
            <Boton
              asChild
              className="landing-button landing-button--primary h-auto rounded-full px-5 py-3"
            >
              <a href={apkUrl} onClick={() => setIsOpen(false)}>
                <Download size={18} aria-hidden="true" />
                <span>Descargar APK</span>
              </a>
            </Boton>
          ) : (
            <Boton
              type="button"
              disabled
              className="landing-button landing-button--primary h-auto rounded-full px-5 py-3 opacity-70"
            >
              <Download size={18} aria-hidden="true" />
              <span>APK próximamente</span>
            </Boton>
          )}
        </div>
      </div>
    </header>
  );
}
