import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompartirInsigniaWidget } from "./compartir-insignia-widget";
import in1Img from "@/assets/images/Ilustraciones/in1.png";

const meta: Meta<typeof CompartirInsigniaWidget> = {
  title: "04 · Features/Gamification/CompartirInsigniaWidget",
  component: CompartirInsigniaWidget,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nombreInsignia: "Primer paso",
    imagenInsignia: in1Img,
    onCompartir: () => console.log("Compartir clicked"),
    compartido: false,
  },
};
export const Compartido: Story = {
  args: {
    nombreInsignia: "Primer paso",
    imagenInsignia: in1Img,
    onCompartir: () => console.log("Compartir clicked"),
    compartido: true,
  },
};
