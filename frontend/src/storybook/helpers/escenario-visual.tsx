import type { ReactNode } from "react";

export function EscenarioVisual({ estado, persona, conexion, children }: { estado: string; persona?: string; conexion?: string; children: ReactNode }) {
  return <div data-story-state={estado} className="space-y-3"><div className="flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="rounded-full border px-2 py-1">Estado: {estado}</span>{persona ? <span className="rounded-full border px-2 py-1">Persona: {persona}</span> : null}{conexion ? <span className="rounded-full border px-2 py-1">Conexión: {conexion}</span> : null}</div>{children}</div>;
}
