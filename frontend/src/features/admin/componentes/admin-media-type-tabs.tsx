import { TabsOpciones } from "@/componentes/ui/tabs-opciones";

export type TipoMedia = "" | "imagen" | "audio" | "video" | "documento";

type Props = {
  activeTab: TipoMedia;
  onTabChange: (tab: TipoMedia) => void;
};

const tabs: { id: TipoMedia; label: string; icon: string; badgeClassName: string }[] = [
  { id: "imagen", label: "Imágenes", icon: "fa-solid fa-image", badgeClassName: "bg-green-50 text-green-600" },
  { id: "audio", label: "Audio", icon: "fa-solid fa-volume-high", badgeClassName: "bg-violet-100 text-violet-600" },
  { id: "video", label: "Video", icon: "fa-solid fa-circle-play", badgeClassName: "bg-red-50 text-red-500" },
  { id: "documento", label: "Documentos", icon: "fa-solid fa-file-lines", badgeClassName: "bg-teal-50 text-teal-600" },
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
