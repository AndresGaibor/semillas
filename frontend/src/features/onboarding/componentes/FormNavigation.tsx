interface FormNavigationProps {
  onBack: () => void;
  onFinish: () => void;
  isEnabled: boolean;
  isLoading: boolean;
}

export function FormNavigation({ onBack, onFinish, isEnabled, isLoading }: FormNavigationProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #e5e7eb",
        paddingTop: "24px",
        marginTop: "40px",
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "1.5px solid #9E9E9E",
          color: "#2E2E2E",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "16px",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        ← Atrás
      </button>
      <button
        onClick={onFinish}
        disabled={!isEnabled}
        style={{
          background: isEnabled ? "#7E57C2" : "#E0E0E0",
          color: isEnabled ? "#fff" : "#9E9E9E",
          border: "none",
          padding: "12px 32px",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "16px",
          cursor: isEnabled ? "pointer" : "not-allowed",
          fontFamily: "inherit",
          transition: "background 0.2s ease",
        }}
      >
        {isLoading ? "Finalizando..." : "Finalizar →"}
      </button>
    </div>
  );
}
