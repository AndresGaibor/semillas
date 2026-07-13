import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdminThemesTable } from "./admin-themes-table";

const meta = {
  title: "04 · Features/Themes/Table",
  component: AdminThemesTable,
  parameters: { layout: "padded" },
  tags: ["autodocs", "!dev"],
} satisfies Meta<typeof AdminThemesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    temas: [
      {
        id: "1",
        titulo: "La creación de Dios",
        resumen: "Dios creó el mundo con amor y propósito.",
        portadaUrl: "/storybook/fixtures/avatar.svg",
        sendaNombre: "Padre",
        sendaColorHex: "#3D8BD4",
        sendaIcono: "fa-crown",
        franjaEdad: "5-8 años",
        estado: "publicado",
        fechaEdicion: "15 may. 2024, 10:30",
        autorNombre: "María López",
        autorAvatar: "/storybook/fixtures/avatar.svg",
      },
      {
        id: "2",
        titulo: "La oración",
        resumen: "Hablemos con Dios en cualquier lugar.",
        portadaUrl: "/storybook/fixtures/avatar.svg",
        sendaNombre: "Hijo",
        sendaColorHex: "#E9A23B",
        sendaIcono: "fa-heart",
        franjaEdad: "9-12 años",
        estado: "revision",
        fechaEdicion: "14 may. 2024, 16:45",
        autorNombre: "Juan Pérez",
        autorAvatar: "/storybook/fixtures/avatar.svg",
      },
      {
        id: "3",
        titulo: "El perdón",
        resumen: "Dios siempre nos perdona cuando lo necesitamos.",
        portadaUrl: "/storybook/fixtures/avatar.svg",
        sendaNombre: "Espíritu Santo",
        sendaColorHex: "#17A398",
        sendaIcono: "fa-flame",
        franjaEdad: "13-17 años",
        estado: "borrador",
        fechaEdicion: "13 may. 2024, 09:20",
        autorNombre: "Ana Torres",
        autorAvatar: "/storybook/fixtures/avatar.svg",
      },
    ],
    onEditar: (id) => alert(`Editar theme ${id}`),
    onCRECER: (id) => alert(`CRECER theme ${id}`),
    onActivities: (id) => alert(`Actividades theme ${id}`),
    onPreview: (id) => alert(`Vista previa theme ${id}`),
    onPublicar: (id) => alert(`Publicar theme ${id}`),
    onDespublicar: (id) => alert(`Despublicar theme ${id}`),
  },
};
