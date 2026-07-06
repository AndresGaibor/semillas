import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getThemes } from "../features/themes/themes.api";
import { getSendas } from "../features/sendas/sendas.api";
import { Zap, Clock, Loader, BookOpen } from "lucide-react";

export const Route = createFileRoute("/app/sendas/$sendaId")({
  component: SendaDetailPage
});

function SendaDetailPage() {
  const { sendaId } = Route.useParams();

  const sendaQuery = useQuery({ queryKey: ["sendas"], queryFn: getSendas });
  const senda = sendaQuery.data?.find((s) => s.id === sendaId);

  const themesQuery = useQuery({
    queryKey: ["themes", { pathId: sendaId }],
    queryFn: () => getThemes({ pathId: sendaId })
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${senda?.color_hex ?? "#ccc"}15` }}
        >
          <BookOpen size={20} style={{ color: senda?.color_hex }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#123b2c]">{senda?.name ?? "Cargando..."}</h1>
          <p className="text-xs text-[#123b2c]/40">{themesQuery.data?.length ?? 0} temas</p>
        </div>
      </div>

      {themesQuery.isLoading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-[#2e9e5b]" size={24} />
        </div>
      )}

      {themesQuery.data?.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-[#123b2c]/20" size={48} />
          <p className="text-[#123b2c]/40 mt-3">No hay temas publicados aún</p>
        </div>
      )}

      <div className="grid gap-3">
        {themesQuery.data?.map((theme, i) => (
          <Link
            key={theme.id}
            to="/app/temas/$themeId"
            params={{ themeId: theme.id }}
            className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2e9e5b]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#2e9e5b] font-bold text-sm">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-[#123b2c] truncate">{theme.title}</h2>
                <p className="text-xs text-[#123b2c]/50 line-clamp-2 mt-1">{theme.summary}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-[#f4b740]">
                    <Zap size={14} />
                    {theme.xp_reward} XP
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#123b2c]/40">
                    <Clock size={14} />
                    {theme.estimated_minutes} min
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
