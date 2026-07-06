import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Users, Sparkles, BookOpen } from "lucide-react";
import { getAgeGroups } from "../features/catalog/catalog.api";
import { updateProfile } from "../features/profile/profile.api";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage
});

const icons: Record<string, React.ReactNode> = {
  semillas: <Sparkles size={28} />,
  exploradores: <BookOpen size={28} />,
  embajadores: <Users size={28} />
};

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
    <div className="min-h-screen bg-[#f7f4ec] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg text-center mb-8">
        <h1 className="text-2xl font-bold text-[#123b2c] mb-2">¿Quién eres?</h1>
        <p className="text-[#123b2c]/60">Elige tu franja de edad para personalizar tu experiencia</p>
      </div>

      <div className="w-full max-w-lg grid gap-4">
        {ageGroupsQuery.isLoading && (
          <p className="text-center text-[#123b2c]/40">Cargando franjas...</p>
        )}

        {ageGroupsQuery.data?.map((ageGroup) => (
          <button
            key={ageGroup.id}
            onClick={() => updateProfileMutation.mutate({ ageGroupId: ageGroup.id })}
            disabled={updateProfileMutation.isPending}
            className="w-full bg-white rounded-2xl p-5 text-left flex items-center gap-4 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-[#2e9e5b]/20 disabled:opacity-50"
          >
            <div className="w-14 h-14 bg-[#2e9e5b]/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-[#2e9e5b]">{icons[ageGroup.code] ?? <Users size={28} />}</span>
            </div>
            <div>
              <strong className="text-lg text-[#123b2c]">{ageGroup.name}</strong>
              <p className="text-sm text-[#123b2c]/50">{ageGroup.min_age} a {ageGroup.max_age} años</p>
              <p className="text-xs text-[#123b2c]/40 mt-0.5">{ageGroup.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
