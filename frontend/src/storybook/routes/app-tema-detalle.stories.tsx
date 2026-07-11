import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryRouter } from "@/storybook/story-router";
import { Link } from "@tanstack/react-router";

function TemaDetalleStory() {
  return (
    <StoryRouter initialPath="/app/temas/tema-amor">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
            <img src="https://picsum.photos/seed/tema-amor/600/300" alt="Tema" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">PADRE</span>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">Exploradores</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">El Amor de Dios</h1>
          <p className="text-slate-500 text-sm mb-4">Juan 3:16 — Para Dios amó tanto al mundo...</p>
          <div className="flex gap-4 mb-6 text-sm text-slate-600">
            <span>⏱ 20 min</span>
            <span>⭐ 150 XP</span>
            <span>📊 66%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: "66%" }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["C", "R", "E", "C", "E", "R"].map((letra, i) => (
              <button key={i} className="bg-slate-50 border border-slate-200 rounded-xl py-4 text-center font-black text-lg hover:bg-slate-100">
                {letra}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StoryRouter>
  );
}

const meta = {
  title: "Pantallas/App/TemaDetalle",
  component: TemaDetalleStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TemaDetalleStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Escritorio: Story = {};
export const MovilApp: Story = { globals: { viewport: { value: "movilApp", isRotated: false } } };
