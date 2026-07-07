import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { publicarTema, despublicarTema } from "../features/admin/admin.api";
import { obtenerTemas } from "../features/themes/themes.api";
import { BookOpen, Loader, Plus, CheckCircle, RotateCcw, Edit3, Layout, Gamepad2, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/temas")({
  component: AdminThemesPage
});

const statusColors: Record<string, string> = {
  borrador: "#e5e7eb",
  publicado: "#2e9e5b",
  revision: "#f4b740",
  archivado: "#999"
};

function AdminThemesPage() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ["admin", "themes"], queryFn: () => obtenerTemas() });

  const publishMutation = useMutation({
    mutationFn: publicarTema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "themes"] });
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: despublicarTema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "themes"] });
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#123b2c]">Temas</h1>
        <Link
          to="/admin/temas/new"
          className="flex items-center gap-1.5 bg-[#2e9e5b] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#267d4c] transition-colors"
        >
          <Plus size={16} /> Nuevo
        </Link>
      </div>

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-[#2e9e5b]" size={24} />
        </div>
      )}

      <div className="grid gap-3">
        {query.data?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <BookOpen className="mx-auto text-[#123b2c]/20 mb-3" size={48} />
            <p className="text-[#123b2c]/40">No hay temas aún</p>
            <Link to="/admin/temas/new" className="text-[#2e9e5b] text-sm font-medium mt-2 inline-block">
              Crear el primero
            </Link>
          </div>
        )}

        {query.data?.map((theme) => (
          <div key={theme.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#e5e7eb]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-[#123b2c] truncate">{theme.titulo}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${statusColors[theme.estado] ?? "#eee"}20`, color: statusColors[theme.estado] ?? "#666" }}
                  >
                    {theme.estado}
                  </span>
                  <span className="text-xs text-[#123b2c]/40">{theme.xp_recompensa} XP</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              <Link
                to="/admin/temas/$themeId/edit"
                params={{ themeId: theme.id }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f7f4ec] rounded-lg text-xs font-medium text-[#123b2c]/70 hover:bg-[#e8e5dd] transition-colors"
              >
                <Edit3 size={13} /> Editar
              </Link>
              <Link
                to="/admin/temas/$themeId/crecer"
                params={{ themeId: theme.id }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f7f4ec] rounded-lg text-xs font-medium text-[#123b2c]/70 hover:bg-[#e8e5dd] transition-colors"
              >
                <Layout size={13} /> CRECER
              </Link>
              <Link
                to="/admin/temas/$themeId/activities"
                params={{ themeId: theme.id }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f7f4ec] rounded-lg text-xs font-medium text-[#123b2c]/70 hover:bg-[#e8e5dd] transition-colors"
              >
                <Gamepad2 size={13} /> Actividades
              </Link>
              <Link
                to="/admin/temas/$themeId/preview"
                params={{ themeId: theme.id }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f7f4ec] rounded-lg text-xs font-medium text-[#123b2c]/70 hover:bg-[#e8e5dd] transition-colors"
              >
                <Eye size={13} /> Vista
              </Link>

              {theme.estado !== "publicado" ? (
                <button
                  onClick={() => publishMutation.mutate(theme.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#2e9e5b] text-white rounded-lg text-xs font-medium hover:bg-[#267d4c] transition-colors"
                >
                  <CheckCircle size={13} /> Publicar
                </button>
              ) : (
                <button
                  onClick={() => unpublishMutation.mutate(theme.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#ee6c4d] text-white rounded-lg text-xs font-medium hover:bg-[#d55a3d] transition-colors"
                >
                  <RotateCcw size={13} /> Despublicar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
