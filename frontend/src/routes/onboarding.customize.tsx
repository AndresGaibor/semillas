import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { actualizarPerfil } from "../features/profile/profile.api";
import { OnboardingTopbar } from "../features/onboarding/componentes/OnboardingTopbar";
import { OnboardingStepIndicator } from "../features/onboarding/componentes/OnboardingStepIndicator";
import { NicknameField } from "../features/onboarding/componentes/NicknameField";
import { AvatarSelector } from "../features/onboarding/componentes/AvatarSelector";
import { FormNavigation } from "../features/onboarding/componentes/FormNavigation";
import { ProfilePreview } from "../features/onboarding/componentes/ProfilePreview";
import { HelpModal } from "../features/onboarding/componentes/HelpModal";
import { limpiarNombreSugeridoDeGoogle, leerNombreSugeridoDeGoogle } from "../shared/auth/google-profile";

export const Route = createFileRoute("/onboarding/customize")({
  component: CustomizePage,
});

function CustomizePage() {
  const navigate = useNavigate();
  const [grupoEdadId, setGrupoEdadId] = useState<string>("");
  const [nickname, setNickname] = useState<string>(() => leerNombreSugeridoDeGoogle());
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("onboarding_grupo_edad_id");
    if (savedId) setGrupoEdadId(savedId);
  }, []);

  const actualizarPerfilMutation = useMutation({
    mutationFn: actualizarPerfil,
    onSuccess() {
      limpiarNombreSugeridoDeGoogle();
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
      className="onboarding-shell"
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
      <OnboardingTopbar onHelpClick={() => setIsHelpOpen(true)} />
      <main
        className="onboarding-shell__main"
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
        <div
          className="onboarding-shell__form"
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
          <OnboardingStepIndicator pasoActual={2} />
          <NicknameField value={nickname} onChange={setNickname} />
          <AvatarSelector selectedAvatar={selectedAvatar} onSelect={setSelectedAvatar} />
          <FormNavigation
            onBack={() => navigate({ to: "/onboarding" })}
            onFinish={handleFinish}
            isEnabled={isButtonEnabled}
            isLoading={actualizarPerfilMutation.isPending}
          />
        </div>
        <ProfilePreview selectedAvatar={selectedAvatar} nickname={nickname} />
      </main>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
