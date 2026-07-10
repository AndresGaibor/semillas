import { Boton } from "@/componentes/ui/boton";

interface FormNavigationProps {
  onBack: () => void;
  onFinish: () => void;
  isEnabled: boolean;
  isLoading: boolean;
}

export function FormNavigation({ onBack, onFinish, isEnabled, isLoading }: FormNavigationProps) {
  return (
    <div className="onboarding-actions flex justify-between items-center border-t border-[#e5e7eb] pt-6 mt-10">
      <Boton
        variante="secundario"
        onClick={onBack}
        clase="bg-transparent border-[1.5px] border-[#9E9E9E] text-[#2E2E2E] px-6 py-3 rounded-lg font-bold text-base"
      >
        ← Atrás
      </Boton>
      <Boton
        variante="primario"
        onClick={onFinish}
        disabled={!isEnabled}
        cargando={isLoading}
        clase="px-8 py-3 rounded-lg font-bold text-base"
      >
        {isLoading ? "Finalizando..." : "Finalizar →"}
      </Boton>
    </div>
  );
}
