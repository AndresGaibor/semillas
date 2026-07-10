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
    <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
          <Target size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-slate-800">Selecciona la franja</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Cada franja tiene su propio contenido CRECER. El editor mantiene el paso seleccionado mientras escribes.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ageGroups.map((ag) => {
          const isActive = ag.id === selectedAgeGroupId;
          return (
            <button
              key={ag.id}
              type="button"
              onClick={() => onSelect(ag.id)}
              className={`rounded-[1.5rem] border p-4 text-left transition-all ${isActive ? "border-[#2e9e5b] bg-[#eefcf4] shadow-sm" : "border-slate-200 bg-white hover:border-[#2e9e5b]/30 hover:bg-slate-50"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-800">{ag.nombre}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    {ag.descripcion ?? `${ag.edad_minima}-${ag.edad_maxima} años`}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${isActive ? "bg-[#2e9e5b] text-white" : "bg-slate-100 text-slate-500"}`}>
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
