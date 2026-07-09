import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogrosTabsFilter } from "./logros-tabs-filter";

const meta: Meta<typeof LogrosTabsFilter> = {
  title: "Features/Gamification/LogrosTabsFilter",
  component: LogrosTabsFilter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Todas: Story = {
  args: {
    activo: "todas",
    onChange: (tab) => console.log("Category changed to", tab),
  },
};
export const Especiales: Story = {
  args: {
    activo: "especial",
    onChange: (tab) => console.log("Category changed to", tab),
  },
};
