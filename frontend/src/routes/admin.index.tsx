import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { obtenerResumenAdmin } from "../features/admin/admin.api";
import { Loader } from "lucide-react";

import { AdminStatsGrid } from "../features/admin/componentes/admin-stats-grid";
import { ContentStatusGrid } from "../features/admin/componentes/content-status-grid";
import { QuickActionsGrid } from "../features/admin/componentes/quick-actions-grid";
import { RecentThemesTable } from "../features/admin/componentes/recent-themes-table";
import { RecentActivitySidebar } from "../features/admin/componentes/recent-activity-sidebar";
import { UpcomingReviewsList } from "../features/admin/componentes/upcoming-reviews-list";
import { WeeklyProgressChart } from "../features/admin/componentes/weekly-progress-chart";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage
});

function AdminDashboardPage() {
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["admin", "dashboard"], queryFn: obtenerResumenAdmin });

  const temasPublicados = query.data?.publicados ?? 128;
  const usuariosActivos = query.data?.usuarios ?? 2845;
  const actividadesCreadas = query.data?.actividades ?? 362;
  const clubesActivos = 156; // Fallback valor maqueta

  // Temas recientes (con datos reales o mock del diseño)
  const temasRecientes = [
    {
      id: "1",
      titulo: "La creación del mundo",
      senda: "Dios el Padre",
      estado: "Publicado",
      editorNombre: "María López",
      editorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maria",
      fechaEdicion: "Hoy, 10:30",
    },
    {
      id: "2",
      titulo: "La oración y la fe",
      senda: "Jesucristo el Hijo",
      estado: "En revisión",
      editorNombre: "Juan Pérez",
      editorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Juan",
      fechaEdicion: "Ayer, 16:45",
    },
    {
      id: "3",
      titulo: "Frutos del Espíritu",
      senda: "Espíritu Santo",
      estado: "Borrador",
      editorNombre: "Ana Torres",
      editorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana",
      fechaEdicion: "05 Jul, 09:20",
    },
    {
      id: "4",
      titulo: "El Buen Samaritano",
      senda: "Jesucristo el Hijo",
      estado: "Publicado",
      editorNombre: "Luis García",
      editorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Luis",
      fechaEdicion: "04 Jul, 11:05",
    },
    {
      id: "5",
      titulo: "Daniel en el foso",
      senda: "Dios el Padre",
      estado: "Publicado",
      editorNombre: "María López",
      editorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maria",
      fechaEdicion: "03 Jul, 08:50",
    },
  ];

  // Actividades recientes del panel derecho
  const actividadesRecientes = [
    {
      id: "1",
      texto: 'Se publicó el tema "La creación del mundo" en la senda "Dios el Padre".',
      haceCuanto: "Hace 15 min",
      tipo: "tema",
    },
    {
      id: "2",
      texto: 'María López creó una nueva actividad "Cuestionario de Génesis".',
      haceCuanto: "Hace 1 h",
      tipo: "actividad",
    },
    {
      id: "3",
      texto: 'El Club "Valientes de la Fe" agregó 5 nuevos miembros.',
      haceCuanto: "Hace 3 h",
      tipo: "club",
    },
    {
      id: "4",
      texto: 'Se subió un nuevo recurso multimedia "Audio: Canto Semillita".',
      haceCuanto: "Hace 5 h",
      tipo: "recurso",
    },
    {
      id: "5",
      texto: 'Juan Pérez aprobó el tema "La oración y la fe" para revisión.',
      haceCuanto: "Hace 1 día",
      tipo: "aprobacion",
    },
  ];

  // Próximas revisiones del panel derecho
  const revisionesProximas = [
    {
      id: "1",
      dia: "16",
      mes: "JUL",
      titulo: "La fe de Abraham",
      senda: "Dios el Padre",
      estado: "En revisión",
      reviewerNombre: "Ana Torres",
      reviewerAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana",
    },
    {
      id: "2",
      dia: "17",
      mes: "JUL",
      titulo: "Aprendiendo a perdonar",
      senda: "Jesucristo el Hijo",
      estado: "En revisión",
      reviewerNombre: "Juan Pérez",
      reviewerAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Juan",
    },
    {
      id: "3",
      dia: "18",
      mes: "JUL",
      titulo: "Dios cuida de mí",
      senda: "Dios el Padre",
      estado: "Borrador",
      reviewerNombre: "María López",
      reviewerAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maria",
    },
  ];

  // Datos del progreso semanal (gráfico de barras)
  const progresoDatos = [
    { dia: "Lun", valor: 12 },
    { dia: "Mar", valor: 18 },
    { dia: "Mié", valor: 24 },
    { dia: "Jue", valor: 20 },
    { dia: "Vie", valor: 16 },
    { dia: "Sáb", valor: 14 },
    { dia: "Dom", valor: 10 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {query.isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="text-xs text-neutro ml-2">Cargando estadísticas reales...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3 width) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Top 4 Stats Grid */}
          <AdminStatsGrid
            temasPublicados={temasPublicados}
            usuariosActivos={usuariosActivos}
            actividadesCreadas={actividadesCreadas}
            clubesActivos={clubesActivos}
          />

          {/* Content Status */}
          <ContentStatusGrid
            borradores={42}
            enRevision={18}
            publicados={temasPublicados}
            archivados={14}
            onVerTodo={() => navigate({ to: "/admin/temas" })}
          />

          {/* Quick Actions */}
          <QuickActionsGrid
            onCrearTema={() => navigate({ to: "/admin/temas/new" })}
            onAgregarActividad={() => navigate({ to: "/admin/temas" })}
            onSubirRecurso={() => navigate({ to: "/admin/temas" })}
            onRevisarContenido={() => navigate({ to: "/admin/temas" })}
          />

          {/* Recent Themes Table */}
          <RecentThemesTable
            temas={temasRecientes}
            onVerTodos={() => navigate({ to: "/admin/temas" })}
            onEditarTema={(id) => navigate({ to: `/admin/temas` })}
          />
        </div>

        {/* Right Column (1/3 width) - Sidebar Panel */}
        <div className="flex flex-col gap-6">
          {/* Recent Activity */}
          <RecentActivitySidebar
            actividades={actividadesRecientes}
            onVerTodaLaActividad={() => navigate({ to: "/admin/temas" })}
          />

          {/* Upcoming Reviews */}
          <UpcomingReviewsList
            revisiones={revisionesProximas}
            onVerTodas={() => navigate({ to: "/admin/temas" })}
            onSelectReview={() => navigate({ to: "/admin/temas" })}
          />

          {/* Weekly Progress Chart */}
          <WeeklyProgressChart
            datos={progresoDatos}
            onPeriodoChange={(p) => console.log("Periodo seleccionado:", p)}
          />
        </div>
      </div>
    </div>
  );
}
