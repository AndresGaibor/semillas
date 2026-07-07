import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#123B2C]">
      <Outlet />
    </div>
  );
}
