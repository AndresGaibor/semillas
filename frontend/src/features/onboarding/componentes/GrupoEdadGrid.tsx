import type { GrupoEdad } from "../../../shared/api/api";
import { GrupoEdadCard } from "./GrupoEdadCard";

interface GrupoEdadGridProps {
  grupos: GrupoEdad[];
  seleccionadoId: string;
  onSelect: (id: string) => void;
  cargando: boolean;
}

const gridStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  marginBottom: "32px",
  width: "100%",
  flexWrap: "wrap",
};

const loadingStyle: React.CSSProperties = {
  textAlign: "center",
  color: "rgba(18,59,44,0.4)",
  fontWeight: 600,
  padding: "48px 0",
  width: "100%",
};

export function GrupoEdadGrid({ grupos, seleccionadoId, onSelect, cargando }: GrupoEdadGridProps) {
  return (
    <div style={gridStyle}>
      {cargando && <p style={loadingStyle}>Cargando franjas...</p>}

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
