import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorageWidget } from "./storage-widget";

const meta: Meta<typeof StorageWidget> = {
  title: "Features/Descargas/StorageWidget",
  component: StorageWidget,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    usedMB: 65.4,
    totalMB: 2000,
    percentage: 3,
    onGestionarClick: () => console.log("Gestionar clicked"),
  },
};
export const CasiLleno: Story = {
  args: {
    usedMB: 1850,
    totalMB: 2000,
    percentage: 92,
    onGestionarClick: () => console.log("Gestionar clicked"),
  },
};
