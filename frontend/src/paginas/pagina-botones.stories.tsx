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

export const VistaCompleta: Story = {};
