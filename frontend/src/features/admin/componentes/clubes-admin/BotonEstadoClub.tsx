import { Archive } from "lucide-react";
import type { ClubAdminResumen } from "../../admin-clubes.api";

const etiquetas: Record<"archivar" | "reactivar", string> = {
  archivar: "Archivar",
  reactivar: "Reactivar",
};

interface BotonEstadoClubProps {
  club: ClubAdminResumen;
  deshabilitado: boolean;
  onAccion?: (confirmacion: { tipo: "archivar" | "reactivar"; club: ClubAdminResumen }) => void;
}

export function BotonEstadoClub({ club, deshabilitado, onAccion }: BotonEstadoClubProps) {
  const tipo = club.activo ? "archivar" : "reactivar";
  return (
    <button
      type="button"
      aria-label={`${etiquetas[tipo]} ${club.nombre}`}
      disabled={deshabilitado}
      onClick={() => onAccion?.({ tipo, club })}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Archive className="size-4" aria-hidden="true" />
      {etiquetas[tipo]}
    </button>
  );
}
