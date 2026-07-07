import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecursoCard } from "./recurso-card";
import arkImg from "@/assets/images/Ilustraciones/Tema1.png";

const meta: Meta<typeof RecursoCard> = {
  title: "Features/Descargas/RecursoCard",
  component: RecursoCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NoDescargado: Story = {
  args: {
    id: "noe",
    titulo: "La historia de Noé",
    tipo: "Historia",
    edad: "5-8",
    sizeMB: 15.2,
    descripcion: "Conoce cómo Dios protegió a Noé y a los animales del gran diluvio.",
    imagen: arkImg,
    isDownloaded: false,
    onDownload: () => console.log("Download clicked"),
    onDelete: () => console.log("Delete clicked"),
  },
};

export const Descargando: Story = {
  args: {
    ...NoDescargado.args,
    progress: 40,
  },
};

export const Descargado: Story = {
  args: {
    ...NoDescargado.args,
    isDownloaded: true,
  },
};
