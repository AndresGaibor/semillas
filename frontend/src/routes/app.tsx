import { Link, Outlet, createFileRoute, redirect, useLocation } from "@tanstack/react-router";
import { Home, Compass, Trophy, User, Leaf } from "lucide-react";
import { hasSession } from "../shared/api/auth-guard";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!hasSession()) throw redirect({ to: "/login" });
  },
  component: AppLayout
});

const navItems = [
  { to: "/app", label: "Inicio", icon: Home },
  { to: "/app/sendas", label: "Sendas", icon: Compass },
  { to: "/app/logros", label: "Logros", icon: Trophy },
  { to: "/app/perfil", label: "Perfil", icon: User }
];

function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f4ec] flex flex-col">
      <header className="bg-white px-5 py-4 flex items-center gap-2 shadow-sm sticky top-0 z-10">
        <Leaf className="text-[#2e9e5b]" size={22} />
        <span className="font-bold text-[#123b2c] text-lg">Semillas</span>
      </header>

      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>

      <nav className="bg-white border-t border-[#e5e7eb] flex justify-around py-2 sticky bottom-0 z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/app" && location.pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as "/app" | "/app/sendas" | "/app/logros" | "/app/perfil"}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${
                isActive ? "text-[#2e9e5b]" : "text-[#123b2c]/40"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
