import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { Loader, X } from "lucide-react";

import type { Tema } from "@/shared/api/api";
import { obtenerTemasAdmin } from "../admin.api";

export const estadosTemaParaNuevaActividad = ["borrador", "revision", "publicado"] as const;

type NuevaActividadDialogProps = {
  onClose: () => void;
};

type NuevaActividadDialogContenidoProps = {
  temas: Tema[];
  isLoading: boolean;
  selectedThemeId: string;
  onThemeChange: (themeId: string) => void;
  onClose: () => void;
  onContinue: () => void;
};

export function NuevaActividadDialog({ onClose }: NuevaActividadDialogProps) {
  const navigate = useNavigate();
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const consultasTemas = useQueries({
    queries: estadosTemaParaNuevaActividad.map((estado) => ({
      queryKey: ["admin", "themes", estado],
      queryFn: () => obtenerTemasAdmin({ status: estado }),
    })),
  });
  const temas = deduplicarTemas(consultasTemas.flatMap((consulta) => consulta.data ?? []));
  const isLoading = consultasTemas.some((consulta) => consulta.isLoading);

  const handleContinue = () => {
    if (!selectedThemeId) return;

    navigate({
      to: "/admin/temas/$themeId/activities",
      params: { themeId: selectedThemeId },
      search: { form: "nueva" },
    });
    onClose();
  };

  return <NuevaActividadDialogContenido temas={temas} isLoading={isLoading} selectedThemeId={selectedThemeId} onThemeChange={setSelectedThemeId} onClose={onClose} onContinue={handleContinue} />;
}

export function NuevaActividadDialogContenido({ temas, isLoading, selectedThemeId, onThemeChange, onClose, onContinue }: NuevaActividadDialogContenidoProps) {
  const dialogoRef = useRef<HTMLDivElement>(null);
  const focoAnteriorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    focoAnteriorRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogoRef.current?.focus();

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
      focoAnteriorRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button type="button" className="absolute inset-0 bg-slate-950/55" aria-label="Cerrar diálogo" onClick={onClose} />
      <div ref={dialogoRef} role="dialog" aria-modal="true" aria-labelledby="nueva-actividad-titulo" aria-describedby="nueva-actividad-descripcion" tabIndex={-1} className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl outline-none sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="admin-eyebrow">Biblioteca editorial</span>
            <h2 id="nueva-actividad-titulo" className="mt-1 text-xl font-black text-slate-900">Nueva actividad</h2>
            <p id="nueva-actividad-descripcion" className="mt-2 text-sm leading-6 text-slate-500">Elige el tema donde prepararás la experiencia de aprendizaje.</p>
          </div>
          <button type="button" className="admin-icon-button" aria-label="Cerrar diálogo" onClick={onClose}><X size={18} /></button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10" aria-live="polite"><Loader className="animate-spin text-primario" size={24} /><span className="sr-only">Cargando temas</span></div>
        ) : (
          <>
            <label className="admin-field admin-field--wide" htmlFor="tema-nueva-actividad"><span>Tema</span><select id="tema-nueva-actividad" value={selectedThemeId} onChange={(event) => onThemeChange(event.target.value)}><option value="">Selecciona un tema</option>{temas.map((tema) => <option key={tema.id} value={tema.id}>{tema.titulo} · {tema.estado}</option>)}</select></label>
            {temas.length === 0 ? <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">No hay temas en borrador, revisión o publicados. Crea un tema antes de añadir actividades.</div> : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" className="admin-secondary-button" onClick={onClose}>Cancelar</button><button type="button" className="admin-primary-button" disabled={!selectedThemeId} onClick={onContinue}>Continuar al editor</button></div>
          </>
        )}
      </div>
    </div>
  );
}

function deduplicarTemas(temas: Tema[]): Tema[] {
  return [...new Map(temas.map((tema) => [tema.id, tema])).values()];
}
