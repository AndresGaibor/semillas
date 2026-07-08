import { MAPA_AVATARES } from "@/shared/constants/avatares";

interface AvatarSelectorProps {
  selectedAvatar: number;
  onSelect: (n: number) => void;
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "18px",
          fontWeight: 700,
          color: "#1A1A1A",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#7E57C2",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          2
        </span>
        Elige un avatar que te represente
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => {
          const avatarNum = index + 1;
          const isSelected = selectedAvatar === avatarNum;
          return (
            <label
              key={avatarNum}
              style={{ cursor: "pointer", display: "block", position: "relative" }}
            >
              <input
                type="radio"
                name="avatar"
                value={avatarNum}
                checked={isSelected}
                onChange={() => onSelect(avatarNum)}
                style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
              />
              <div
                style={{
                  border: `2px solid ${isSelected ? "#7E57C2" : "transparent"}`,
                  borderRadius: "16px",
                  padding: "4px",
                  background: isSelected ? "#EDE7F6" : "transparent",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                <img
                  src={MAPA_AVATARES[String(avatarNum)]}
                  alt={`Avatar ${avatarNum}`}
                  style={{ width: "100%", height: "auto", borderRadius: "12px", display: "block" }}
                />
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "24px",
                      height: "24px",
                      background: "#7E57C2",
                      color: "#fff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      zIndex: 10,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
