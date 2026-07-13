import type { Meta, StoryObj } from "@storybook/react-vite";
import { SendaCard } from "./senda-card";
import sendaPadreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";

const meta: Meta<typeof SendaCard> = {
  title: "04 · Features/Home/SendaCard",
  component: SendaCard,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Padre: Story = {
  args: {
    variante: "padre",
    imagenUrl: sendaPadreImg,
    label: "Senda del",
    titulo: "Padre",
    descripcion: "Dios es nuestro Padre amoroso.",
    hash: "padre",
  },
};
