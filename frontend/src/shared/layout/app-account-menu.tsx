import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/componentes/ui/button";
import { Card } from "@/componentes/ui/card-base";

type AppAccountMenuProps = {
  nombreVisible: string;
  nivelTexto: string;
  avatarUrl: string;
  onLogout: () => void | Promise<void>;
};

export const OPCIONES_CUENTA = [
  { to: "/app/perfil", label: "Mi perfil", icono: "fa-regular fa-user" },
  { to: "/app/logros", label: "Mis insignias", icono: "fa-regular fa-medal" },
  { to: "/app/descargas", label: "Descargas", icono: "fa-regular fa-download" },
] as const;

export function AppAccountMenu({ nombreVisible, nivelTexto, avatarUrl, onLogout }: AppAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = () => {
    setIsOpen(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    animationRef.current = setTimeout(() => {
      setIsRendered(false);
    }, 180);
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
      return;
    }

    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    setIsRendered(true);
    requestAnimationFrame(() => setIsOpen(true));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        className="flex min-h-11 items-center gap-2 rounded-full border-0 p-1 text-left hover:bg-slate-100 sm:gap-3 md:rounded-none md:border-l md:border-[#e5e7eb] md:pl-5 md:pr-0 md:hover:bg-transparent"
        aria-label="Abrir menú de cuenta"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleMenu}
      >
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primario bg-orange-200">
          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
        </div>
        <div className="hidden flex-col text-left md:flex">
          <span className="text-[13.6px] font-bold text-foreground">{nombreVisible}</span>
          <span className="text-xs text-neutro">{nivelTexto}</span>
        </div>
        <i className="fa-solid fa-chevron-down ml-1 hidden text-xs text-neutro md:block"></i>
      </Button>
 
      {isRendered && (
        <Card
          role="menu"
          aria-label="Menú de cuenta"
          sombra="lg"
          className={`absolute right-0 top-full z-[160] mt-2 w-56 origin-top-right rounded-2xl border border-[#e5e7eb] p-2 transition-all duration-200 ease-out motion-reduce:transition-none before:content-[''] before:absolute before:-top-1.5 before:right-6 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-[#e5e7eb] ${
            isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          }`}
        >
          {OPCIONES_CUENTA.map((opcion) => (
            <Link
              key={opcion.to}
              to={opcion.to}
              role="menuitem"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutro transition-colors hover:bg-black/5 hover:text-neutro-oscuro-max cursor-pointer"
            >
              <i className={`${opcion.icono} w-4 text-center`}></i>
              {opcion.label}
            </Link>
          ))}
 
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              closeMenu();
              void onLogout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
            Cerrar sesión
          </button>
        </Card>
      )}
    </div>
  );
}
