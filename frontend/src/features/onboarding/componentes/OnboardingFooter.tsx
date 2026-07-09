interface OnboardingFooterProps {
  deshabilitado: boolean;
  onContinuar: () => void;
}

export function OnboardingFooter({ deshabilitado, onContinuar }: OnboardingFooterProps) {
  return (
    <div style={{ width: "100%", maxWidth: "400px", display: "flex", justifyContent: "center" }}>
      <button
        onClick={onContinuar}
        disabled={deshabilitado}
        style={{
          width: "100%",
          backgroundColor: deshabilitado ? "#E0E0E0" : "#7E57C2",
          color: deshabilitado ? "#9E9E9E" : "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "16px 24px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: deshabilitado ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          transition: "background-color 0.2s ease",
        }}
      >
        Continuar
      </button>
    </div>
  );
}
