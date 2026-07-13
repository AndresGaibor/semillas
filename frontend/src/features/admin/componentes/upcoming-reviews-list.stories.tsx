import type { Meta, StoryObj } from "@storybook/react-vite";
import { UpcomingReviewsList } from "./upcoming-reviews-list";

const meta = {
  title: "04 · Features/Dashboard/Upcoming Reviews List",
  component: UpcomingReviewsList,
  parameters: { layout: "padded" },
  tags: ["autodocs", "!dev"],
} satisfies Meta<typeof UpcomingReviewsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    revisiones: [
      {
        id: "1",
        dia: "16",
        mes: "MAY",
        titulo: "La fe de Abraham",
        senda: "Héroes de la fe",
        estado: "En revisión",
        reviewerNombre: "Ana Torres",
        reviewerAvatar: "/storybook/fixtures/avatar.svg",
      },
      {
        id: "2",
        dia: "17",
        mes: "MAY",
        titulo: "Aprendiendo a perdonar",
        senda: "Relaciones sanas",
        estado: "En revisión",
        reviewerNombre: "Juan Pérez",
        reviewerAvatar: "/storybook/fixtures/avatar.svg",
      },
      {
        id: "3",
        dia: "18",
        mes: "MAY",
        titulo: "Dios cuida de mí",
        senda: "Confío en Dios",
        estado: "Borrador",
        reviewerNombre: "María López",
        reviewerAvatar: "/storybook/fixtures/avatar.svg",
      },
    ],
    onVerTodas: () => alert("Ver todas las revisiones"),
    onSelectReview: (id) => alert(`Seleccionar revisión con id: ${id}`),
  },
};
