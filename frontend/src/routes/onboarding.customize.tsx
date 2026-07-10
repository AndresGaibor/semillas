import { createFileRoute } from "@tanstack/react-router";
import { unirClases } from "@/lib/utilidades";
import { OnboardingTopbar } from "../features/onboarding/componentes/OnboardingTopbar";
import { OnboardingStepIndicator } from "../features/onboarding/componentes/OnboardingStepIndicator";
import { NicknameField } from "../features/onboarding/componentes/NicknameField";
import { AvatarSelector } from "../features/onboarding/componentes/AvatarSelector";
import { FormNavigation } from "../features/onboarding/componentes/FormNavigation";
import { ProfilePreview } from "../features/onboarding/componentes/ProfilePreview";
import { HelpModal } from "../features/onboarding/componentes/HelpModal";
import { useCustomizePage } from "../features/onboarding/hooks/use-customize-page";

export const Route = createFileRoute("/onboarding/customize")({
  component: CustomizePage,
});

function CustomizePage() {
  const {
    nickname,
    setNickname,
    selectedAvatar,
    setSelectedAvatar,
    isHelpOpen,
    setIsHelpOpen,
    handleFinish,
    isButtonEnabled,
    actualizarPerfilMutation,
    navigateToBack,
  } = useCustomizePage();

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
            onBack={navigateToBack}
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
