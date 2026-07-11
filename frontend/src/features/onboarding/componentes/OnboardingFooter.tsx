import { ArrowRight } from "lucide-react";

interface OnboardingFooterProps {
  deshabilitado: boolean;
  onContinuar: () => void;
}

export function OnboardingFooter({ deshabilitado, onContinuar }: OnboardingFooterProps) {
  return (
    <div className="onboarding-age-footer">
      <p className="onboarding-age-footer__hint" aria-live="polite">
        {deshabilitado ? "Selecciona una opción para continuar" : "Perfecto, puedes continuar"}
      </p>
      <button
        type="button"
        className="onboarding-age-footer__button"
        onClick={onContinuar}
        disabled={deshabilitado}
      >
        <span>{deshabilitado ? "Selecciona una opción" : "Continuar"}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
