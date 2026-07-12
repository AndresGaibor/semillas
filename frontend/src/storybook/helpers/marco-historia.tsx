import type { PropsWithChildren, ReactNode } from "react";

interface MarcoHistoriaProps extends PropsWithChildren { titulo: string; descripcion?: string; meta?: ReactNode; ancho?: "contenido" | "pagina" | "completo" }

export function MarcoHistoria({ titulo, descripcion, meta, ancho = "pagina", children }: MarcoHistoriaProps) {
  const widthClass = ancho === "contenido" ? "max-w-3xl" : ancho === "pagina" ? "max-w-7xl" : "w-full";
  return <main className="min-h-screen bg-[var(--background)] p-4 sm:p-6 lg:p-8"><div className={`mx-auto ${widthClass}`}><header className="mb-6 border-b pb-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-bold">{titulo}</h1>{descripcion ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{descripcion}</p> : null}</div>{meta}</div></header>{children}</div></main>;
}
