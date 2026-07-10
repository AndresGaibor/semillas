import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { AdminTemasNewHeader } from "../features/admin/componentes/admin-temas-new-header";
import { PasoInformacionGeneral } from "../features/admin/componentes/paso-informacion-general";
import { PasoPreview } from "../features/admin/componentes/paso-preview";
import { FormNavigation } from "../features/admin/componentes/form-navigation";
import { useNewThemePage } from "../features/admin/hooks/use-new-theme-page";

export const Route = createFileRoute("/admin/temas/new")({
  component: NewThemePage
});

function NewThemePage() {
  const {
    sendasQuery,
    ageGroupsQuery,
    bibleVersionsQuery,
    register,
    liveTitle,
    tagsInput,
    onTagsInputChange,
    tagsList,
    onAddTag,
    onRemoveTag,
    clubVisibilities,
    onClubVisibilitiesChange,
    onSlugManualEdit,
    liveResumen,
    liveDuration,
    liveXp,
    activeVersion,
    checkedClubsCount,
    createMutation,
    onSubmitForm,
    onSaveDraft,
    isLoading,
    navigate
  } = useNewThemePage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-primario" size={24} />
        <span className="text-sm text-neutro ml-2">Cargando datos del catálogo...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <AdminTemasNewHeader onBack={() => navigate({ to: "/admin/temas" })} />

      <form onSubmit={onSubmitForm} className="grid grid-cols-1 gap-6 lg:grid-cols-4 select-none">

        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <PasoInformacionGeneral
            register={register}
            sendas={sendasQuery.data}
            gruposEdad={ageGroupsQuery.data}
            bibleVersions={bibleVersionsQuery.data}
            liveTitle={liveTitle}
            tagsInput={tagsInput}
            onTagsInputChange={onTagsInputChange}
            tagsList={tagsList}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            clubVisibilities={clubVisibilities}
            onClubVisibilitiesChange={onClubVisibilitiesChange}
            onSlugManualEdit={onSlugManualEdit}
          />
        </div>

        <div className="flex flex-col gap-6">
          <PasoPreview
            liveTitle={liveTitle}
            liveResumen={liveResumen}
            liveDuration={liveDuration}
            liveXp={liveXp}
            activeVersion={activeVersion}
            clubVisibilities={clubVisibilities}
            checkedClubsCount={checkedClubsCount}
          />
          <FormNavigation
            isPending={createMutation.isPending}
            onSaveDraft={onSaveDraft}
          />
        </div>

      </form>
    </div>
  );
}
