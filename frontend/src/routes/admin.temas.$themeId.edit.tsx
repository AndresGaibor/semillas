import { createFileRoute } from "@tanstack/react-router";
import { AdminTemasEditHeader } from "../features/admin/componentes/admin-temas-edit-header";
import { AdminTemasEditTabs } from "../features/admin/componentes/admin-temas-edit-tabs";
import { TabGeneral } from "../features/admin/componentes/tab-general";
import { TabPortada } from "../features/admin/componentes/tab-portada";
import { TabConfig } from "../features/admin/componentes/tab-config";
import { TabPublicacion } from "../features/admin/componentes/tab-publicacion";
import { EditThemeActionsPanel } from "../features/admin/componentes/edit-theme-actions-panel";
import { ThemeStatusPanel } from "../features/admin/componentes/edit-theme-status-panel";
import { EditThemeLastEditPanel } from "../features/admin/componentes/edit-theme-last-edit-panel";
import { EditThemeCompletenessPanel } from "../features/admin/componentes/edit-theme-completeness-panel";
import { EditThemeLoading } from "../features/admin/componentes/edit-theme-loading";
import { PortadaFileInput } from "../features/admin/componentes/portada-file-input";
import { getCompletenessData } from "../features/admin/componentes/edit-theme-completeness-data";
import { useThemeEditPage } from "../features/admin/hooks/use-theme-edit-page";

const COMPLETENESS_DATA = getCompletenessData();

export const Route = createFileRoute("/admin/temas/$themeId/edit")({
  component: EditThemePage,
});

function EditThemePage() {
  const { themeId } = Route.useParams();
  const {
    navigate,
    inputPortadaRef,
    activeTab,
    setActiveTab,
    title,
    setTitle,
    targetAudience,
    setTargetAudience,
    shortDesc,
    setShortDesc,
    category,
    setCategory,
    duration,
    setDuration,
    keyVerse,
    setKeyVerse,
    mainMessage,
    setMainMessage,
    tagsList,
    setTagsList,
    themeQuery,
    theme,
    portadaUrl,
    portadaMutation,
    updateMutation,
    publicarMutation,
    borradorMutation,
    duplicarMutation,
    archivarMutation,
    handlePortadaInput,
    handleAbrirSelectorPortada,
    handleQuitarPortada,
  } = useThemeEditPage({ themeId });

  if (themeQuery.isLoading) {
    return <EditThemeLoading />;
  }

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      <PortadaFileInput inputRef={inputPortadaRef} onFileChange={handlePortadaInput} />

      <AdminTemasEditHeader title={title} onNavigate={(to) => navigate({ to })} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminTemasEditTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "portada" ? (
            <TabPortada
              themeTitle={title || theme?.titulo || "Tema"}
              portadaUrl={portadaUrl}
              isUploading={portadaMutation.isPending}
              onChangePortada={handleAbrirSelectorPortada}
              onRemovePortada={handleQuitarPortada}
            />
          ) : activeTab === "config" ? (
            <TabConfig
              estado={theme?.estado ?? "borrador"}
              versionContenido={theme?.version_contenido ?? 1}
              publicadoEn={theme?.publicado_en ?? null}
              minutosEstimados={duration}
              xpRecompensa={theme?.xp_recompensa ?? 0}
            />
          ) : activeTab === "publicacion" ? (
            <TabPublicacion
              estado={theme?.estado ?? "borrador"}
              publicadoEn={theme?.publicado_en ?? null}
              isPublishing={publicarMutation.isPending}
              isDrafting={borradorMutation.isPending}
              onPublicar={() => publicarMutation.mutate()}
              onBorrador={() => borradorMutation.mutate()}
            />
          ) : (
            <TabGeneral
              title={title} onTitleChange={setTitle}
              targetAudience={targetAudience} onTargetAudienceChange={setTargetAudience}
              shortDesc={shortDesc} onShortDescChange={setShortDesc}
              category={category} onCategoryChange={setCategory}
              keyVerse={keyVerse} onKeyVerseChange={setKeyVerse}
              duration={duration} onDurationChange={setDuration}
              mainMessage={mainMessage} onMainMessageChange={setMainMessage}
              tagsList={tagsList} onTagsChange={setTagsList}
              previewImageUrl={portadaUrl}
            />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <EditThemeActionsPanel
            onSave={() => updateMutation.mutate()}
            onDuplicate={() => duplicarMutation.mutate()}
            onArchive={() => archivarMutation.mutate()}
            isSavePending={updateMutation.isPending}
            isDuplicatePending={duplicarMutation.isPending}
            isArchivePending={archivarMutation.isPending}
          />
          <ThemeStatusPanel estado={theme?.estado} />
          <EditThemeLastEditPanel
            nombreVisible={theme?.creado_por?.nombre_visible}
            actualizadoEn={theme?.actualizado_en}
          />
          <EditThemeCompletenessPanel items={COMPLETENESS_DATA.items} percentage={COMPLETENESS_DATA.percentage} />
        </div>
      </div>
    </div>
  );
}
