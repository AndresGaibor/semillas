import { ArrowRight } from "lucide-react";
import { Chip } from "@/componentes/ui/chip";

type SendaFiltro = "padre" | "hijo" | "espiritu";

const SENDAS = [
  { id: "todas", label: "Todas las sendas", color: "gris" as const },
  { id: "padre", label: "Senda del Padre", color: "amarillo" as const },
  { id: "hijo", label: "Senda del Hijo", color: "azul" as const },
  { id: "espiritu", label: "Senda del Espíritu Santo", color: "verde" as const },
];

export function normalizarSenda(s: string) {
  const v = s.toLowerCase();
  if (v.includes("padre")) return "padre";
  if (v.includes("hijo")) return "hijo";
  if (v.includes("espíritu") || v.includes("espiritu")) return "espiritu";
  return "todas";
}

interface SendaFilterRowProps {
  searchSenda?: SendaFiltro;
  onSendaChange: (senda: SendaFiltro | "todas") => void;
}

export function SendaFilterRow({ searchSenda, onSendaChange }: SendaFilterRowProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {SENDAS.map((senda) => {
        const activa = (senda.id === "todas" && !searchSenda) || searchSenda === senda.id;
        return (
          <button
            key={senda.id}
            type="button"
            onClick={() => onSendaChange(senda.id as SendaFiltro | "todas")}
            className="focus-visible:outline-none"
          >
            <Chip
              color={senda.color}
              forma="badgePildora"
              icono={<ArrowRight />}
              className={activa ? "ring-2 ring-offset-2 ring-slate-900/10" : "opacity-80"}
            >
              {senda.label}
            </Chip>
          </button>
        );
      })}
    </div>
  );
}
