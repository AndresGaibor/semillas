import { MAPA_AVATARES } from "@/shared/constants/avatares";
import fondoAvatarImg from "@/assets/images/backgrounds/Fondo Avatar.png";

interface ProfilePreviewProps {
  selectedAvatar: number;
  nickname: string;
}

export function ProfilePreview({ selectedAvatar, nickname }: ProfilePreviewProps) {
  return (
    <div
      className="onboarding-preview"
      style={{
        flex: 2,
        display: "flex",
        flexDirection: "column",
        minWidth: "280px",
        maxWidth: "380px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "18px",
          fontWeight: 700,
          color: "#4527A0",
          marginBottom: "24px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z" />
        </svg>
        Así se verá tu perfil
      </div>

      <div
        className="onboarding-preview-card"
        style={{
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
          textAlign: "center",
          paddingBottom: "32px",
        }}
      >
        <div style={{ width: "100%", height: "180px", background: "#e5f0f9", position: "relative", overflow: "hidden" }}>
          <img src={fondoAvatarImg} alt="Fondo del avatar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div
          style={{
            width: "140px",
            height: "140px",
            margin: "-70px auto 16px",
            borderRadius: "50%",
            border: "6px solid #fff",
            background: "#fff",
            position: "relative",
            zIndex: 10,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={MAPA_AVATARES[String(selectedAvatar)]}
            alt="Tu avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#1A1A1A",
            marginBottom: "24px",
            padding: "0 16px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {nickname.trim() || "Tú"}
        </div>
        <div
          style={{
            background: "#E8F5E9",
            margin: "0 24px",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "left",
          }}
        >
          <strong style={{ color: "#2E7D32", fontSize: "16px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
            ¡Bienvenido a Semillas!
          </strong>
          <p style={{ color: "#2E2E2E", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
            Aquí aprenderás, explorarás y harás del mundo un lugar mejor.
          </p>
        </div>
      </div>
    </div>
  );
}
