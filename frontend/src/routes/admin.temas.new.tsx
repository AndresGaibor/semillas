import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createTheme, type CreateThemeRequest } from "../features/admin/admin.api";
import { getAgeGroups, getBibleVersions } from "../features/catalog/catalog.api";
import { getSendas } from "../features/sendas/sendas.api";

export const Route = createFileRoute("/admin/temas/new")({
  component: NewThemePage
});

function NewThemePage() {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<CreateThemeRequest>({
    defaultValues: {
      estimatedMinutes: 10,
      xpReward: 50,
      ageGroupIds: []
    }
  });

  const sendasQuery = useQuery({
    queryKey: ["sendas"],
    queryFn: getSendas
  });

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: getAgeGroups
  });

  const bibleVersionsQuery = useQuery({
    queryKey: ["catalog", "bible-versions"],
    queryFn: getBibleVersions
  });

  const createMutation = useMutation({
    mutationFn: createTheme,
    onSuccess() {
      navigate({ to: "/admin/temas" });
    }
  });

  return (
    <main>
      <h1>Crear tema</h1>

      <form
        onSubmit={handleSubmit((values) =>
          createMutation.mutate({
            ...values,
            estimatedMinutes: Number(values.estimatedMinutes),
            xpReward: Number(values.xpReward)
          })
        )}
        style={{ display: "grid", gap: 16, maxWidth: 720 }}
      >
        <input placeholder="Título" {...register("title")} required />
        <input placeholder="Slug (ej: el-amor-de-dios)" {...register("slug")} required />
        <textarea placeholder="Objetivo" {...register("objective")} required />
        <textarea placeholder="Resumen" {...register("summary")} required />

        <select {...register("pathId")} required>
          <option value="">Selecciona una senda</option>
          {sendasQuery.data?.map((senda) => (
            <option key={senda.id} value={senda.id}>
              {senda.name}
            </option>
          ))}
        </select>

        <select {...register("bibleVersionId")} required>
          <option value="">Versión bíblica</option>
          {bibleVersionsQuery.data?.map((version) => (
            <option key={version.id} value={version.id}>
              {version.code}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Duración (minutos)"
          {...register("estimatedMinutes")}
        />

        <input type="number" placeholder="XP" {...register("xpReward")} />

        <fieldset>
          <legend>Franjas de edad</legend>
          {ageGroupsQuery.data?.map((ageGroup) => (
            <label key={ageGroup.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                value={ageGroup.id}
                {...register("ageGroupIds")}
              />
              {ageGroup.name}
            </label>
          ))}
        </fieldset>

        <button type="submit">
          {createMutation.isPending ? "Guardando..." : "Crear tema"}
        </button>
      </form>
    </main>
  );
}
