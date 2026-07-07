import type { Meta, StoryObj } from "@storybook/react-vite";
import { VersionInfo } from "./version-info";

const meta = {
  title: "Sistema/Versiones",
  component: VersionInfo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    versionApp: {
      control: "text",
      description: "Número de versión actual de la PWA",
    },
    entorno: {
      control: "select",
      options: ["desarrollo", "pruebas", "produccion"],
      description: "Entorno actual del despliegue del diseño",
    },
    fechaCompilacion: {
      control: "text",
      description: "Fecha de compilación o publicación del diseño",
    },
  },
} satisfies Meta<typeof VersionInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Principal: Story = {
  args: {
    versionApp: "1.3.0",
    entorno: "desarrollo",
    fechaCompilacion: "7 de julio de 2026",
  },
};

export const Produccion: Story = {
  args: {
    versionApp: "1.3.0",
    entorno: "produccion",
    fechaCompilacion: "7 de julio de 2026",
  },
};

export const Pruebas: Story = {
  args: {
    versionApp: "1.3.0-rc1",
    entorno: "pruebas",
    fechaCompilacion: "7 de julio de 2026",
  },
};
