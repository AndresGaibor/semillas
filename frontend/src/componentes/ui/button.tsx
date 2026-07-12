import * as React from "react";
import { Boton, type PropiedadesBoton } from "./boton";

/** @deprecated Usar Boton y sus props en español. Adaptador temporal para imports shadcn. */
export type ButtonProps = Omit<React.ComponentProps<typeof Boton>, "variante" | "tamano"> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "responsive" | "icon" | "icon-responsive" | "icon-sm" | "icon-lg";
  asChild?: boolean;
};

const variantes: Record<NonNullable<ButtonProps["variant"]>, PropiedadesBoton["variante"]> = {
  default: "primario",
  destructive: "peligro",
  outline: "contorno",
  secondary: "secundario",
  ghost: "texto",
  link: "texto",
};

const tamanos: Record<NonNullable<ButtonProps["size"]>, PropiedadesBoton["tamano"]> = {
  default: "mediano",
  sm: "pequeno",
  lg: "grande",
  responsive: "adaptativo",
  icon: "icono",
  "icon-responsive": "iconoAdaptativo",
  "icon-sm": "iconoPequeno",
  "icon-lg": "icono",
};

export function Button({ variant = "default", size = "default", asChild: _asChild, ...props }: ButtonProps) {
  return <Boton {...props} variante={variantes[variant]} tamano={tamanos[size]} />;
}

/** @deprecated La composición debe usar Boton; se conserva para evitar romper documentación antigua. */
export function buttonVariants() {
  return "";
}
