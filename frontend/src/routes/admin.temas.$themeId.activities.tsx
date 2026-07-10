import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ActivityHeader } from "../features/admin/componentes/activity-header";
import { ActivityFormPanel } from "../features/admin/componentes/activity-form-panel";
import { BackButton } from "../features/admin/componentes/admin-back-button";
import { useThemeActivitiesPage } from "../features/admin/hooks/use-theme-activities-page";
import type { ActivitySearch } from "../features/admin/componentes/activity-search.types";
import type { Actividad } from "../shared/api/api";
import { Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/admin/temas/$themeId/activities")({
  component: AdminThemeActivitiesPage,
  validateSearch: (search: Record<string, unknown>): ActivitySearch => ({
    form: search.form as "nueva" | "editar" | undefined,
    actividadId: search.actividadId as string | undefined,
  }),
});

function AdminThemeActivitiesPage() {
  const { themeId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const {
    selectedAgeGroupId,
    setSelectedAgeGroupId,
    title,
    setTitle,
    prompt,
    setPrompt,
    xpReward,
    setXpReward,
    selectedStepId,
    setSelectedStepId,
    selectedActivityTypeId,
    setSelectedActivityTypeId,
    feedback,
    setFeedback,
    options,
    setOptions,
    ageGroupsQuery,
    activitiesQuery,
    stepsQuery,
    activityTypesQuery,
    isEditMode,
    isNewMode,
    isFormOpen,
    isSubmitting,
    deleteMutation,
    handleOptionChange,
    handleCorrectChange,
    handleSubmit,
    handleClose,
  } = useThemeActivitiesPage({
    themeId,
    actividadId: search.actividadId,
    form: search.form,
  });

  return (
    <div>
      <BackButton onClick={() => navigate({ to: "/admin/temas" })} />

      <ActivityHeader
        selectedAgeGroupId={selectedAgeGroupId}
        ageGroupsData={ageGroupsQuery.data}
        isEditMode={!!isEditMode}
        isLoading={activitiesQuery.isLoading}
        onAgeGroupChange={setSelectedAgeGroupId}
        onNew={() => navigate({ search: { form: "nueva" } })}
      />

      {isFormOpen && (
        <ActivityFormPanel
          isEditMode={!!isEditMode}
          selectedStepId={selectedStepId}
          selectedActivityTypeId={selectedActivityTypeId}
          title={title}
          prompt={prompt}
          feedback={feedback}
          xpReward={xpReward}
          options={options}
          stepsData={stepsQuery.data}
          activityTypesData={activityTypesQuery.data}
          isSubmitting={isSubmitting}
          onStepChange={setSelectedStepId}
          onTypeChange={setSelectedActivityTypeId}
          onTitleChange={setTitle}
          onPromptChange={setPrompt}
          onFeedbackChange={setFeedback}
          onXpChange={setXpReward}
          onOptionChange={handleOptionChange}
          onCorrectChange={handleCorrectChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {!isFormOpen && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {activitiesQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-[#2e9e5b] border-t-transparent rounded-full" />
            </div>
          ) : !activitiesQuery.data || activitiesQuery.data.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="mx-auto text-[#123b2c]/20 mb-3" size={48} />
              <p className="text-[#123b2c]/40">No hay actividades aún</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {activitiesQuery.data.map((activity: Actividad) => (
                <div key={activity.id} className="flex items-center justify-between rounded-xl p-3 border border-slate-100">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{activity.titulo}</p>
                    <p className="text-xs text-slate-500">{activity.tipo_actividad?.nombre}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => navigate({ search: { form: "editar", actividadId: activity.id } })}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <i className="fa-solid fa-pencil" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(activity.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
