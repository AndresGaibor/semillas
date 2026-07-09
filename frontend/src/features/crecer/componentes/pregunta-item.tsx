import type { ReactNode } from "react";
import type { Actividad as ActividadAPI } from "../../../shared/api/api";

interface Opcion {
  id: string;
  etiqueta?: string | null;
  texto: string;
  correcta?: boolean;
}

type Actividad = ActividadAPI & {
  opciones?: Opcion[];
};

interface PreguntaItemProps {
  actividad: Actividad;
  children?: ReactNode;
}

export function PreguntaItem({ actividad, children }: PreguntaItemProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-2">{actividad.titulo}</h3>
      {actividad.consigna && (
        <p className="text-slate-600 mb-4">{actividad.consigna}</p>
      )}
      {children}
    </div>
  );
}
