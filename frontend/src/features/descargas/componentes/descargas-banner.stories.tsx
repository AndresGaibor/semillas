import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescargasBanner } from "./descargas-banner";

const meta: Meta<typeof DescargasBanner> = {
  title: "04 · Features/Descargas/DescargasBanner",
  component: DescargasBanner,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    isOnline: true,
    downloadedCount: 2,
    pendingCount: 1,
    onCerrar: () => console.log("Cerrar clicked"),
    onGestionar: () => console.log("Gestionar clicked"),
  },
};
