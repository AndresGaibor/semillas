import type { CSSProperties } from "react";
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
    titulo?: string | null;
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
        <div className="admin-crecer-control__icon" aria-hidden="true">
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
                (record) =>
                  record.tipo_paso?.codigo === step.codigo &&
                  record.contenidos?.some(
                    (content) =>
                      content.grupo_edad_id === selectedAgeGroupId &&
                      Boolean(content.titulo?.trim()) &&
                      Boolean(content.cuerpo?.trim()) &&
                      content.cuerpo !== "Contenido pendiente...",
                  ),
              )
            : false;
          const style = {
            "--step-color": step.color_hex ?? "#2e9e5b",
          } as CSSProperties;

          return (
            <button
              key={step.codigo}
              type="button"
              onClick={() => onSelect(step.codigo)}
              className={`admin-crecer-step-option ${isActive ? "admin-crecer-step-option--active" : ""} ${completed ? "admin-crecer-step-option--complete" : ""}`}
              style={style}
              aria-pressed={isActive}
            >
              <span className="admin-crecer-step-option__status" aria-hidden="true">
                {completed ? <Check size={15} /> : <Circle size={14} />}
              </span>
              <span className="admin-crecer-step-option__copy">
                <strong>{step.nombre}</strong>
                <small>{completed ? "Contenido guardado" : isActive ? "Editando ahora" : "Pendiente"}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
