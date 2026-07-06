import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createTheme, type CreateThemeRequest } from "../features/admin/admin.api";
import { getAgeGroups, getBibleVersions } from "../features/catalog/catalog.api";
import { getSendas } from "../features/sendas/sendas.api";
import { ArrowLeft, Loader } from "lucide-react";

export const Route = createFileRoute("/admin/temas/new")({
  component: NewThemePage
});

function NewThemePage() {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<CreateThemeRequest>({
    defaultValues: { estimatedMinutes: 15, xpReward: 50, ageGroupIds: [] }
  });

  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: getSendas });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: getAgeGroups });
  const bibleVersionsQuery = useQuery({ queryKey: ["catalog", "bible-versions"], queryFn: getBibleVersions });

  const createMutation = useMutation({
    mutationFn: createTheme,
    onSuccess: () => navigate({ to: "/admin/temas" })
  });

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4">
        <ArrowLeft size={16} /> Volver a temas
      </button>

      <h1 className="text-2xl font-bold text-[#123b2c] mb-6">Nuevo tema</h1>

      <form
        onSubmit={handleSubmit((values) =>
          createMutation.mutate({
            ...values,
            estimatedMinutes: Number(values.estimatedMinutes),
            xpReward: Number(values.xpReward)
          })
        )}
        className="grid gap-4 max-w-2xl"
      >
        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Título</label>
          <input {...register("title", { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/30" placeholder="El amor de Dios" />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Slug</label>
          <input {...register("slug", { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/30" placeholder="el-amor-de-dios" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Senda</label>
            <select {...register("pathId", { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm">
              <option value="">Seleccionar</option>
              {sendasQuery.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Versión bíblica</label>
            <select {...register("bibleVersionId", { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm">
              <option value="">Seleccionar</option>
              {bibleVersionsQuery.data?.map((v) => <option key={v.id} value={v.id}>{v.code}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Objetivo</label>
          <textarea {...register("objective", { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/30" rows={3} placeholder="Que el niño comprenda..." />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-1 block">Resumen</label>
          <textarea {...register("summary", { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2e9e5b]/30" rows={2} placeholder="Breve descripción del tema..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Duración (min)</label>
            <input type="number" {...register("estimatedMinutes")} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">XP</label>
            <input type="number" {...register("xpReward")} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#123b2c] mb-2 block">Franjas de edad</label>
          <div className="grid gap-2">
            {ageGroupsQuery.data?.map((ag) => (
              <label key={ag.id} className="flex items-center gap-2 text-sm text-[#123b2c]">
                <input type="checkbox" value={ag.id} {...register("ageGroupIds")} className="rounded border-[#e5e7eb] text-[#2e9e5b] focus:ring-[#2e9e5b]" />
                {ag.name} ({ag.min_age}-{ag.max_age} años)
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full bg-[#2e9e5b] text-white py-3 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {createMutation.isPending ? <Loader className="animate-spin" size={18} /> : null}
          {createMutation.isPending ? "Creando..." : "Crear tema"}
        </button>
      </form>
    </div>
  );
}
