import type { Meta, StoryObj } from "@storybook/react-vite";
import { UnirseClubForm } from "./unirse-club-form";

const meta: Meta<typeof UnirseClubForm> = {
  title: "04 · Features/Clubes/UnirseClubForm",
  component: UnirseClubForm,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Vacio: Story = {
  args: {
    joinCode: "",
    onCodeChange: (val) => console.log("Code changed", val),
    onSubmit: (e) => { e.preventDefault(); console.log("Form submitted"); },
  },
};

export const ConCodigo: Story = {
  args: {
    joinCode: "RIOB-1234",
    onCodeChange: (val) => console.log("Code changed", val),
    onSubmit: (e) => { e.preventDefault(); console.log("Form submitted"); },
  },
};
