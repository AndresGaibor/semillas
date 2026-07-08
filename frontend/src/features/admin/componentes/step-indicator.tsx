const STEPS = [
  "Información general",
  "Escritura",
  "CRECER",
  "Actividades",
  "Media",
  "Preview",
] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, idx) => {
        const isActiveOrDone = idx <= currentStep;
        return (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isActiveOrDone
                  ? "bg-verde-brote text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`text-xs font-semibold ${
                isActiveOrDone ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {step}
            </span>
            {idx < STEPS.length - 1 && (
              <div className="w-8 h-px bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}
