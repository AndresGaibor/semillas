import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAgeGroups } from "../features/catalog/catalog.api";
import { updateProfile } from "../features/profile/profile.api";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage
});

function OnboardingPage() {
  const navigate = useNavigate();

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: getAgeGroups
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess() {
      navigate({ to: "/app" });
    }
  });

  return (
    <main style={{ padding: 32 }}>
      <h1>Elige tu franja de edad</h1>

      {ageGroupsQuery.isLoading && <p>Cargando franjas...</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {ageGroupsQuery.data?.map((ageGroup) => (
          <button
            key={ageGroup.id}
            onClick={() =>
              updateProfileMutation.mutate({
                ageGroupId: ageGroup.id
              })
            }
          >
            <strong>{ageGroup.name}</strong>
            <br />
            {ageGroup.min_age} a {ageGroup.max_age} años
          </button>
        ))}
      </div>
    </main>
  );
}
