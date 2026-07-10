import { createFileRoute } from "@tanstack/react-router";
import { OnboardingTopbar } from "@/features/onboarding/componentes/OnboardingTopbar";
import { GrupoEdadGrid } from "@/features/onboarding/componentes/GrupoEdadGrid";
import { OnboardingFooter } from "@/features/onboarding/componentes/OnboardingFooter";
import { useOnboardingPage } from "@/features/onboarding/hooks/use-onboarding-page";

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const {
    selectedGroupId,
    setSelectedGroupId,
    isHelpOpen,
    setIsHelpOpen,
    ageGroupsQuery,
    data,
    handleContinue,
  } = useOnboardingPage();

  return (
    <div className="font-['Nunito',sans-serif] bg-white text-[#15124b] min-h-screen flex flex-col m-0 p-0 box-border">
      <OnboardingTopbar onHelpClick={() => setIsHelpOpen(true)} />

      <main className="flex-1 flex flex-col items-center p-6 max-w-[1200px] mx-auto w-full">
        <div className="onboarding-age-hero text-center mb-6">
          <h1 className="onboarding-age-hero__title text-3xl font-extrabold text-[#311B92] leading-tight m-0 mb-3">
            Elige tu franja de edad
          </h1>
          <p className="onboarding-age-hero__copy text-base text-[#5C5C5C] m-0">
            Selecciona la opción que mejor te representa. Podrás cambiarla después.
          </p>
        </div>

        <div className="onboarding-age-stepper flex bg-[#F4F5F7] rounded-xl p-1 mb-8 w-full max-w-[600px]">
          <div className="flex-1 text-center p-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-white text-[#7E57C2] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#7E57C2] font-bold">
              1
            </span>
            Tu edad
          </div>
          <div className="flex-1 text-center p-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 text-[#9E9E9E]">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white bg-[#BDBDBD] font-bold">
              2
            </span>
            Tu información
          </div>
        </div>

        <GrupoEdadGrid
          grupos={data}
          seleccionadoId={selectedGroupId}
          onSelect={setSelectedGroupId}
          cargando={ageGroupsQuery.isLoading}
        />

        <OnboardingFooter deshabilitado={!selectedGroupId} onContinuar={handleContinue} />
      </main>

      {isHelpOpen && (
        <div
          onClick={() => setIsHelpOpen(false)}
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-[90%] max-w-[450px] p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-extrabold text-[#512DA8] m-0 leading-snug">
                ¿Por qué elegir tu edad?
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="bg-[#F5F5F5] border-none text-2xl leading-none w-8 h-8 rounded-full flex justify-center items-center text-[#5C5C5C] cursor-pointer"
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
            <div>
              <p className="text-[15px] text-[#2E2E2E] leading-[1.65] mb-4">
                Queremos que tu experiencia en{" "}
                <strong className="font-bold text-[#512DA8]">Semillas</strong>{" "}
                sea la mejor posible. Al elegir tu franja de edad, adaptaremos
                el contenido, las historias y las actividades para que sean más
                afines a tus intereses y nivel de comprensión.
              </p>
              <p className="text-[15px] text-[#2E2E2E] leading-[1.65] m-0">
                ¡No te preocupes! Siempre podrás cambiar esta configuración más
                adelante desde tu perfil.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
