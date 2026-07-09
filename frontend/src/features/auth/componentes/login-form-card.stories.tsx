import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginFormCard } from "./login-form-card";

const meta: Meta<typeof LoginFormCard> = {
  title: "Features/Auth/LoginFormCard",
  component: LoginFormCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onGoogleClick: () => console.log("Google clicked"),
    onFacebookClick: () => console.log("Facebook clicked"),
    onGuestClick: () => console.log("Guest clicked"),
    onDevAdminClick: () => console.log("Dev admin clicked"),
  },
};

export const Pending: Story = {
  args: {
    ...Default.args,
    guestPending: true,
  },
};
export const ErrorState: Story = {
  args: {
    ...Default.args,
    guestError: true,
  },
};
