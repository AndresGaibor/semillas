import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Layers3, Loader } from "lucide-react";

import { useThemeCrecerPage } from "../features/admin/hooks/use-theme-crecer-page";
import { AgeGroupSelector } from "../features/admin/componentes/age-group-selector";
import { CrecerStepSelector } from "../features/admin/componentes/crecer-step-selector";
import { CrecerContentEditor } from "../features/admin/componentes/crecer-content-editor";
import { ThemeCrecerHeader } from "../features/admin/componentes/theme-crecer-header";
import { ThemeCrecerSidebar } from "../features/admin/componentes/theme-crecer-sidebar";
import { formatearFechaHoraTema } from "../features/admin/componentes/theme-view.utils";

export const Route = createFileRoute("/admin/temas/$themeId/crecer")({
  component: AdminThemeCrecerPage,
});

function AdminThemeCrecerPage() {
  const { themeId } = Route.useParams();

  const {
    theme,
    portadaUrl,
    estado,
    selectedAgeGroup,
    activeStep,
    activeStepContent,
    pasos,
    pasosCompletos,
    totalPasos,
    progreso,
    selectedAgeGroupId,
    setSelectedAgeGroupId,
    activeStepCode,
    setActiveStepCode,
    title,
    setTitle,
    body,
    setBody,
    shortInstruction,
    setShortInstruction,
    themeQuery,
    ageGroupsQuery,
    stepsQuery,
    saveMutation,
    handleBack,
  } = useThemeCrecerPage({ themeId });

  if (themeQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-[#2e9e5b]" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#ffffff_38%,#eefcf4_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <button
          onClick={handleBack}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Volver a temas
        </button>

        <ThemeCrecerHeader
          theme={theme}
          portadaUrl={portadaUrl}
          estado={estado}
          pasosCompletos={pasosCompletos}
          totalPasos={totalPasos}
          progreso={progreso}
          selectedAgeGroup={selectedAgeGroup}
          onBack={handleBack}
        />

        <div className={`grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_380px]`}>
          <div className="flex min-w-0 flex-col gap-6">
            {ageGroupsQuery.data && (
              <AgeGroupSelector
                ageGroups={ageGroupsQuery.data}
                selectedAgeGroupId={selectedAgeGroupId}
                onSelect={setSelectedAgeGroupId}
              />
            )}

            {selectedAgeGroupId ? (
              <>
                <CrecerStepSelector
                  pasos={pasos}
                  activeStepCode={activeStepCode}
                  selectedAgeGroupId={selectedAgeGroupId}
                  stepsData={stepsQuery.data}
                  onSelect={setActiveStepCode}
                />

                <CrecerContentEditor
                  activeStep={activeStep}
                  selectedAgeGroup={selectedAgeGroup}
                  title={title}
                  body={body}
                  shortInstruction={shortInstruction}
                  onTitleChange={setTitle}
                  onBodyChange={setBody}
                  onShortInstructionChange={setShortInstruction}
                  onSave={() => saveMutation.mutate()}
                  isPending={saveMutation.isPending}
                  isSuccess={saveMutation.isSuccess}
                />
              </>
            ) : (
              <section className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
                  <Layers3 size={24} />
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-800">Elige una franja para comenzar</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500">
                  Cada franja tiene su propia versión CRECER. Selecciona una edad para ver el editor, cargar contenido y guardar progreso.
                </p>
              </section>
            )}
          </div>

          <ThemeCrecerSidebar
            theme={theme}
            portadaUrl={portadaUrl}
            estado={estado}
            activeStepContent={activeStepContent}
            formatElapsed={formatearFechaHoraTema}
          />
        </div>
      </div>
    </div>
  );
}
