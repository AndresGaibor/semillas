import { useNavigate } from "@tanstack/react-router";

interface OnboardingStepIndicatorProps {
  pasoActual: number;
}

const tabInactiveBtnStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "14px",
  color: "#9E9E9E",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

const tabActiveStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "14px",
  color: "#7E57C2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const circleStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  background: "#7E57C2",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 700,
};

export function OnboardingStepIndicator({ pasoActual }: OnboardingStepIndicatorProps) {
  const navigate = useNavigate();

  return (
    <div
      className="onboarding-stepper"
      style={{
        display: "flex",
        background: "#f4f5f7",
        borderRadius: "12px",
        padding: "4px",
        marginBottom: "40px",
      }}
    >
      <button
        onClick={() => navigate({ to: "/onboarding" })}
        style={tabInactiveBtnStyle}
      >
        <span style={circleStyle}>
          ✓
        </span>
        Tu edad
      </button>
      <div style={tabActiveStyle}>
        <span style={circleStyle}>
          2
        </span>
        Tu información
      </div>
    </div>
  );
}
