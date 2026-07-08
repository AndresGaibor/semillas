import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card-shadcn";

const meta = {
  title: "Componentes/Card/shadcn",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const Basico: StoryObj = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Descripción breve de la tarjeta</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          Contenido principal de la tarjeta. Aquí va el cuerpo con la información relevante.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-slate-50">Cancelar</button>
        <button className="px-3 py-1.5 text-sm bg-[#2E9E5B] text-white rounded-lg hover:bg-[#1E6B3C]">Confirmar</button>
      </CardFooter>
    </Card>
  ),
};

export const ConAccion: StoryObj = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notificación</CardTitle>
        <CardAction>
          <button className="p-1 hover:bg-slate-100 rounded">
            <MoreHorizontal className="size-4" />
          </button>
        </CardAction>
        <CardDescription>Tienes un nuevo mensaje</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          El tema "El amor de Dios" ha sido publicado y está disponible para todos los usuarios.
        </p>
      </CardContent>
    </Card>
  ),
};

export const DocumentacionCompleta: StoryObj = {
  name: "📄 Documentación Completa",
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="min-h-screen bg-white font-sans p-8">
      <div className="max-w-4xl">
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900">Card shadcn/ui</h1>
        <p className="mb-8 text-slate-500">
          Sistema de tarjetas modular de shadcn/ui. Compuesto por Card, CardHeader, CardTitle,
          CardDescription, CardAction, CardContent y CardFooter.
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-violet-700">Partes del componente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>CardTitle</CardTitle>
                <CardDescription>CardDescription</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">CardContent - Cuerpo de la tarjeta</p>
              </CardContent>
              <CardFooter>CardFooter</CardFooter>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Con Acción</CardTitle>
                <CardAction>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreHorizontal className="size-4" />
                  </button>
                </CardAction>
                <CardDescription>CardAction en la esquina</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">El action se posiciona arriba a la derecha</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-violet-700">Ejemplo de uso real</h2>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar tema</CardTitle>
              <CardDescription>Modifica los detalles del tema bíblico</CardDescription>
              <CardAction>
                <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="size-4" />
                </button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                <p className="text-sm font-medium">El amor del Padre Celestial</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Senda</label>
                <p className="text-sm">Padre</p>
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2 border-t pt-4">
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50">Cancelar</button>
              <button className="px-4 py-2 text-sm bg-[#2E9E5B] text-white rounded-lg hover:bg-[#1E6B3C] flex items-center gap-2">
                <Pencil className="size-3" /> Guardar
              </button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  ),
};
