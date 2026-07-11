import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryRouter } from "@/storybook/story-router";
import { VersiculoDelDia } from "@/features/home/componentes/versiculo-del-dia";
import { PathsGrid } from "@/features/home/componentes/paths-grid";
import { RachaWidget } from "@/features/home/componentes/racha-widget";
import { InsigniasWidget } from "@/features/home/componentes/insignias-widget";

const BASE = "https://picsum.photos/seed/semillas/800/250";

function AppHomeStory() {
  return (
    <StoryRouter initialPath="/app">
      <div className="p-4 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="dashboard-banner">
          <img src="https://picsum.photos/seed/semillasbanner/800/250" alt="Banner" className="w-full max-h-[250px] rounded-2xl object-cover" />
        </div>
        <VersiculoDelDia texto="Todo lo puedo en Cristo que me fortalece." referencia="Filipenses 4:13" />
        <PathsGrid
          senderoPadreImg="https://picsum.photos/seed/padre/400/200"
          senderoHijoImg="https://picsum.photos/seed/hijo/400/200"
          senderoEspirituImg="https://picsum.photos/seed/espiritu/400/200"
        />
        <RachaWidget diasRacha={12} />
        <InsigniasWidget insignias={[]} />
      </div>
    </StoryRouter>
  );
}

const meta = {
  title: "Pantallas/App/Home",
  component: AppHomeStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppHomeStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Escritorio: Story = {};
export const MovilApp: Story = { globals: { viewport: { value: "movilApp", isRotated: false } } };
