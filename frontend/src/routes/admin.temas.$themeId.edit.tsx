import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getAdminTheme, updateTheme, type UpdateThemeRequest } from "../features/admin/admin.api";
import { getAgeGroups, getBibleVersions } from "../features/catalog/catalog.api";
import { ArrowLeft, Loader } from "lucide-react";

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

  const { register, handleSubmit } = useForm<UpdateThemeRequest>();

  const updateMutation = useMutation({
    mutationFn: (values: UpdateThemeRequest) => updateTheme(themeId, values),
    onSuccess: () => navigate({ to: "/admin/temas" })
  });

  const theme = themeQuery.data;

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <h1 className="text-2xl font-bold text-[#123b2c] mb-6">Editar tema</h1>

      {themeQuery.isLoading && (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-[#2e9e5b]" size={24} /></div>
      )}

      <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))} className="grid gap-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Título</label>
          <input defaultValue={theme?.title ?? ""} {...register("title")} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Objetivo</label>
          <textarea defaultValue={theme?.objective ?? ""} {...register("objective")} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Resumen</label>
          <textarea defaultValue={theme?.summary ?? ""} {...register("summary")} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Versión bíblica</label>
            <select {...register("bibleVersionId")} defaultValue={theme?.bible_version_id ?? ""} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm">
              <option value="">Seleccionar</option>
              {bibleVersionsQuery.data?.map((v) => <option key={v.id} value={v.id}>{v.code}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">XP</label>
            <input type="number" defaultValue={theme?.xp_reward} {...register("xpReward")} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-2 block">Franjas de edad</label>
          {ageGroupsQuery.data?.map((ag) => (
            <label key={ag.id} className="flex items-center gap-2 text-sm text-[#123b2c] mb-1">
              <input type="checkbox" value={ag.id} {...register("ageGroupIds")} className="rounded text-[#2e9e5b]" />
              {ag.name}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-[#2e9e5b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors">
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </button>
          <button type="button" onClick={() => navigate({ to: "/admin/temas" })} className="px-6 py-2.5 rounded-xl border border-[#e5e7eb] text-sm hover:bg-[#f7f4ec] transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
