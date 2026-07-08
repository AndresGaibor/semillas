import * as React from "react";
import { unirClases } from "@/lib/utilidades";

export type TipoRol = "Niño" | "Adolescente" | "Padre/Madre" | "Moderador" | "Administrador";

const CONFIG_ROL: Record<TipoRol, { etiqueta: string; clases: string }> = {
  Niño: {
    etiqueta: "Niño",
    clases: "bg-[#6c3aed]/10 text-[#6c3aed]",
  },
  Adolescente: {
    etiqueta: "Adolescente",
    clases: "bg-[#6c3aed]/15 text-[#6c3aed]",
  },
  "Padre/Madre": {
    etiqueta: "Padre/Madre",
    clases: "bg-orange-100 text-orange-650",
  },
  Moderador: {
    etiqueta: "Moderador",
    clases: "bg-blue-105 text-blue-700",
  },
  Administrador: {
    etiqueta: "Administrador",
    clases: "bg-emerald-100 text-emerald-700",
  },
};

export type BadgeRolProps = {
  rol: TipoRol;
  className?: string;
};

export function BadgeRol({ rol, className }: BadgeRolProps) {
  const config = CONFIG_ROL[rol] ?? CONFIG_ROL.Niño;
  return (
    <span
      className={unirClases(
        "inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold",
        config.clases,
        className,
      )}
    >
      {config.etiqueta}
    </span>
  );
}
