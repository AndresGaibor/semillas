import type { ComponentType, SVGProps } from "react";
import { unirClases } from "@/lib/utilidades";

export interface ItemMenuProps {
  texto: string;
  icono: ComponentType<SVGProps<SVGSVGElement>>;
  activo?: boolean;
  color: string;
}

export function ItemMenu({ texto, icono: Icono, activo, color }: ItemMenuProps) {
  return (
    <button
      type="button"
      className={unirClases(
        "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-lg font-semibold transition",
        activo ? "bg-emerald-50 text-emerald-700 shadow-sm" : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <Icono className={unirClases("size-6", activo ? "text-emerald-600" : color)} />
      <span>{texto}</span>
    </button>
  );
}
