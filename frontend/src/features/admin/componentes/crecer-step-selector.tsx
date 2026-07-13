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
    <section className="admin-crecer-control">
      <div className="admin-crecer-control__heading">
        <div className="admin-crecer-control__icon">
          <BookOpenText size={18} />
        </div>
        <div>
          <h2>Momento CRECER</h2>
          <p>Elige un momento para editarlo.</p>
        </div>
      </div>

      <div className="admin-crecer-step-options">
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
              className={`admin-crecer-step-option ${isActive ? "admin-crecer-step-option--active" : ""}`}
              style={{
                backgroundColor: isActive ? (step.color_hex ?? "#2e9e5b") : undefined,
              }}
            >
              <span className="admin-crecer-step-option__status">
                {completed ? <Check size={16} /> : <Circle size={16} className={isActive ? "text-white/80" : "text-slate-300"} />}
              </span>
              <div className="min-w-0 flex-1">
                <p>{step.nombre}</p>
                <small>
                  {completed ? "Contenido guardado" : "Pendiente de completar"}
                </small>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
