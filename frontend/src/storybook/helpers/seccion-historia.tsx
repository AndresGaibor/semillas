import type { PropsWithChildren, ReactNode } from "react";

export function SeccionHistoria({ titulo, descripcion, meta, children }: PropsWithChildren<{ titulo: string; descripcion?: string; meta?: ReactNode }>) {
  return <section className="space-y-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-lg font-semibold">{titulo}</h2>{descripcion ? <p className="text-sm text-muted-foreground">{descripcion}</p> : null}</div>{meta}</div>{children}</section>;
}
