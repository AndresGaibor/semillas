import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { randomUUID } from "../shared/utils/uuid";
import { answerActivity, getActivity } from "../features/activities/activities.api";
import { queryClient } from "../app/query-client";

export const Route = createFileRoute("/app/actividades/$activityId")({
  component: ActivityPage
});

function ActivityPage() {
  const { activityId } = Route.useParams();
  const navigate = useNavigate();

  const activityQuery = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => getActivity(activityId)
  });

  const answerMutation = useMutation({
    mutationFn: (selectedOptionId: string) =>
      answerActivity(activityId, {
        clientEventId: randomUUID(),
        selectedOptionId,
        occurredAtClient: new Date().toISOString(),
        deviceId: "web"
      }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["gamification", "me"] });
    }
  });

  return (
    <main>
      <h1>{activityQuery.data?.title}</h1>
      <p>{activityQuery.data?.prompt}</p>

      <section style={{ display: "grid", gap: 12 }}>
        {activityQuery.data?.options?.map((option) => (
          <button
            key={option.id}
            onClick={() => answerMutation.mutate(option.id)}
          >
            {option.label}. {option.text}
          </button>
        ))}
      </section>

      {answerMutation.data && (
        <section>
          <h2>
            {answerMutation.data.result.isCorrect ? "¡Correcto!" : "Intenta otra vez"}
          </h2>
          <p>Ganaste {answerMutation.data.result.xpAwarded} XP</p>
          <button onClick={() => navigate({ to: "/app" })}>Volver al inicio</button>
        </section>
      )}
    </main>
  );
}
