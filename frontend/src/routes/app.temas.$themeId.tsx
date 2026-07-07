import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { obtenerTema, obtenerPasos, obtenerActividades } from "../features/themes/themes.api";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { Zap, Loader, Play, CheckCircle, Circle } from "lucide-react";

const hex = (s: string | null | undefined): string => s ?? "#ccc";
const hexColor = (s: string | null | undefined): React.CSSProperties["color"] => s ?? "#ccc";

export const Route = createFileRoute("/app/temas/$themeId")({
  component: ThemeDetailPage
});

function ThemeDetailPage() {
  const { themeId } = Route.useParams();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: obtenerMiPerfil });
  const themeQuery = useQuery({ queryKey: ["theme", themeId], queryFn: () => obtenerTema(themeId) });
  const stepsQuery = useQuery({
    queryKey: ["theme", themeId, "steps", meQuery.data?.perfil?.grupo_edad_id],
    queryFn: () => obtenerPasos(themeId, meQuery.data?.perfil?.grupo_edad_id ?? undefined),
    enabled: !!meQuery.data
  });
  const activitiesQuery = useQuery({
    queryKey: ["theme", themeId, "activities", meQuery.data?.perfil?.grupo_edad_id],
    queryFn: () => obtenerActividades(themeId, meQuery.data?.perfil?.grupo_edad_id ?? undefined),
    enabled: !!meQuery.data
  });

  const firstActivity = activitiesQuery.data?.[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#123b2c]">{themeQuery.data?.titulo ?? "Cargando..."}</h1>
        <p className="text-sm text-[#123b2c]/50 mt-1">{themeQuery.data?.resumen}</p>
      </div>

      {stepsQuery.isLoading && (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-[#2e9e5b]" size={20} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#123b2c] mb-3">Recorrido CRECER</h2>
        <div className="grid gap-2">
          {stepsQuery.data?.map((step, i) => (
            <div
              key={step.id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm"
              style={{ borderLeft: `3px solid ${hex(step.tipo_paso?.color_hex)}` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${hex(step.tipo_paso?.color_hex)}15` }}
              >
                <span style={{ color: hexColor(step.tipo_paso?.color_hex) }} className="text-xs font-bold">
                  {["C", "R", "E", "C", "E", "R"][i] ?? i + 1}
                </span>
              </div>
              <div>
                <strong className="text-sm text-[#123b2c]">{step.tipo_paso?.nombre}</strong>
                <p className="text-xs text-[#123b2c]/40">{step.contenidos?.[0]?.instruccion_corta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#123b2c] mb-3">Actividades</h2>
        <div className="grid gap-2">
          {activitiesQuery.data?.map((activity) => (
            <Link
              key={activity.id}
              to="/app/actividades/$activityId"
              params={{ activityId: activity.id }}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-[#f4b740]/10 rounded-xl flex items-center justify-center shrink-0">
                <Play className="text-[#f4b740]" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-sm text-[#123b2c]">{activity.titulo}</strong>
                <p className="text-xs text-[#123b2c]/40 truncate">{activity.consigna}</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-[#f4b740] shrink-0">
                <Zap size={14} />
                {activity.xp_recompensa}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {firstActivity && (
          <Link
          to="/app/actividades/$activityId"
          params={{ activityId: firstActivity.id }}
          className="block w-full bg-[#2e9e5b] text-white py-3 rounded-xl font-semibold text-center hover:bg-[#267d4c] transition-colors"
        >
          Iniciar actividad
        </Link>
      )}
    </div>
  );
}
