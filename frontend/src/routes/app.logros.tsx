import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMyGamification } from "../features/gamification/gamification.api";
import { Award, Zap, TrendingUp, Loader } from "lucide-react";

export const Route = createFileRoute("/app/logros")({
  component: AchievementsPage
});

function AchievementsPage() {
  const query = useQuery({ queryKey: ["gamification", "me"], queryFn: getMyGamification });

  const nivel = query.data?.nivel;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#123b2c] mb-2">Mis logros</h1>
      <p className="text-sm text-[#123b2c]/50 mb-6">Tu progreso y recompensas</p>

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-[#2e9e5b]" size={24} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <div className="w-12 h-12 bg-[#f4b740]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Zap className="text-[#f4b740]" size={24} />
          </div>
          <p className="text-3xl font-bold text-[#123b2c]">{nivel?.xp_total ?? 0}</p>
          <p className="text-xs text-[#123b2c]/40">XP total</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <div className="w-12 h-12 bg-[#2e9e5b]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="text-[#2e9e5b]" size={24} />
          </div>
          <p className="text-3xl font-bold text-[#123b2c]">{nivel?.numero_nivel ?? 1}</p>
          <p className="text-xs text-[#123b2c]/40">{nivel?.nombre_nivel ?? "Brote"}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-[#f4b740]" size={20} />
          <h2 className="font-bold text-[#123b2c]">Insignias</h2>
        </div>

        {(!query.data?.logros || query.data.logros.length === 0) && (
          <p className="text-sm text-[#123b2c]/40 text-center py-4">
            Aún no tienes insignias. ¡Completa actividades para ganarlas!
          </p>
        )}
      </div>
    </div>
  );
}
