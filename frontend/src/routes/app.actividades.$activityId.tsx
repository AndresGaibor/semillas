import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { randomUUID } from "../shared/utils/uuid";
import { answerActivity, getActivity } from "../features/activities/activities.api";
import { queryClient } from "../app/query-client";
import { Loader, Check, X, ArrowLeft, Zap } from "lucide-react";

export const Route = createFileRoute("/app/actividades/$activityId")({
  component: ActivityPage
});

function ActivityPage() {
  const { activityId } = Route.useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const activityQuery = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => getActivity(activityId)
  });

  const answerMutation = useMutation({
    mutationFn: (selectedOptionId: string) =>
      answerActivity(activityId, {
        evento_id_cliente: randomUUID(),
        opcion_id_seleccionada: selectedOptionId,
        ocurrido_en_cliente: new Date().toISOString(),
        dispositivo_id: "web"
      }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["gamification", "me"] });
    }
  });

  const activity = activityQuery.data;
  const result = answerMutation.data;

  if (activityQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin text-[#2e9e5b]" size={24} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate({ to: "/app" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-[#f4b740]" size={18} />
          <span className="text-sm font-medium text-[#f4b740]">{activity?.xp_recompensa} XP</span>
        </div>

        <h1 className="text-xl font-bold text-[#123b2c] mb-2">{activity?.titulo}</h1>
        <p className="text-[#123b2c]/70 mb-6">{activity?.consigna}</p>

        <div className="grid gap-2">
          {activity?.opciones?.map((option) => {
            const isSelected = selected === option.id;
            const isAnswered = !!result;
            const isCorrectOption = option.correcta;

            let bg = "bg-[#f7f4ec] hover:bg-[#e8e5dd]";
            if (isAnswered && isCorrectOption) bg = "bg-[#2e9e5b]/10 border-[#2e9e5b]";
            else if (isAnswered && isSelected && !isCorrectOption) bg = "bg-[#ee6c4d]/10 border-[#ee6c4d]";
            else if (isSelected) bg = "bg-[#2e9e5b]/10 border-[#2e9e5b]";

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (!result) {
                    setSelected(option.id);
                    answerMutation.mutate(option.id);
                  }
                }}
                disabled={!!result}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bg} ${
                  isAnswered && isCorrectOption ? "border-[#2e9e5b]" : ""
                } ${isAnswered && isSelected && !isCorrectOption ? "border-[#ee6c4d]" : ""} ${
                  isSelected && !isAnswered ? "border-[#2e9e5b]" : "border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm shrink-0">
                    {option.etiqueta}
                  </span>
                  <span className="flex-1 text-[#123b2c]">{option.texto}</span>
                  {isAnswered && isCorrectOption && <Check className="text-[#2e9e5b]" size={20} />}
                  {isAnswered && isSelected && !isCorrectOption && <X className="text-[#ee6c4d]" size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-xl ${result.resultado.correcta ? "bg-[#2e9e5b]/10" : "bg-[#ee6c4d]/10"}`}>
            <div className="flex items-center gap-2 mb-1">
              {result.resultado.correcta ? (
                <Check className="text-[#2e9e5b]" size={20} />
              ) : (
                <X className="text-[#ee6c4d]" size={20} />
              )}
              <strong className={result.resultado.correcta ? "text-[#2e9e5b]" : "text-[#ee6c4d]"}>
                {result.resultado.correcta ? "¡Correcto!" : "Intenta de nuevo"}
              </strong>
            </div>
            <p className="text-sm text-[#123b2c]/60">
              {result.resultado.correcta ? `Ganaste ${result.resultado.xp_otorgada} XP` : "Sigue practicando"}
            </p>
          </div>
        )}

        {result && (
          <button
            onClick={() => navigate({ to: "/app" })}
            className="w-full mt-4 bg-[#2e9e5b] text-white py-3 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors"
          >
            Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
}
