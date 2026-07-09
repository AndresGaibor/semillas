import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgresoXpWidget } from "./progreso-xp-widget";

const meta: Meta<typeof ProgresoXpWidget> = {
  title: "Features/Gamification/ProgresoXpWidget",
  component: ProgresoXpWidget,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    xpTotal: 1250,
    numNivel: 7,
    nombreNivel: "Explorador",
    xpRestantes: 750,
    porcentaje: 25,
    onVerDetalles: () => console.log("Ver detalles clicked"),
  },
};
export const CasiSiguienteNivel: Story = {
  args: {
    xpTotal: 1950,
    numNivel: 7,
    nombreNivel: "Explorador",
    xpRestantes: 50,
    porcentaje: 95,
    onVerDetalles: () => console.log("Ver detalles clicked"),
  },
};
