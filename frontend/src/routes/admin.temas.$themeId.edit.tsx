import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getAdminTheme, updateTheme, type UpdateThemeRequest } from "../features/admin/admin.api";
import { getAgeGroups, getBibleVersions } from "../features/catalog/catalog.api";
import { getSendas } from "../features/sendas/sendas.api";

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

  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: getSendas });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: getAgeGroups });
  const bibleVersionsQuery = useQuery({ queryKey: ["catalog", "bible-versions"], queryFn: getBibleVersions });

  const { register, handleSubmit } = useForm<UpdateThemeRequest>();

  const updateMutation = useMutation({
    mutationFn: (values: UpdateThemeRequest) => updateTheme(themeId, values),
    onSuccess: () => navigate({ to: "/admin/temas" })
  });

  const theme = themeQuery.data;

  return (
    <main>
      <h1>Editar: {theme?.title ?? "Cargando..."}</h1>

      <form
        onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
        style={{ display: "grid", gap: 16, maxWidth: 720 }}
      >
        <input placeholder="Título" defaultValue={theme?.title ?? ""} {...register("title")} />
        <textarea placeholder="Objetivo" defaultValue={theme?.objective ?? ""} {...register("objective")} />
        <textarea placeholder="Resumen" defaultValue={theme?.summary ?? ""} {...register("summary")} />

        <select {...register("bibleVersionId")} defaultValue={theme?.bible_version_id ?? ""}>
          <option value="">Versión bíblica</option>
          {bibleVersionsQuery.data?.map((v) => (
            <option key={v.id} value={v.id}>{v.code}</option>
          ))}
        </select>

        <input type="number" placeholder="Minutos" defaultValue={theme?.estimated_minutes} {...register("estimatedMinutes")} />
        <input type="number" placeholder="XP" defaultValue={theme?.xp_reward} {...register("xpReward")} />

        <fieldset>
          <legend>Franjas de edad</legend>
          {ageGroupsQuery.data?.map((ag) => (
            <label key={ag.id} style={{ display: "block" }}>
              <input type="checkbox" value={ag.id} {...register("ageGroupIds")} />
              {ag.name}
            </label>
          ))}
        </fieldset>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit">{updateMutation.isPending ? "Guardando..." : "Guardar cambios"}</button>
          <button type="button" onClick={() => navigate({ to: "/admin/temas" })}>Cancelar</button>
        </div>
      </form>
    </main>
  );
}
