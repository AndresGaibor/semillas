import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getAdminTheme, updateTheme, type UpdateThemeRequest } from "../features/admin/admin.api";
import { getAgeGroups, getBibleVersions } from "../features/catalog/catalog.api";
import { ArrowLeft, Loader, Save } from "lucide-react";

export const Route = createFileRoute("/admin/temas/$themeId/edit")({
  component: EditThemePage
});

function EditThemePage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();

  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => getAdminTheme(themeId)
  });

  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: getAgeGroups });
  const bibleVersionsQuery = useQuery({ queryKey: ["catalog", "bible-versions"], queryFn: getBibleVersions });

  const { register, handleSubmit, reset, watch } = useForm<UpdateThemeRequest>();
  const selectedAges = watch("ageGroupIds") ?? [];

  const theme = themeQuery.data;

  useEffect(() => {
    if (theme) {
      reset({
        title: theme.title,
        objective: theme.objective,
        summary: theme.summary ?? "",
        bibleVersionId: theme.bible_version_id ?? "",
        xpReward: theme.xp_reward,
        estimatedMinutes: theme.estimated_minutes
      });
    }
  }, [theme, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: UpdateThemeRequest) => updateTheme(themeId, values),
    onSuccess: () => navigate({ to: "/admin/temas" })
  });

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4 hover:text-[#123b2c] transition-colors">
        <ArrowLeft size={16} /> Volver
      </button>

      <h1 className="text-2xl font-bold text-[#123b2c] mb-6">Editar tema</h1>

      {themeQuery.isLoading && (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-[#2e9e5b]" size={24} /></div>
      )}

      {themeQuery.isError && (
        <div className="bg-[#ee6c4d]/10 text-[#ee6c4d] p-4 rounded-xl mb-4 text-sm">
          Error al cargar el tema. ¿Tienes rol de admin?
        </div>
      )}

      <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))} className="grid gap-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Título</label>
          <input {...register("title")} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Objetivo</label>
          <textarea {...register("objective")} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Resumen</label>
          <textarea {...register("summary")} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Versión bíblica</label>
            <select {...register("bibleVersionId")} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm">
              <option value="">Seleccionar</option>
              {bibleVersionsQuery.data?.map((v) => <option key={v.id} value={v.id}>{v.code}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">XP</label>
            <input type="number" {...register("xpReward")} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-2 block">Franjas de edad</label>
          {ageGroupsQuery.data?.map((ag) => (
            <label key={ag.id} className="flex items-center gap-2 text-sm text-[#123b2c] mb-1">
              <input type="checkbox" value={ag.id} {...register("ageGroupIds")} defaultChecked={selectedAges.includes(ag.id)} className="rounded text-[#2e9e5b]" />
              {ag.name}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex items-center gap-2 bg-[#2e9e5b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors disabled:opacity-50" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </button>
          <button type="button" onClick={() => navigate({ to: "/admin/temas" })} className="px-6 py-2.5 rounded-xl border border-[#e5e7eb] text-sm hover:bg-[#f7f4ec] transition-colors">
            Cancelar
          </button>
        </div>

        {updateMutation.isSuccess && <p className="text-[#2e9e5b] text-sm">¡Guardado!</p>}
        {updateMutation.isError && <p className="text-[#ee6c4d] text-sm">Error al guardar. ¿Tienes rol de admin?</p>}
      </form>
    </div>
  );
}
