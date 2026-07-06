import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../features/profile/profile.api";
import { getMyGamification } from "../features/gamification/gamification.api";
import { Compass, Zap, TrendingUp, Award } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: AppHomePage
});

function AppHomePage() {
  const meQuery = useQuery({ queryKey: ["me"], queryFn: getMe });
  const gamificationQuery = useQuery({ queryKey: ["gamification", "me"], queryFn: getMyGamification });

  const level = gamificationQuery.data?.level;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#123b2c]">
          Hola, {meQuery.data?.profile?.nickname ?? "Semillero"}
        </h1>
        <p className="text-[#123b2c]/50 text-sm mt-1">Continúa creciendo en la Palabra</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 bg-[#f4b740]/10 rounded-xl flex items-center justify-center mb-2">
            <Zap className="text-[#f4b740]" size={20} />
          </div>
          <p className="text-2xl font-bold text-[#123b2c]">{level?.xp_total ?? 0}</p>
          <p className="text-xs text-[#123b2c]/40">XP total</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 bg-[#2e9e5b]/10 rounded-xl flex items-center justify-center mb-2">
            <TrendingUp className="text-[#2e9e5b]" size={20} />
          </div>
          <p className="text-2xl font-bold text-[#123b2c]">{level?.level_number ?? 1}</p>
          <p className="text-xs text-[#123b2c]/40">{level?.level_name ?? "Brote"}</p>
        </div>
      </div>

      <Link
        to="/app/sendas"
        className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#2e9e5b]/10 rounded-xl flex items-center justify-center">
            <Compass className="text-[#2e9e5b]" size={24} />
          </div>
          <div>
            <strong className="text-[#123b2c] text-base">Explorar sendas</strong>
            <p className="text-xs text-[#123b2c]/40">Descubre temas bíblicos</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
