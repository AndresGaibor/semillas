import { createFileRoute } from "@tanstack/react-router";
import { AdminClubesPanel } from "../features/admin/componentes/admin-clubes-panel";

export const Route = createFileRoute("/admin/clubes")({
  component: AdminClubesPage,
});

function AdminClubesPage() {
  return <AdminClubesPanel />;
}
