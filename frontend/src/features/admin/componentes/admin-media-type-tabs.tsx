export type TipoMedia = "imagen" | "audio" | "video" | "documento";

type Props = {
  activeTab: TipoMedia;
  onTabChange: (tab: TipoMedia) => void;
};

export function AdminMediaTypeTabs({ activeTab, onTabChange }: Props) {
  const tabs: { id: TipoMedia; label: string; icon: string; activeBg: string; activeText: string }[] = [
    { id: "imagen", label: "Imágenes", icon: "fa-solid fa-image", activeBg: "bg-[#eefcf4]", activeText: "text-[#2e9e5b]" },
    { id: "audio", label: "Audio", icon: "fa-solid fa-volume-high", activeBg: "bg-[#6c3aed]/10", activeText: "text-[#6c3aed]" },
    { id: "video", label: "Video", icon: "fa-solid fa-circle-play", activeBg: "bg-[#ee6c4d]/10", activeText: "text-[#ee6c4d]" },
    { id: "documento", label: "Documentos", icon: "fa-solid fa-file-lines", activeBg: "bg-[#17a398]/10", activeText: "text-[#17a398]" },
  ];

  return (
    <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm max-w-max select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? `${tab.activeBg} ${tab.activeText}`
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <i className={tab.icon} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
