import { Boton } from "@/componentes/ui/boton";

interface OnboardingFooterProps {
  deshabilitado: boolean;
  onContinuar: () => void;
}

export function OnboardingFooter({ deshabilitado, onContinuar }: OnboardingFooterProps) {
  return (
    <div className="w-full max-w-[400px] flex justify-center">
      <Boton
        variante="primario"
        anchoCompleto
        onClick={onContinuar}
        disabled={deshabilitado}
        deshabilitado={deshabilitado}
        clase="rounded-xl text-base font-semibold"
      >
        Continuar
      </Boton>
    </div>
  );
}
