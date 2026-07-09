import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { PaginaLogros } from "./pagina-logros";

const meta = {
  title: "Páginas/Página de Logros",
  component: PaginaLogros,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PaginaLogros>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PantallaCompleta: Story = {
  name: "🏆 Pantalla Completa",
  render: () => <PaginaLogros />,
};
