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
        { id: "borrador", label: "Borradores", count: counts.borradores, badgeClassName: "bg-[#f4b740]/15 text-[#d9921c] font-bold" },
        { id: "revision", label: "En revisión", count: counts.revision, badgeClassName: "bg-[#6c3aed]/10 text-[#6c3aed] font-bold" },
        { id: "publicado", label: "Publicados", count: counts.publicados, badgeClassName: "bg-[#2e9e5b]/10 text-[#2e9e5b] font-bold" },
      ]}
      clase="mb-6"
    />
  );
}
