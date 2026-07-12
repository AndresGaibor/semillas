import type { Meta, StoryObj } from "@storybook/react-vite";
import { WifiOff, AlertTriangle, LoaderCircle, CheckCircle2 } from "lucide-react";
import { EscenarioVisual, MarcoHistoria, MatrizEstados } from "./helpers";

type Estado = "normal" | "loading" | "empty" | "error" | "offline";

function QAMatriz({ estado = "normal", textoLargo = false }: { estado?: Estado; textoLargo?: boolean }) {
  const copy = textoLargo ? "Contenido extenso para validar saltos de línea, truncamiento, densidad visual y lectura en anchos pequeños sin romper el diseño de la aplicación." : "Una vista estable y legible para revisar el contrato visual.";
  const content = {
    normal: <><CheckCircle2 className="text-[var(--primary)]" aria-hidden="true" /><p>{copy}</p></>,
    loading: <><LoaderCircle className="animate-spin text-[var(--primary)]" aria-hidden="true" /><p>Cargando contenido…</p></>,
    empty: <><div className="rounded-full bg-muted p-3"><CheckCircle2 aria-hidden="true" /></div><p>Aún no hay contenido disponible.</p></>,
    error: <><AlertTriangle className="text-destructive" aria-hidden="true" /><p>No se pudo cargar la información.</p></>,
    offline: <><WifiOff className="text-[var(--accent)]" aria-hidden="true" /><p>Estás sin conexión. Mostramos los datos guardados.</p></>,
  }[estado];
  return <div className="rounded-2xl border bg-card p-6 shadow-sm"><div className="flex items-start gap-4">{content}</div><p className="mt-4 text-sm text-muted-foreground">Semillas · estado {estado}</p></div>;
}

const meta = {
  title: "07 · QA visual/Matriz transversal",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof QAMatriz>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estados: Story = {
  render: () => <MarcoHistoria titulo="Matriz transversal" descripcion="Estados mínimos para revisión visual y regresión responsive."><MatrizEstados estados={["normal", "loading", "empty", "error", "offline"].map((estado) => ({ id: estado, titulo: estado, valor: estado as Estado }))} columnas={3} render={(estado) => <QAMatriz estado={estado} />} /></MarcoHistoria>,
};

export const ContenidoLargo: Story = { render: () => <MarcoHistoria titulo="Contenido largo" ancho="contenido"><QAMatriz textoLargo /></MarcoHistoria> };
export const Offline: Story = { render: () => <MarcoHistoria titulo="Modo offline" ancho="contenido"><EscenarioVisual estado="offline" conexion="sin conexión"><QAMatriz estado="offline" /></EscenarioVisual></MarcoHistoria>, parameters: { backgrounds: { value: "crema" } } };
export const MovimientoReducido: Story = { globals: { motion: "reduced" }, render: () => <MarcoHistoria titulo="Movimiento reducido" ancho="contenido"><QAMatriz estado="loading" /></MarcoHistoria> };
