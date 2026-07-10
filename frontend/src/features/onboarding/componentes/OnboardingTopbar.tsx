import { HelpCircle } from "lucide-react";
import logoImg from "@/assets/images/logos/Logotipo.png";
import { Boton } from "@/componentes/ui/boton";

interface OnboardingTopbarProps {
  onHelpClick: () => void;
}

export function OnboardingTopbar({ onHelpClick }: OnboardingTopbarProps) {
  return (
    <header className="onboarding-topbar flex items-center justify-between p-4 md:p-6 bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
      <a href="/" className="onboarding-brand flex items-center gap-3 no-underline">
        <img
          src={logoImg}
          alt="Logo de Semilla"
          className="onboarding-brand__logo w-14 h-14 object-contain"
        />
        <div className="flex flex-col">
          <span className="onboarding-brand__title text-[1.95rem] font-extrabold text-[#512DA8] leading-tight">
            Semillas
          </span>
          <span className="onboarding-brand__tagline text-[0.64rem] text-[#43A047] font-semibold">
            Crecer en la Palabra, vivir Su verdad
          </span>
        </div>
      </a>
      <Boton
        variante="contorno"
        onClick={onHelpClick}
        clase="border-[#e5e7eb] text-[#1A1A1A] rounded-full px-4 py-2 text-sm font-bold"
      >
        <HelpCircle size={16} />
        <span className="onboarding-help-button__label">Ayuda</span>
      </Boton>
    </header>
  );
}
