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
      className={`onboarding-age-card relative flex flex-col rounded-2xl cursor-pointer overflow-hidden transition-all duration-200 ${
        seleccionado ? "" : "bg-white border border-gray-200"
      }`}
      style={{
        background: seleccionado ? colores.fondo : "#ffffff",
        border: `2px solid ${seleccionado ? colores.borde : "#e5e7eb"}`,
        width: "280px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      }}
    >
      <input
        type="radio"
        name="age_group"
        value={grupo.id}
        checked={seleccionado}
        onChange={() => onSelect(grupo.id)}
        className="absolute opacity-0 w-0 h-0"
      />

      <div className="w-full h-[160px] relative bg-[#e5f0f9] flex-shrink-0">
        <img
          src={grupo.imagen_url ?? undefined}
          alt={grupo.nombre}
          className="w-full h-full object-cover block"
        />
        <div
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg text-white transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
          style={{
            background: colores.acento,
            opacity: seleccionado ? 1 : 0,
            transform: seleccionado ? "scale(1)" : "scale(0.8)",
          }}
        >
          ✓
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-[#1A1A1A] m-0 mb-1">
          {grupo.nombre}
        </h2>
        <div className="text-sm font-semibold mb-3" style={{ color: colores.acento }}>
          {grupo.edad_minima} - {grupo.edad_maxima} años
        </div>
        <p className="text-sm text-[#5C5C5C] leading-relaxed m-0">
          {grupo.descripcion}
        </p>
      </div>
    </label>
  );
}
