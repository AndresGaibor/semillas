import { TabsOpciones } from "@/componentes/ui/navegacion-tabs";

type TabCounts = {
  todos: number;
  borradores: number;
  revision: number;
  publicados: number;
};

type AdminThemesTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: TabCounts;
};

export function AdminThemesTabs({ activeTab, onTabChange, counts }: AdminThemesTabsProps) {
  return (
    <TabsOpciones
      activo={activeTab}
      onCambiar={onTabChange}
      opciones={[
        { id: "todos", label: "Todos", count: counts.todos, badgeClassName: "bg-slate-100 text-slate-700", mostrarBadge: true },
        { id: "borrador", label: "Borradores", count: counts.borradores, badgeClassName: "bg-amber-100 text-amber-700 font-bold" },
        { id: "revision", label: "En revisión", count: counts.revision, badgeClassName: "bg-violet-100 text-violet-600 font-bold" },
        { id: "publicado", label: "Publicados", count: counts.publicados, badgeClassName: "bg-green-100 text-green-600 font-bold" },
      ]}
      clase="mb-6"
    />
  );
}
