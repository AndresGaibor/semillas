import type { Meta, StoryObj } from "@storybook/react-vite";
import { RachaWidget } from "./racha-widget";

const meta: Meta<typeof RachaWidget> = {
  title: "04 · Features/Home/RachaWidget",
  component: RachaWidget,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    diasRacha: 0,
  },
};

export const WithStreak: Story = {
  args: {
    diasRacha: 5,
  },
};
