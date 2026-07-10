import { BookOpenText, Check, Circle } from "lucide-react";

interface CrecerStep {
  id: string;
  codigo: string;
  nombre: string;
  color_hex?: string | null;
}

interface StepContent {
  tipo_paso?: { codigo: string } | null;
  contenidos?: Array<{
    grupo_edad_id: string;
    cuerpo?: string | null;
  }> | null;
}

interface CrecerStepSelectorProps {
  pasos: CrecerStep[];
  activeStepCode: string;
  selectedAgeGroupId: string;
  stepsData?: StepContent[] | null;
  onSelect: (codigo: string) => void;
}

export function CrecerStepSelector({
  pasos,
  activeStepCode,
  selectedAgeGroupId,
  stepsData,
  onSelect,
}: CrecerStepSelectorProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
          <BookOpenText size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-slate-800">Momentos CRECER</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Elige el momento, edita el contenido y guarda por franja.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {pasos.map((step) => {
          const isActive = activeStepCode === step.codigo;
          const completed = selectedAgeGroupId
            ? stepsData?.some(
                (s) =>
                  s.tipo_paso?.codigo === step.codigo &&
                  s.contenidos?.some((c) => c.grupo_edad_id === selectedAgeGroupId && c.cuerpo && c.cuerpo !== "Contenido pendiente...")
              )
            : false;

          return (
            <button
              key={step.codigo}
              type="button"
              onClick={() => onSelect(step.codigo)}
              className={`flex items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition-all ${isActive ? "border-transparent text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
              style={{
                backgroundColor: isActive ? (step.color_hex ?? "#2e9e5b") : undefined,
              }}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${isActive ? "bg-white/15" : "bg-[#eefcf4] text-[#2e9e5b]"}`}>
                {completed ? <Check size={16} /> : <Circle size={16} className={isActive ? "text-white/80" : "text-slate-300"} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-black ${isActive ? "text-white" : "text-slate-800"}`}>{step.nombre}</p>
                <p className={`mt-0.5 text-[11px] font-semibold ${isActive ? "text-white/78" : "text-slate-400"}`}>
                  {completed ? "Contenido guardado" : "Pendiente de completar"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
