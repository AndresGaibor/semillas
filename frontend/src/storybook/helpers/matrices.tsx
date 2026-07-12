import type { ReactNode } from "react";

export interface Variante<T> { id: string; titulo: string; descripcion?: string; valor: T }
export interface EstadoVisual<T> { id: string; titulo: string; valor: T; descripcion?: string }
const gridClasses = { 1: "grid-cols-1", 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3", 4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" } as const;

export function MatrizVariantes<T>({ variantes, columnas = 3, render }: { variantes: Variante<T>[]; columnas?: 1 | 2 | 3 | 4; render: (valor: T) => ReactNode }) {
  return <div className={`grid gap-6 ${gridClasses[columnas]}`}>{variantes.map((variante) => <section className="min-w-0 rounded-xl border bg-card p-4" key={variante.id}><h2 className="font-semibold">{variante.titulo}</h2>{variante.descripcion ? <p className="mb-4 text-sm text-muted-foreground">{variante.descripcion}</p> : null}{render(variante.valor)}</section>)}</div>;
}

export function MatrizEstados<T>({ estados, render }: { estados: EstadoVisual<T>[]; render: (valor: T) => ReactNode }) {
  return <MatrizVariantes variantes={estados} render={render} />;
}

export function MarcoViewport({ ancho, children }: { ancho: 360 | 390 | 412 | 768 | 1440; children: ReactNode }) {
  return <div className="mx-auto w-full overflow-hidden rounded-xl border bg-background" style={{ maxWidth: ancho }}>{children}</div>;
}
