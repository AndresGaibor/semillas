import { HelpCircle } from "lucide-react";
import logoImg from "@/assets/images/logos/Logotipo.png";

const topbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const brandStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textDecoration: "none",
};

const helpBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "transparent",
  border: "1.5px solid #e5e7eb",
  borderRadius: "20px",
  padding: "8px 16px",
  fontFamily: "inherit",
  fontSize: "14px",
  fontWeight: 700,
  color: "#1A1A1A",
  cursor: "pointer",
};

interface OnboardingTopbarProps {
  onHelpClick: () => void;
}

export function OnboardingTopbar({ onHelpClick }: OnboardingTopbarProps) {
  return (
    <header className="onboarding-topbar" style={topbarStyle}>
      <a href="/" className="onboarding-brand" style={brandStyle}>
        <img
          src={logoImg}
          alt="Logo de Semilla"
          className="onboarding-brand__logo"
          style={{ width: "56px", height: "56px", objectFit: "contain" }}
        />
        <div className="onboarding-brand__copy" style={{ display: "flex", flexDirection: "column" }}>
          <span className="onboarding-brand__title" style={{ fontSize: "1.95rem", fontWeight: 800, color: "#512DA8", lineHeight: 1.1 }}>
            Semillas
          </span>
          <span className="onboarding-brand__tagline" style={{ fontSize: "0.64rem", color: "#43A047", fontWeight: 600 }}>
            Crecer en la Palabra, vivir Su verdad
          </span>
        </div>
      </a>
      <button className="onboarding-help-button" onClick={onHelpClick} style={helpBtnStyle}>
        <HelpCircle size={16} />
          <span className="onboarding-help-button__label">Ayuda</span>
        </button>
      </header>
  );
}
