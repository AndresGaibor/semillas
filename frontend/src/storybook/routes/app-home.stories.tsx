import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryRouter } from "@/storybook/story-router";
import { InicioHero } from "@/features/home/componentes/inicio-hero";
import { ResumenProgreso } from "@/features/home/componentes/resumen-progreso";
import { PathsGrid } from "@/features/home/componentes/paths-grid";
import { ProximoObjetivoWidget } from "@/features/home/componentes/proximo-objetivo-widget";
import { VersiculoDelDia } from "@/features/home/componentes/versiculo-del-dia";

function AppHomeStory() {
  return (
    <StoryRouter initialPath="/app">
      <div className="app-home p-4 md:p-0">
        <InicioHero imagenUrl="/storybook/fixtures/cover.svg" nombreUsuario="Andres" />
        <ResumenProgreso xpTotal={1240} numeroNivel={7} nombreNivel="Explorador" totalInsignias={3} />
        <div className="app-home__dashboard">
          <div className="app-home__primary">
            <PathsGrid
              sendaPadreImg="/storybook/fixtures/cover.svg"
              sendaHijoImg="/storybook/fixtures/cover.svg"
              sendaEspirituImg="/storybook/fixtures/cover.svg"
            />
          </div>
          <aside className="app-home__aside">
            <VersiculoDelDia texto="Todo lo puedo en Cristo que me fortalece." referencia="Filipenses 4:13" />
            <ProximoObjetivoWidget xpTotal={1240} totalInsignias={3} />
          </aside>
        </div>
      </div>
    </StoryRouter>
  );
}

const meta = {
  title: "05 · Pantallas/App/Home",
  component: AppHomeStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppHomeStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Escritorio: Story = {};
export const MovilApp: Story = { globals: { viewport: { value: "movilApp", isRotated: false } } };
