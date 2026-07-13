import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocialLoginButton } from "./social-login-button";
import googleIcon from "@/assets/images/icons/google.png";
import guestIcon from "@/assets/images/icons/invitado.png";

const meta: Meta<typeof SocialLoginButton> = {
  title: "04 · Features/Auth/SocialLoginButton",
  component: SocialLoginButton,
  tags: ["autodocs", "!dev"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Google: Story = {
  args: {
    tipo: "google",
    logo: googleIcon,
    label: "Continuar con Google",
  },
};

export const Invitado: Story = {
  args: {
    tipo: "guest",
    logo: guestIcon,
    label: "Jugar como invitado",
    guestNote: "Explora sin cuenta. Tu progreso no se guardará.",
  },
};
