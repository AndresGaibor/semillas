import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../features/admin/admin.api";
import { BookOpen, Users, Gamepad2, CheckCircle, Loader } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage
});

function AdminDashboardPage() {
  const query = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getAdminDashboard });

  const stats = [
    { label: "Temas", value: query.data?.themes ?? 0, icon: BookOpen, color: "#2e9e5b" },
    { label: "Publicados", value: query.data?.published ?? 0, icon: CheckCircle, color: "#17a398" },
    { label: "Usuarios", value: query.data?.users ?? 0, icon: Users, color: "#3d8bd4" },
    { label: "Actividades", value: query.data?.activities ?? 0, icon: Gamepad2, color: "#f4b740" }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#123b2c] mb-6">Dashboard</h1>

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-[#2e9e5b]" size={24} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${stat.color}15` }}
              >
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-[#123b2c]">{stat.value}</p>
              <p className="text-xs text-[#123b2c]/40">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="font-bold text-[#123b2c] mb-3">Acciones rápidas</h2>
        <div className="grid gap-2">
          <Link
            to="/admin/temas/new"
            className="block p-3 bg-[#2e9e5b]/5 rounded-xl text-[#2e9e5b] font-medium text-sm hover:bg-[#2e9e5b]/10 transition-colors"
          >
            + Crear nuevo tema
          </Link>
          <Link
            to="/admin/temas"
            className="block p-3 bg-[#3d8bd4]/5 rounded-xl text-[#3d8bd4] font-medium text-sm hover:bg-[#3d8bd4]/10 transition-colors"
          >
            Gestionar temas
          </Link>
        </div>
      </div>
    </div>
  );
}
