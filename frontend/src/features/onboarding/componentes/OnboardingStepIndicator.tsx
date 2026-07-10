import { useNavigate } from "@tanstack/react-router";
import { Boton } from "@/componentes/ui/boton";
import { Check } from "lucide-react";

interface OnboardingStepIndicatorProps {
  pasoActual: number;
}

export function OnboardingStepIndicator({ pasoActual }: OnboardingStepIndicatorProps) {
  const navigate = useNavigate();

  return (
    <div className="onboarding-stepper flex bg-[#f4f5f7] rounded-xl p-1 mb-10">
      <Boton
        variante="secundario"
        type="button"
        onClick={() => navigate({ to: "/onboarding" })}
        clase="flex-1 text-center p-3 rounded-lg font-bold text-sm text-[#9E9E9E] flex items-center justify-center gap-2 bg-transparent border-none cursor-pointer shadow-none hover:bg-transparent active:bg-transparent"
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7E57C2] text-white text-xs font-bold">
          <Check size={14} strokeWidth={3} />
        </span>
        Tu edad
      </Boton>
      <div className="flex-1 text-center p-3 rounded-lg font-bold text-sm text-[#7E57C2] flex items-center justify-center gap-2 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7E57C2] text-white text-xs font-bold">
          2
        </span>
        Tu información
      </div>
    </div>
  );
}
