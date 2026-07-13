import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClubComparteWidget } from "./club-comparte-widget";

const meta: Meta<typeof ClubComparteWidget> = {
  title: "04 · Features/Clubes/ClubComparteWidget",
  component: ClubComparteWidget,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCompartir: () => console.log("Compartir clicked"),
  },
};
