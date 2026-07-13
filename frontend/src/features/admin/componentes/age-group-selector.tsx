import { Target } from "lucide-react";

interface AgeGroup {
  id: string;
  nombre?: string | null;
  descripcion?: string | null;
  edad_minima?: number;
  edad_maxima?: number;
}

interface AgeGroupSelectorProps {
  ageGroups: AgeGroup[];
  selectedAgeGroupId: string;
  onSelect: (id: string) => void;
}

export function AgeGroupSelector({ ageGroups, selectedAgeGroupId, onSelect }: AgeGroupSelectorProps) {
  return (
    <section className="admin-crecer-control">
      <div className="admin-crecer-control__heading">
        <div className="admin-crecer-control__icon">
          <Target size={18} />
        </div>
        <div>
          <h2>Franja</h2>
          <p>El contenido se guarda de forma independiente para cada edad.</p>
        </div>
      </div>

      <div className="admin-crecer-age-options">
        {ageGroups.map((ag) => {
          const isActive = ag.id === selectedAgeGroupId;
          return (
            <button
              key={ag.id}
              type="button"
              onClick={() => onSelect(ag.id)}
              className={`admin-crecer-age-option ${isActive ? "admin-crecer-age-option--active" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p>{ag.nombre}</p>
                  <small>
                    {ag.descripcion ?? `${ag.edad_minima}-${ag.edad_maxima} años`}
                  </small>
                </div>
                  <span>
                  {isActive ? "Activa" : "Elegir"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
