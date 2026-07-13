import type { Meta, StoryObj } from "@storybook/react-vite";
import { TemasSearchBar } from "./temas-search-bar";

const meta: Meta<typeof TemasSearchBar> = {
  title: "04 · Features/Themes/TemasSearchBar",
  component: TemasSearchBar,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    valor: "",
    onChange: (val) => console.log("Search query changed to", val),
  },
};
export const ConValor: Story = {
  args: {
    valor: "Noé",
    onChange: (val) => console.log("Search query changed to", val),
  },
};
