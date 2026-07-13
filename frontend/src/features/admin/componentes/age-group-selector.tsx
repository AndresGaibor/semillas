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

export function AgeGroupSelector({
  ageGroups,
  selectedAgeGroupId,
  onSelect,
}: AgeGroupSelectorProps) {
  return (
    <section className="admin-crecer-control">
      <div className="admin-crecer-control__heading">
        <div className="admin-crecer-control__icon" aria-hidden="true">
          <Target size={18} />
        </div>
        <div>
          <h2>Franja</h2>
          <p>El contenido se guarda de forma independiente para cada edad.</p>
        </div>
      </div>

      <div className="admin-crecer-age-options">
        {ageGroups.map((ageGroup) => {
          const isActive = ageGroup.id === selectedAgeGroupId;
          const ageRange =
            ageGroup.edad_minima != null && ageGroup.edad_maxima != null
              ? `${ageGroup.edad_minima}–${ageGroup.edad_maxima} años`
              : "Franja etaria";

          return (
            <button
              key={ageGroup.id}
              type="button"
              onClick={() => onSelect(ageGroup.id)}
              className={`admin-crecer-age-option ${isActive ? "admin-crecer-age-option--active" : ""}`}
              aria-pressed={isActive}
              title={ageGroup.descripcion ?? ageRange}
            >
              <span className="admin-crecer-age-option__copy">
                <strong>{ageGroup.nombre}</strong>
                <small>{ageRange}</small>
              </span>
              <span className="admin-crecer-age-option__state">
                {isActive ? "Activa" : "Elegir"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
