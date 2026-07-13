import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickActionsGrid } from "./quick-actions-grid";

const meta = {
  title: "04 · Features/Dashboard/Quick Actions Grid",
  component: QuickActionsGrid,
  parameters: { layout: "padded" },
  tags: ["autodocs", "!dev"],
} satisfies Meta<typeof QuickActionsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCrearTema: () => alert("Crear tema"),
    onAgregarActividad: () => alert("Agregar actividad"),
    onSubirRecurso: () => alert("Subir recurso"),
    onRevisarContenido: () => alert("Revisar contenido"),
  },
};
