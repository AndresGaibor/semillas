interface Confirmacion {
  tipo: "archivar" | "reactivar" | "expulsar" | "transferir" | "cerrar-reto";
  club: { id: string; nombre: string };
  nombreObjetivo?: string;
  usuarioId?: string;
  retoId?: string;
}

const etiquetasConfirmacion: Record<Confirmacion["tipo"], string> = {
  archivar: "Archivar",
  reactivar: "Reactivar",
  expulsar: "Expulsar",
  transferir: "Transferir liderazgo a",
  "cerrar-reto": "Cerrar",
};

interface DialogoConfirmacionProps {
  confirmacion: Confirmacion;
  mutando: boolean;
  onConfirmar?: () => void;
  onCancelar?: () => void;
}

export function DialogoConfirmacion({ confirmacion, mutando, onConfirmar, onCancelar }: DialogoConfirmacionProps) {
  const objetivo = confirmacion.nombreObjetivo ? ` ${confirmacion.nombreObjetivo}` : ` ${confirmacion.club.nombre}`;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmar-clubes-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button type="button" aria-label="Cancelar confirmación" onClick={onCancelar} className="absolute inset-0 cursor-default bg-slate-950/40" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 id="confirmar-clubes-title" className="text-xl font-black text-slate-900">
          ¿{etiquetasConfirmacion[confirmacion.tipo]}{objetivo}?
        </h3>
        <p className="mt-2 text-sm text-slate-600">Confirma esta acción administrativa. Los cambios se aplicarán al instante.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={mutando}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={mutando}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {mutando ? "Procesando..." : etiquetasConfirmacion[confirmacion.tipo]}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Confirmacion };
