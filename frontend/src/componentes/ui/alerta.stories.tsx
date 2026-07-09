import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Alerta } from "./alerta";

const meta = {
  title: "Componentes/Alerta",
  component: Alerta,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Alerta>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Exito: Story = {
  args: {
    variante: "exito",
    children: "¡Excelente! Completaste la lección.",
  },
};

export const Atencion: Story = {
  args: {
    variante: "atencion",
    children: "Atención: Tienes cambios sin sincronizar.",
  },
};

export const Error: Story = {
  args: {
    variante: "error",
    children: "Ocurrió un error al sincronizar.",
  },
};

export const Informacion: Story = {
  args: {
    variante: "informacion",
    children: "Recuerda descargar tus lecciones.",
  },
};

export const Offline: Story = {
  args: {
    variante: "offline",
    children: "Estás sin conexión. Estás en modo offline.",
  },
};
