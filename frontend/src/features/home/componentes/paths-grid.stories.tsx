import type { Meta, StoryObj } from "@storybook/react-vite";
import { PathsGrid } from "./paths-grid";
import sendaPadreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import sendaHijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import sendaEspirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";

const meta: Meta<typeof PathsGrid> = {
  title: "Features/Home/PathsGrid",
  component: PathsGrid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sendaPadreImg,
    sendaHijoImg,
    sendaEspirituImg,
  },
};
