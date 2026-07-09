import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { PaginaCards } from "./pagina-cards";

const meta = {
  title: "Páginas/Página de Cards",
  component: PaginaCards,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PaginaCards>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VistaCompleta: Story = {
  name: "🎴 Vista Completa",
  render: () => <PaginaCards />,
};

export const VistaMovil: Story = {
  name: "📱 Vista Móvil",
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => (
    <div className="mx-auto w-[390px] overflow-hidden rounded-[32px] border border-slate-200 shadow-2xl">
      <PaginaCards />
    </div>
  )
};

export const VistaDesktop: Story = {
  name: "🖥️ Vista Desktop",
  parameters: {
    viewport: {
      defaultViewport: "desktop"
    }
  },
  render: () => <PaginaCards />
};
