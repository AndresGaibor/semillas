import { useState } from "react";
import type { CrearRetoClubAdminSolicitud } from "../../admin-clubes.api";

export function enviarRetoDesdeFormulario({
  clubId,
  nombre,
  objetivo,
  fechaFin,
  onCrear,
}: {
  clubId: string;
  nombre: string;
  objetivo: string;
  fechaFin: string;
  onCrear?: (clubId: string, datos: CrearRetoClubAdminSolicitud) => void;
}) {
  const fechaFinal = new Date(`${fechaFin}T23:59:59`);
  if (!fechaFin || Number.isNaN(fechaFinal.getTime())) {
    return "Ingresa una fecha de finalización válida.";
  }

  onCrear?.(clubId, {
    nombre,
    codigo_metrica: "xp_grupal",
    valor_objetivo: Number(objetivo),
    fecha_inicio: new Date().toISOString(),
    fecha_fin: fechaFinal.toISOString(),
  });
  return null;
}

interface FormularioCrearRetoProps {
  clubId: string;
  deshabilitado: boolean;
  onCrear?: (clubId: string, datos: CrearRetoClubAdminSolicitud) => void;
}

export function FormularioCrearReto({ clubId, deshabilitado, onCrear }: FormularioCrearRetoProps) {
  const [nombre, establecerNombre] = useState("");
  const [objetivo, establecerObjetivo] = useState("10");
  const [fechaFin, establecerFechaFin] = useState("");
  const [errorFechaFin, establecerErrorFechaFin] = useState<string>();

  const handleSubmit = (evento: React.FormEvent) => {
    evento.preventDefault();
    const error = enviarRetoDesdeFormulario({ clubId, nombre, objetivo, fechaFin, onCrear });
    establecerErrorFechaFin(error ?? undefined);
  };

  return (
    <form className="space-y-2 border-t border-slate-100 pt-4" onSubmit={handleSubmit}>
      <h4 className="font-bold text-slate-800">Crear reto</h4>

      <label className="sr-only" htmlFor={`reto-nombre-${clubId}`}>
        Nombre del reto
      </label>
      <input
        id={`reto-nombre-${clubId}`}
        required
        value={nombre}
        onChange={(evento) => establecerNombre(evento.target.value)}
        placeholder="Nombre del reto"
        disabled={deshabilitado}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-2 gap-2">
        <label className="sr-only" htmlFor={`reto-objetivo-${clubId}`}>
          Meta de XP
        </label>
        <input
          id={`reto-objetivo-${clubId}`}
          required
          min="1"
          type="number"
          value={objetivo}
          onChange={(evento) => establecerObjetivo(evento.target.value)}
          disabled={deshabilitado}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />

        <label className="sr-only" htmlFor={`reto-fin-${clubId}`}>
          Fecha de finalización
        </label>
        <input
          id={`reto-fin-${clubId}`}
          required
          type="date"
          value={fechaFin}
          onChange={(evento) => establecerFechaFin(evento.target.value)}
          disabled={deshabilitado}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      {errorFechaFin && (
        <p role="alert" className="text-sm font-semibold text-red-600">
          {errorFechaFin}
        </p>
      )}

      <button
        type="submit"
        disabled={deshabilitado}
        className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
      >
        Crear reto
      </button>
    </form>
  );
}
