import { TabsOpciones } from "@/componentes/ui/tabs-opciones";

export type TipoMedia = "" | "imagen" | "audio" | "video" | "documento";

type Props = {
  activeTab: TipoMedia;
  onTabChange: (tab: TipoMedia) => void;
};

const tabs: { id: TipoMedia; label: string; icon: string; badgeClassName: string }[] = [
  { id: "imagen", label: "Imágenes", icon: "fa-solid fa-image", badgeClassName: "bg-emerald-900/30 text-green-400" },
  { id: "audio", label: "Audio", icon: "fa-solid fa-volume-high", badgeClassName: "bg-violet-900/30 text-violet-400" },
  { id: "video", label: "Video", icon: "fa-solid fa-circle-play", badgeClassName: "bg-rose-900/30 text-rose-400" },
  { id: "documento", label: "Documentos", icon: "fa-solid fa-file-lines", badgeClassName: "bg-teal-900/30 text-teal-400" },
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
