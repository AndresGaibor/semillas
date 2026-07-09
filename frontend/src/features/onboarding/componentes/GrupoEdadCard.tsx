import type { GrupoEdad } from "../../../shared/api/api";

const mapaColores: Record<string, { borde: string; fondo: string; acento: string }> = {
  semillas: { borde: "#43A047", fondo: "#E8F5E9", acento: "#43A047" },
  exploradores: { borde: "#3D8BD4", fondo: "#E3F2FD", acento: "#3D8BD4" },
  embajadores: { borde: "#EE6C4D", fondo: "#FBE9E7", acento: "#EE6C4D" },
};

interface GrupoEdadCardProps {
  grupo: GrupoEdad;
  seleccionado: boolean;
  onSelect: (id: string) => void;
}

export function GrupoEdadCard({ grupo, seleccionado, onSelect }: GrupoEdadCardProps) {
  const colores = mapaColores[grupo.codigo] ?? { borde: "#7E57C2", fondo: "#EDE7F6", acento: "#7E57C2" };

  return (
    <label
      style={{
        background: seleccionado ? colores.fondo : "#ffffff",
        border: `2px solid ${seleccionado ? colores.borde : "#e5e7eb"}`,
        borderRadius: "16px",
        width: "280px",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      <input
        type="radio"
        name="age_group"
        value={grupo.id}
        checked={seleccionado}
        onChange={() => onSelect(grupo.id)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />

      <div
        style={{
          width: "100%",
          height: "160px",
          position: "relative",
          background: "#e5f0f9",
          flexShrink: 0,
        }}
      >
        <img
          src={grupo.imagen_url ?? undefined}
          alt={grupo.nombre}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            background: colores.acento,
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "18px",
            opacity: seleccionado ? 1 : 0,
            transform: seleccionado ? "scale(1)" : "scale(0.8)",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          ✓
        </div>
      </div>

      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px 0" }}>
          {grupo.nombre}
        </h2>
        <div style={{ fontSize: "14px", fontWeight: 600, color: colores.acento, marginBottom: "12px" }}>
          {grupo.edad_minima} - {grupo.edad_maxima} años
        </div>
        <p style={{ fontSize: "14px", color: "#5C5C5C", lineHeight: 1.5, margin: 0 }}>
          {grupo.descripcion}
        </p>
      </div>
    </label>
  );
}
