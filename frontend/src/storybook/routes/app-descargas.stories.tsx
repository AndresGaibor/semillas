import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryRouter } from "@/storybook/story-router";
import { DescargasTabsFilter } from "@/features/descargas/componentes/descargas-tabs-filter";
import { RecursoCard } from "@/features/descargas/componentes/recurso-card";
import { StorageWidget } from "@/features/descargas/componentes/storage-widget";
import { useState } from "react";

const recursosMock = [
  { id: "r1", titulo: "La Creación", tipo: "video" as const, edad: "5-8", sizeMB: 45, descripcion: "Video animado sobre la creación", imagen: "https://picsum.photos/200/120?random=1" },
  { id: "r2", titulo: "Salmos para Niños", tipo: "audio" as const, edad: "9-12", sizeMB: 12, descripcion: "Audios de salmos narrados", imagen: "https://picsum.photos/200/120?random=2" },
  { id: "r3", titulo: "Colorear la Biblia", tipo: "pdf" as const, edad: "5-8", sizeMB: 5, descripcion: "Hojas para colorear", imagen: "https://picsum.photos/200/120?random=3" },
  { id: "r4", titulo: "Lecciones del Padre", tipo: "tema" as const, edad: "9-12", sizeMB: 120, descripcion: "Tema completo sobre el Padre", imagen: "https://picsum.photos/200/120?random=4" },
];

function DescargasPageStory() {
  const [activeTab, setActiveTab] = useState<"todos" | "videos" | "audios" | "pdfs">("todos");
  const [downloadedIds, setDownloadedIds] = useState<string[]>(["r1"]);

  return (
    <StoryRouter initialPath="/app/descargas">
      <div className="w-full flex flex-col font-sans text-slate-800 text-left p-4 max-w-5xl mx-auto">
        <DescargasTabsFilter
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ageFilter="todos"
          onAgeChange={() => {}}
          sortOrder="recientes"
          onSortChange={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8 mt-4">
          {recursosMock.map((recurso) => (
            <RecursoCard
              key={recurso.id}
              id={recurso.id}
              titulo={recurso.titulo}
              tipo={recurso.tipo}
              edad={recurso.edad}
              sizeMB={recurso.sizeMB}
              descripcion={recurso.descripcion}
              imagen={recurso.imagen}
              isDownloaded={downloadedIds.includes(recurso.id)}
              progress={undefined}
              onDownload={() => setDownloadedIds(prev => [...prev, recurso.id])}
              onDelete={() => setDownloadedIds(prev => prev.filter(id => id !== recurso.id))}
            />
          ))}
        </div>
        <StorageWidget usedMB={177} totalMB={500} percentage={35} onGestionarClick={() => {}} />
      </div>
    </StoryRouter>
  );
}

const meta = {
  title: "Pantallas/App/Descargas",
  component: DescargasPageStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DescargasPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Escritorio: Story = {};
export const MovilApp: Story = { globals: { viewport: { value: "movilApp", isRotated: false } } };
