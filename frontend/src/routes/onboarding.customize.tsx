import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { actualizarPerfil } from "../features/profile/profile.api";
import { unirClases } from "@/lib/utilidades";
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
      className={unirClases(
        "onboarding-shell",
        "font-['Nunito',sans-serif] bg-[#f8f9fc] text-[#1A1A1A] min-h-screen flex flex-col m-0 p-0",
      )}
    >
      <OnboardingTopbar onHelpClick={() => setIsHelpOpen(true)} />
      <main
        className={unirClases(
          "onboarding-shell__main",
          "flex-1 flex max-w-[1200px] my-10 mx-auto w-full px-5 gap-10 items-start",
        )}
      >
        <div
          className={unirClases(
            "onboarding-shell__form",
            "flex-[3] bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-w-0",
          )}
        >
          <h1 className="text-3xl text-[#512DA8] mb-2 font-extrabold">
            Crea tu perfil
          </h1>
          <p className="text-[#5C5C5C] mb-8 text-base m-0">
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
