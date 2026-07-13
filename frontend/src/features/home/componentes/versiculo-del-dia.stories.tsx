import type { Meta, StoryObj } from "@storybook/react-vite";
import { VersiculoDelDia } from "./versiculo-del-dia";

const meta: Meta<typeof VersiculoDelDia> = {
  title: "04 · Features/Home/VersiculoDelDia",
  component: VersiculoDelDia,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    texto: "Todo lo puedo en Cristo que me fortalece.",
    referencia: "Filipenses 4:13",
  },
};
