import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react";

// Estas importaciones mantienen los componentes dentro del grafo de Storybook
// mientras cada componente recibe su historia de estados específica.
import "@/componentes/estados/pantalla-acceso-denegado";
import "@/componentes/estados/pantalla-carga-sesion";
import "@/componentes/estados/pantalla-error-ruta";
import "@/componentes/estados/pantalla-estado";
import "@/componentes/estados/pantalla-no-encontrado";
import "@/componentes/ui/aspect-ratio";
import "@/componentes/ui/close-button";
import "@/componentes/ui/container";
import "@/componentes/ui/dialogo-conflicto-vinculacion";
import "@/componentes/ui/page-header";
import "@/componentes/ui/pwa-lifecycle";
import "@/componentes/ui/spacer";
import "@/componentes/ui/visually-hidden";
import "@/componentes/ui/sugerencia-instalacion-pwa";
import "@/components/admin/panel/acciones-rapidas";
import "@/components/admin/panel/actividad-reciente";
import "@/components/admin/panel/estado-contenido";
import "@/components/admin/panel/progreso-semanal";
import "@/components/admin/panel/proximas-revisiones";
import "@/components/admin/panel/tabla-temas-recientes";
import "@/components/admin/panel/tarjeta-metrica";
import "@/features/gamification/componentes/modal-celebracion";
import "@/features/descargas/componentes/offline-manager-dialog";
import "@/features/instalacion/componentes/aviso-instalar-ios";
import "@/features/instalacion/componentes/instalacion-prompt";
import "@/features/instalacion/componentes/instalar-app-banner";
import "@/features/landing/componentes/WelcomeBanner";
import "@/shared/layout/app-account-menu-mobile";
import "@/shared/layout/app-user-header";

const meta = {
  title: "Fundamentos/Cobertura UI existente",
  component: Fragment,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Fragment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inventario: Story = {
  render: () => <p className="p-6 text-sm text-slate-600">Componentes existentes disponibles para historias específicas.</p>,
};
