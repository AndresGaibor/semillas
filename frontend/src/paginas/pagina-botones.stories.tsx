import type { Meta, StoryObj } from "@storybook/react-vite";

import { PaginaBotones } from "./pagina-botones";

const meta = {
  title: "Páginas/PaginaBotones",
  component: PaginaBotones,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PaginaBotones>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VistaCompleta: Story = {
  render: () => <PaginaBotones />
};

export const VistaMovil: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => (
    <div className="mx-auto w-[390px] overflow-hidden rounded-[32px] border border-slate-200 shadow-2xl">
      <PaginaBotones />
    </div>
  )
};

export const VistaDesktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop"
    }
  },
  render: () => <PaginaBotones />
};
