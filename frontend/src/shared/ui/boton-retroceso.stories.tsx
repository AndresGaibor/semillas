import type { Meta, StoryObj } from "@storybook/react-vite";
import { BotonRetroceso } from "./boton-retroceso";

const meta = {
  title: "Shared/UI/Botón Retroceso",
  component: BotonRetroceso,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Texto del botón (default: Volver)",
    },
    onClick: { action: "click" },
  },
} satisfies Meta<typeof BotonRetroceso>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: () => {},
  },
};

export const Personalizado: Story = {
  args: {
    children: "Regresar al inicio",
    onClick: () => {},
  },
};
