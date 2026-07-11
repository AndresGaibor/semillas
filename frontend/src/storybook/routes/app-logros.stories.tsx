import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryRouter } from "@/storybook/story-router";
import { LogrosTabsFilter } from "@/features/gamification/componentes/logros-tabs-filter";
import { InsigniaCardItem } from "@/features/gamification/componentes/insignia-card-item";
import { ProgresoXpWidget } from "@/features/gamification/componentes/progreso-xp-widget";
import in1Img from "@/assets/images/Ilustraciones/in1.png";
import in2Img from "@/assets/images/Ilustraciones/in2.png";
import { useState } from "react";

const insigniasMock = [
  { codigo: "primera_leccion", nombre: "Primera Lección", descripcion: "Completaste tu primera lección", criterio: "Completar 1 tema", bono_xp: 50, obtenido: true },
  { codigo: "racha_7", nombre: "Racha de 7 días", descripcion: "7 días consecutivos de estudio", criterio: "7 días seguidos", bono_xp: 100, obtenido: true },
  { codigo: "primera_insignia", nombre: "Primer Logro", descripcion: "Obtuviste tu primera insignia", criterio: "1 insignia", bono_xp: 25, obtenido: false },
  { codigo: "estrella_fugaz", nombre: "Estrella Fugaz", descripcion: "Completa un tema de una sentada", criterio: "1 tema completo", bono_xp: 75, obtenido: false },
];

function LogrosPageStory() {
  const [tab, setTab] = useState<"todos" | "obtenidas" | "bloqueadas">("todos");
  const filtered = tab === "obtenidas" ? insigniasMock.filter(i => i.obtenido) : tab === "bloqueadas" ? insigniasMock.filter(i => !i.obtenido) : insigniasMock;

  return (
    <StoryRouter initialPath="/app/logros">
      <div className="w-full flex flex-col font-sans text-slate-800 text-left p-4 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
          <div className="flex-1 lg:flex-[3] flex flex-col w-full">
            <LogrosTabsFilter activo={tab} onChange={setTab} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mt-4">
              {filtered.map((insignia) => (
                <InsigniaCardItem
                  key={insignia.codigo}
                  codigo={insignia.codigo}
                  nombre={insignia.nombre}
                  descripcion={insignia.descripcion}
                  criterio={insignia.criterio}
                  bono_xp={insignia.bono_xp}
                  imagen={insignia.codigo.includes("primera") ? in1Img : in2Img}
                  obtenido={insignia.obtenido}
                />
              ))}
            </div>
          </div>
          <aside className="w-full lg:w-[320px] flex flex-col gap-6">
            <ProgresoXpWidget xpTotal={2480} numNivel={5} nombreNivel="Aprendiz" xpRestantes={520} porcentaje={82} onVerDetalles={() => {}} />
          </aside>
        </div>
      </div>
    </StoryRouter>
  );
}

const meta = {
  title: "Pantallas/App/Logros",
  component: LogrosPageStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LogrosPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Escritorio: Story = {};
export const MovilApp: Story = { globals: { viewport: { value: "movilApp", isRotated: false } } };
