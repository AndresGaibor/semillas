import { Coins, GraduationCap, Trophy, BookOpen } from "lucide-react";
import { MetricCard } from "@/features/perfil/componentes/MetricCard";
import type { GamificacionMiRespuesta, ProgresoMiRespuesta } from "../profile.api";

interface SeccionMetricasProps {
  gamificacion: GamificacionMiRespuesta | undefined;
  progreso: ProgresoMiRespuesta | undefined;
  completados: { actividades: number; temas: number };
}

export function SeccionMetricas({
  gamificacion,
  progreso,
  completados,
}: SeccionMetricasProps) {
  const nivel = gamificacion?.nivel;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={Coins} label="XP total" value={nivel?.xp_total ?? 0} accent="text-[#2E9E5B]" />
      <MetricCard icon={GraduationCap} label="Nivel" value={nivel ? `${nivel.numero_nivel}` : "—"} helper={nivel?.nombre_nivel ?? "Sin nivel"} accent="text-[#E9A23B]" />
      <MetricCard icon={Trophy} label="Logros" value={0} accent="text-[#EE6C4D]" />
      <MetricCard icon={BookOpen} label="Temas completados" value={completados.temas} accent="text-[#17A398]" />
    </section>
  );
}
