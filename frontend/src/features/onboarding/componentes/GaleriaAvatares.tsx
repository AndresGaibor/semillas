const avatarIds = Array.from({ length: 10 }, (_, i) => i + 1);
const avatarBaseUrl = "https://api.dicebear.com/7.x/thumbs/svg?seed=";

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "12px",
  maxWidth: "400px",
  margin: "0 auto",
};

interface GaleriaAvataresProps {
  seleccionadoId: string | null;
  onSelect: (id: string) => void;
}

export function GaleriaAvatares({ seleccionadoId, onSelect }: GaleriaAvataresProps) {
  return (
    <div style={gridStyle}>
      {avatarIds.map((id) => {
        const avatarKey = `avatar${id}`;
        const estaSeleccionado = seleccionadoId === avatarKey;
        return (
          <button
            key={avatarKey}
            onClick={() => onSelect(avatarKey)}
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: "50%",
              border: estaSeleccionado ? "3px solid #7E57C2" : "2px solid #e5e7eb",
              background: estaSeleccionado ? "#EDE7F6" : "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}
          >
            <img
              src={`${avatarBaseUrl}${avatarKey}`}
              alt={`Avatar ${id}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </button>
        );
      })}
    </div>
  );
}
