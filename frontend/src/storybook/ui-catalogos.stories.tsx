import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Home, LayoutGrid, Search, UserRound } from "lucide-react";
import { Alerta } from "@/componentes/ui/alerta";
import { BottomNav } from "@/componentes/ui/bottom-nav";
import { Boton } from "@/componentes/ui/boton";
import { Card, CardContent, CardHeader, CardTitle } from "@/componentes/ui/card-base";
import { Container } from "@/componentes/ui/container";
import { EmptyState } from "@/componentes/ui/empty-state";
import { Input } from "@/componentes/ui/input";
import { LoaderEstado } from "@/componentes/ui/loader-estado";
import { PageHeader } from "@/componentes/ui/page-header";
import { MarcoHistoria, MatrizVariantes } from "./helpers";

function Catalogo({ grupo }: { grupo: "acciones" | "formularios" | "feedback" | "navegacion" | "datos" | "layout" }) {
  const contenido = {
    acciones: <div className="flex flex-wrap gap-3"><Boton>Continuar</Boton><Boton variante="secundario">Guardar</Boton><Boton variante="fantasma">Cancelar</Boton><Boton cargando>Procesando</Boton></div>,
    formularios: <div className="max-w-md space-y-3"><label className="text-sm font-medium" htmlFor="buscar">Buscar temas</label><Input id="buscar" placeholder="Escribe para buscar" /><div className="flex gap-2"><Boton variante="secundario" iconoIzquierdo={<Search className="size-4" />}>Buscar</Boton><Boton deshabilitado>Deshabilitado</Boton></div></div>,
    feedback: <div className="space-y-3"><Alerta variante="informacion">Información para el semillero.</Alerta><Alerta variante="exito">Cambios guardados correctamente.</Alerta><LoaderEstado mensaje="Cargando contenido" /><EmptyState mensaje="No hay resultados todavía." /></div>,
    navegacion: <BottomNav activo="inicio" opciones={[{ id: "inicio", etiqueta: "Inicio", icono: <Home className="size-5" /> }, { id: "sendas", etiqueta: "Sendas", icono: <LayoutGrid className="size-5" /> }, { id: "perfil", etiqueta: "Perfil", icono: <UserRound className="size-5" />, badge: true }]} onCambiar={() => undefined} />,
    datos: <div className="grid gap-4 sm:grid-cols-2"><Card><CardHeader><CardTitle>Progreso semanal</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">72%</p></CardContent></Card><Card><CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader><CardContent><Bell className="text-[var(--primary)]" /></CardContent></Card></div>,
    layout: <Container><PageHeader titulo="Catálogo de layout" descripcion="Estructura reutilizable para páginas y boards." acciones={<Boton variante="secundario">Acción</Boton>} /><div className="mt-6 rounded-xl border p-6">Contenido de página</div></Container>,
  }[grupo];
  return <MarcoHistoria titulo={`Catálogo · ${grupo}`} ancho="pagina">{contenido}</MarcoHistoria>;
}

const meta = { title: "02 · UI/Catálogos profesionales", component: Catalogo, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Catalogo>;
export default meta;
type Story = StoryObj<typeof meta>;
const grupos = ["acciones", "formularios", "feedback", "navegacion", "datos", "layout"] as const;

export const Acciones: Story = { args: { grupo: "acciones" } };
export const Formularios: Story = { args: { grupo: "formularios" } };
export const Feedback: Story = { args: { grupo: "feedback" } };
export const Navegacion: Story = { args: { grupo: "navegacion" } };
export const Datos: Story = { args: { grupo: "datos" } };
export const Layout: Story = { args: { grupo: "layout" } };
export const Todas: Story = { render: () => <MatrizVariantes variantes={grupos.map((grupo) => ({ id: grupo, titulo: grupo, valor: grupo }))} columnas={2} render={(grupo) => <Catalogo grupo={grupo} />} /> };
