import { createFileRoute } from "@tanstack/react-router";
import { PanelAdministracion } from "../components/admin/PanelAdministracion";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage
});

function AdminDashboardPage() {
  return <PanelAdministracion />;
}
