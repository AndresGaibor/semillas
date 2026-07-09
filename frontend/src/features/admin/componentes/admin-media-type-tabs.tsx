import { TabsOpciones } from "@/componentes/ui/tabs-opciones";

export type TipoMedia = "" | "imagen" | "audio" | "video" | "documento";

type Props = {
  activeTab: TipoMedia;
  onTabChange: (tab: TipoMedia) => void;
};

const tabs: { id: TipoMedia; label: string; icon: string; badgeClassName: string }[] = [
  { id: "imagen", label: "Imágenes", icon: "fa-solid fa-image", badgeClassName: "bg-[#eefcf4] text-[#2e9e5b]" },
  { id: "audio", label: "Audio", icon: "fa-solid fa-volume-high", badgeClassName: "bg-[#6c3aed]/10 text-[#6c3aed]" },
  { id: "video", label: "Video", icon: "fa-solid fa-circle-play", badgeClassName: "bg-[#ee6c4d]/10 text-[#ee6c4d]" },
  { id: "documento", label: "Documentos", icon: "fa-solid fa-file-lines", badgeClassName: "bg-[#17a398]/10 text-[#17a398]" },
];

export function AdminMediaTypeTabs({ activeTab, onTabChange }: Props) {
  return (
    <TabsOpciones
      opciones={tabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        icono: <i className={tab.icon} />,
        badgeClassName: tab.badgeClassName,
      }))}
      activo={activeTab}
      onCambiar={(id) => onTabChange(id as TipoMedia)}
      variante="pildora"
      clase="max-w-max"
    />
  );
}
