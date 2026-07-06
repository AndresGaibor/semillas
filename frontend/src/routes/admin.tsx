import { Link, Outlet, createFileRoute, redirect, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, Plus, ArrowLeft, Leaf } from "lucide-react";
import { hasSession } from "../shared/api/auth-guard";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!hasSession()) throw redirect({ to: "/login" });
  },
  component: AdminLayout
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/temas", label: "Temas", icon: BookOpen },
  { to: "/admin/temas/new", label: "Nuevo tema", icon: Plus }
];

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f4ec] flex">
      <aside className="w-60 bg-[#0f2a20] text-white shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Leaf size={20} />
            <span className="font-bold">Semillas Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 grid gap-1">
          {navItems.map((item) => {
            const isActive = item.to === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as "/admin" | "/admin/temas" | "/admin/temas/new"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-white/10 font-semibold" : "hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link to="/app" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
            <ArrowLeft size={16} />
            Volver a la app
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white px-5 py-3 flex items-center gap-3 shadow-sm md:hidden">
          <Link to="/admin" className="text-[#2e9e5b]">
            <Leaf size={20} />
          </Link>
          <span className="font-bold text-[#123b2c]">Admin</span>
          <div className="flex-1" />
          <Link to="/app" className="text-xs text-[#123b2c]/40">App</Link>
        </header>

        <div className="md:hidden flex gap-1 px-2 py-2 bg-white border-b border-[#e5e7eb] overflow-x-auto">
          {navItems.map((item) => {
            const isActive = item.to === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as "/admin" | "/admin/temas" | "/admin/temas/new"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  isActive ? "bg-[#2e9e5b] text-white" : "text-[#123b2c]/60 hover:bg-[#f7f4ec]"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
