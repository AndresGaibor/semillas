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
