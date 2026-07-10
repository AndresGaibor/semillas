import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { StoryRouter } from "./story-router";
import { VersiculoDelDia } from "@/features/home/componentes/versiculo-del-dia";
import { PathsGrid } from "@/features/home/componentes/paths-grid";
import { RachaWidget } from "@/features/home/componentes/racha-widget";
import { InsigniasWidget } from "@/features/home/componentes/insignias-widget";
import in1Img from "@/assets/images/Ilustraciones/in1.png";
import in2Img from "@/assets/images/Ilustraciones/in2.png";
import senderoPadreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import senderoHijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import senderoEspirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";

const mockQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

mockQueryClient.setQueryData(["me"], {
  id: "user-1",
  apodo: "Luz",
  franja: "exploradores",
  rol: "usuario",
});

mockQueryClient.setQueryData(["gamification", "me"], {
  xp_total: 2480,
  nivel: 5,
  racha_dias: 12,
  logros: [
    { logro_id: "logro-1", logro: { id: "logro-1", codigo: "primera_leccion", nombre: "Primera Lección", descripcion: "Completaste tu primera lección" } },
    { logro_id: "logro-2", logro: { id: "logro-2", codigo: "racha_7", nombre: "Racha de 7 días", descripcion: "7 días consecutivos" } },
  ],
});

function AppHomeStory() {
  return (
    <StoryRouter initialPath="/app" client={mockQueryClient}>
      <div className="p-4 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="dashboard-banner">
          <img src="https://picsum.photos/800/250" alt="Banner" className="w-full max-h-[250px] rounded-2xl object-cover" />
        </div>
        <VersiculoDelDia texto="Todo lo puedo en Cristo que me fortalece." referencia="Filipenses 4:13" />
        <PathsGrid senderoPadreImg={senderoPadreImg} senderoHijoImg={senderoHijoImg} senderoEspirituImg={senderoEspirituImg} />
        <RachaWidget diasRacha={12} />
        <InsigniasWidget insignias={[
          { id: "logro-1", nombre: "Primera Lección", imagenUrl: in1Img },
          { id: "logro-2", nombre: "Racha de 7 días", imagenUrl: in2Img },
        ]} />
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
