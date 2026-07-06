import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAdminTheme, updateTheme } from "../features/admin/admin.api";
import { ArrowLeft, Loader, Save } from "lucide-react";

export const Route = createFileRoute("/admin/temas/$themeId/edit")({
  component: EditThemePage
});

function EditThemePage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [summary, setSummary] = useState("");
  const [xpReward, setXpReward] = useState(0);

  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => getAdminTheme(themeId)
  });

  const theme = themeQuery.data;

  useEffect(() => {
    if (theme) {
      setTitle(theme.title);
      setObjective(theme.objective);
      setSummary(theme.summary ?? "");
      setXpReward(theme.xp_reward);
    }
  }, [theme]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateTheme(themeId, { title, objective, summary, xpReward }),
    onSuccess: () => navigate({ to: "/admin/temas" })
  });

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <h1 className="text-2xl font-bold text-[#123b2c] mb-6">Editar tema</h1>

      {themeQuery.isLoading && (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-[#2e9e5b]" size={24} /></div>
      )}

      {themeQuery.isError && (
        <div className="bg-[#ee6c4d]/10 text-[#ee6c4d] p-4 rounded-xl mb-4 text-sm">
          Error al cargar el tema. ¿Usaste el botón "Crear admin de prueba" en login?
        </div>
      )}

      {theme && (
        <div className="grid gap-4 max-w-2xl">
          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Objetivo</label>
            <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">Resumen</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-1 block">XP</label>
            <input type="number" value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm" />
          </div>

          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="flex items-center justify-center gap-2 bg-[#2e9e5b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </button>

          {updateMutation.isSuccess && <p className="text-[#2e9e5b] text-sm">¡Guardado!</p>}
          {updateMutation.isError && <p className="text-[#ee6c4d] text-sm">Error al guardar.</p>}
        </div>
      )}
    </div>
  );
}
