import type { GrupoEdad } from "../../../shared/api/api";
import { GrupoEdadCard } from "./GrupoEdadCard";

interface GrupoEdadGridProps {
  grupos: GrupoEdad[];
  seleccionadoId: string;
  onSelect: (id: string) => void;
  cargando: boolean;
}

export function GrupoEdadGrid({ grupos, seleccionadoId, onSelect, cargando }: GrupoEdadGridProps) {
  return (
    <div className="onboarding-age-grid flex gap-4 justify-center mb-8 w-full flex-wrap">
      {cargando && <p className="text-center text-[rgba(18,59,44,0.4)] font-semibold py-12 w-full">Cargando franjas...</p>}

      {grupos.map((grupo) => (
        <GrupoEdadCard
          key={grupo.id}
          grupo={grupo}
          seleccionado={seleccionadoId === grupo.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
