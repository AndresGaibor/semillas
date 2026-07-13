import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResumenTemasCard } from "./resumen-temas-card";

const meta: Meta<typeof ResumenTemasCard> = {
  title: "04 · Features/Themes/ResumenTemasCard",
  component: ResumenTemasCard,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totales: 10,
    completados: 4,
    enProgreso: 2,
  },
};
