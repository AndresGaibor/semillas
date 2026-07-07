import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { actualizarPerfil } from "../features/profile/profile.api";

import logoImg from "@/assets/images/logos/Logotipo.png";
import { MAPA_AVATARES } from "@/shared/constants/avatares";
import fondoAvatarImg from "@/assets/images/backgrounds/Fondo Avatar.png";

export const Route = createFileRoute("/onboarding/customize")({
  component: CustomizePage,
});

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

function CustomizePage() {
  const navigate = useNavigate();
  const [grupoEdadId, setGrupoEdadId] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("onboarding_grupo_edad_id");
    if (savedId) setGrupoEdadId(savedId);
  }, []);

  const actualizarPerfilMutation = useMutation({
    mutationFn: actualizarPerfil,
    onSuccess() {
      localStorage.removeItem("onboarding_grupo_edad_id");
      navigate({ to: "/app" });
    },
  });

  const isUuid = (str: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

  const handleFinish = () => {
    actualizarPerfilMutation.mutate({
      grupo_edad_id: isUuid(grupoEdadId) ? grupoEdadId : null,
      apodo: nickname.trim(),
      url_avatar: String(selectedAvatar),
    });
  };

  const isButtonEnabled = nickname.trim().length > 0 && !actualizarPerfilMutation.isPending;

  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "#f8f9fc",
        color: "#1A1A1A",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {/* ── Topbar ── */}
      <header style={topbarStyle}>
        <Link to="/" style={brandStyle}>
          <img
            src={logoImg}
            alt="Logo de Semilla"
            style={{ width: "56px", height: "56px", objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "1.95rem", fontWeight: 800, color: "#512DA8", lineHeight: 1.1 }}>
              Semillas
            </span>
            <span style={{ fontSize: "0.64rem", color: "#43A047", fontWeight: 600 }}>
              Crecer en la Palabra, vivir Su verdad
            </span>
          </div>
        </Link>
        <button onClick={() => setIsHelpOpen(true)} style={helpBtnStyle}>
          <HelpCircle size={16} />
          Ayuda
        </button>
      </header>

      {/* ── Main: .perfil-main ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          maxWidth: "1200px",
          margin: "40px auto",
          width: "100%",
          padding: "0 20px",
          gap: "40px",
          boxSizing: "border-box",
          alignItems: "flex-start",
        }}
      >
        {/* ── Form Section ── */}
        <div
          style={{
            flex: 3,
            background: "#fff",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            minWidth: 0,
          }}
        >
          <h1 style={{ fontSize: "32px", color: "#512DA8", margin: "0 0 8px 0", fontWeight: 800 }}>
            Crea tu perfil
          </h1>
          <p style={{ color: "#5C5C5C", marginBottom: "32px", fontSize: "16px", margin: "0 0 32px 0" }}>
            Cuéntanos un poco sobre ti para personalizar tu experiencia en Semillas.
          </p>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              background: "#f4f5f7",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "40px",
            }}
          >
            {/* Tab 1: completed */}
            <button
              onClick={() => navigate({ to: "/onboarding" })}
              style={{
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
              }}
            >
              <span
                style={{
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
                }}
              >
                ✓
              </span>
              Tu edad
            </button>
            {/* Tab 2: active */}
            <div
              style={{
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
              }}
            >
              <span
                style={{
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
                }}
              >
                2
              </span>
              Tu información
            </div>
          </div>

          {/* Field 1: Nickname */}
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
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
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

          {/* Field 2: Avatar */}
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
                      onChange={() => setSelectedAvatar(avatarNum)}
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

          {/* Footer buttons */}
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
              onClick={() => navigate({ to: "/onboarding" })}
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
              onClick={handleFinish}
              disabled={!isButtonEnabled}
              style={{
                background: isButtonEnabled ? "#7E57C2" : "#E0E0E0",
                color: isButtonEnabled ? "#fff" : "#9E9E9E",
                border: "none",
                padding: "12px 32px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "16px",
                cursor: isButtonEnabled ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                transition: "background 0.2s ease",
              }}
            >
              {actualizarPerfilMutation.isPending ? "Finalizando..." : "Finalizar →"}
            </button>
          </div>
        </div>

        {/* ── Preview Section ── */}
        <div
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
            style={{
              background: "#fff",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              overflow: "hidden",
              textAlign: "center",
              paddingBottom: "32px",
            }}
          >
            {/* Cover image */}
            <div style={{ width: "100%", height: "180px", background: "#e5f0f9", position: "relative", overflow: "hidden" }}>
              <img src={fondoAvatarImg} alt="Fondo del avatar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* Avatar circle */}
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
            {/* Name */}
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
            {/* Welcome card */}
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
      </main>

      {/* ── Help Modal ── */}
      {isHelpOpen && (
        <div
          onClick={() => setIsHelpOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "450px",
              padding: "32px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#512DA8", margin: 0, lineHeight: 1.3 }}>
                Preguntas Frecuentes
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                style={{
                  background: "#F5F5F5",
                  border: "none",
                  fontSize: "24px",
                  lineHeight: 1,
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#5C5C5C",
                  cursor: "pointer",
                }}
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
            <div>
              <strong style={{ fontWeight: 700, color: "#512DA8", display: "block", marginBottom: "4px" }}>¿Qué es el apodo?</strong>
              <p style={{ fontSize: "15px", color: "#2E2E2E", lineHeight: 1.65, marginBottom: "16px" }}>
                Es un nombre corto o sobrenombre que usaremos para llamarte dentro de la aplicación de manera amigable. Te sugerimos no usar tu nombre real completo para proteger tu privacidad.
              </p>
              <strong style={{ fontWeight: 700, color: "#512DA8", display: "block", marginBottom: "4px" }}>¿Para qué sirve el avatar?</strong>
              <p style={{ fontSize: "15px", color: "#2E2E2E", lineHeight: 1.65, margin: 0 }}>
                Tu avatar es el personaje que te representará en las actividades de Semillas. Elige el que más te guste o con el que más te identifiques.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
