import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescargasBanner } from "./descargas-banner";

const meta: Meta<typeof DescargasBanner> = {
  title: "Features/Descargas/DescargasBanner",
  component: DescargasBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    onCerrar: () => console.log("Cerrar clicked"),
  },
};
