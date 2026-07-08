interface NicknameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function NicknameField({ value, onChange }: NicknameFieldProps) {
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
          1
        </span>
        ¿Cómo quieres que te llamemos?
      </div>
      <p style={{ fontSize: "14px", color: "#5C5C5C", margin: "0 0 8px 0" }}>Apodo</p>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <svg
          style={{ position: "absolute", left: "16px", width: "20px", height: "20px", color: "#7E57C2", pointerEvents: "none", flexShrink: 0 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <input
          type="text"
          maxLength={20}
          placeholder="Escribe tu apodo"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            border: "1.5px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "16px",
            outline: "none",
            color: "#1A1A1A",
            background: "#fff",
            fontFamily: "inherit",
            paddingLeft: "48px",
            paddingRight: "16px",
            paddingTop: "16px",
            paddingBottom: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ textAlign: "right", fontSize: "12px", color: "#9E9E9E", marginTop: "4px", fontWeight: 500 }}>
        Máx. 20 caracteres
      </div>
    </div>
  );
}
