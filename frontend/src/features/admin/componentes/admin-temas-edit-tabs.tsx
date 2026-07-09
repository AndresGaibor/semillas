type EditTab = "general" | "portada" | "config" | "publicacion";

type AdminTemasEditTabsProps = {
  activeTab: EditTab;
  onTabChange: (tab: EditTab) => void;
};

const tabs: { id: EditTab; label: string; icon: string }[] = [
  { id: "general", label: "Información general", icon: "fa-solid fa-file-invoice" },
  { id: "portada", label: "Portada", icon: "fa-regular fa-image" },
  { id: "config", label: "Configuración", icon: "fa-solid fa-sliders" },
  { id: "publicacion", label: "Publicación", icon: "fa-solid fa-paper-plane" },
];

export function AdminTemasEditTabs({ activeTab, onTabChange }: AdminTemasEditTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-slate-100 px-2 select-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
            activeTab === tab.id
              ? "border-[#2e9e5b] text-[#2e9e5b]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <i className={`${tab.icon} mr-2 text-[10px]`} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
