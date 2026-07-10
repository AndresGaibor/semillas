import { CheckCircle2, Grip, RefreshCcw, Sparkles, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type JSX } from "react";

import { Boton } from "@/componentes/ui/boton";

import {
  agregarRelacionCompletada,
  mezclarRelacionesConceptos,
  relacionesCompletadas,
  validarIntentoRelacion,
  type ParConcepto,
  type RelacionConcepto,
} from "./relacionar-conceptos.utils";

export type RelacionarConceptosProps = {
  pares: ParConcepto[];
  titulo?: string;
  descripcion?: string;
  xp?: number;
  mostrarPistas?: boolean;
  onComplete?: () => void;
};

type FeedbackRelacion = {
  tipo: "correcto" | "incorrecto";
  mensaje: string;
} | null;

export function RelacionarConceptos({
  pares,
  titulo = "Relaciona los conceptos",
  descripcion = "Une cada concepto con la relacion correcta.",
  xp,
  mostrarPistas = false,
  onComplete,
}: RelacionarConceptosProps): JSX.Element {
  const conceptos = useMemo(() => [...pares], [pares]);
  const [relaciones, setRelaciones] = useState<RelacionConcepto[]>(() => mezclarRelacionesConceptos(pares));
  const [conceptoSeleccionadoId, setConceptoSeleccionadoId] = useState<string | null>(null);
  const [conceptoArrastradoId, setConceptoArrastradoId] = useState<string | null>(null);
  const [completadas, setCompletadas] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRelacion>(null);
  const completoNotificado = useRef(false);

  const estaCompletada = relacionesCompletadas(pares, completadas);

  useEffect(() => {
    setRelaciones(mezclarRelacionesConceptos(pares));
    setConceptoSeleccionadoId(null);
    setConceptoArrastradoId(null);
    setCompletadas([]);
    setFeedback(null);
    completoNotificado.current = false;
  }, [pares]);

  useEffect(() => {
    if (!estaCompletada || completoNotificado.current) {
      return;
    }

    completoNotificado.current = true;
    void import("@/lib/audio")
      .then(({ playSound }) => Promise.resolve(playSound("acertado")))
      .catch(() => undefined);
    onComplete?.();
  }, [estaCompletada, onComplete]);

  function reiniciarActividad() {
    setRelaciones(mezclarRelacionesConceptos(pares));
    setConceptoSeleccionadoId(null);
    setConceptoArrastradoId(null);
    setCompletadas([]);
    setFeedback(null);
  }

  function intentarRelacion(conceptoId: string, relacionId: string) {
    const resultado = validarIntentoRelacion(conceptoId, relacionId);

    if (resultado.correcto) {
      setCompletadas((completadasActuales) => agregarRelacionCompletada(completadasActuales, resultado.conceptoId));
      setFeedback({ tipo: "correcto", mensaje: "Correcto. Encontraste la pareja." });
    } else {
      setFeedback({ tipo: "incorrecto", mensaje: "Intenta otra vez. Esa no es la pareja." });
    }

    setConceptoSeleccionadoId(null);
    setConceptoArrastradoId(null);
  }

  function seleccionarConcepto(id: string) {
    if (completadas.includes(id)) {
      return;
    }

    setConceptoSeleccionadoId((seleccionActual) => (seleccionActual === id ? null : id));
    setFeedback(null);
  }

  function seleccionarRelacion(relacion: RelacionConcepto) {
    if (completadas.includes(relacion.id) || conceptoSeleccionadoId === null) {
      return;
    }

    intentarRelacion(conceptoSeleccionadoId, relacion.id);
  }

  function soltarSobreRelacion(relacion: RelacionConcepto) {
    if (conceptoArrastradoId !== null && !completadas.includes(relacion.id)) {
      intentarRelacion(conceptoArrastradoId, relacion.id);
      return;
    }

    setConceptoArrastradoId(null);
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-[2rem] bg-[#F7F4EC] p-4 text-[#123B2C] shadow-[0_18px_50px_rgba(18,59,44,0.12)] sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#2E9E5B]">
            <Sparkles className="size-3" aria-hidden="true" /> Actividad
          </p>
          <h2 className="text-2xl font-black leading-tight text-[#123B2C]">{titulo}</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#49695D]">{descripcion}</p>
        </div>

        {typeof xp === "number" && (
          <span className="shrink-0 rounded-2xl bg-[#F4B740] px-3 py-2 text-sm font-black text-[#123B2C] shadow-sm">
            {xp} XP
          </span>
        )}
      </header>

      <p id="relacionar-conceptos-ayuda" className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-[#49695D]">
        Toca o arrastra un concepto hacia su pareja.
      </p>

      <div role="group" aria-describedby="relacionar-conceptos-ayuda" className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="px-1 text-xs font-black uppercase tracking-[0.14em] text-[#2E9E5B]">Conceptos</p>
          {conceptos.map((par) => {
            const completada = completadas.includes(par.id);
            const seleccionada = conceptoSeleccionadoId === par.id;

            return (
              <button
                key={par.id}
                type="button"
                draggable={!completada}
                disabled={completada}
                onClick={() => seleccionarConcepto(par.id)}
                onDragStart={() => setConceptoArrastradoId(par.id)}
                onDragEnd={() => setConceptoArrastradoId(null)}
                aria-label={`Concepto ${par.concepto}`}
                aria-pressed={seleccionada}
                className={[
                  "touch-manipulation rounded-3xl border-2 bg-white px-4 py-4 text-left text-sm font-black shadow-sm transition duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3D8BD4]",
                  completada ? "border-[#86EFAC] text-[#166534] opacity-80" : "border-white text-[#123B2C] hover:-translate-y-0.5 active:scale-[0.98]",
                  seleccionada ? "border-[#3D8BD4] ring-4 ring-[#3D8BD4]/25" : "",
                ].join(" ")}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{par.concepto}</span>
                  {completada ? <CheckCircle2 className="size-5 text-[#2E9E5B]" aria-hidden="true" /> : <Grip className="size-5 text-[#6E7F76]" aria-hidden="true" />}
                </span>
                {mostrarPistas && par.pista && <span className="mt-2 block text-xs font-bold leading-5 text-[#6E7F76]">Pista: {par.pista}</span>}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <p className="px-1 text-xs font-black uppercase tracking-[0.14em] text-[#EE6C4D]">Relaciones</p>
          {relaciones.map((relacion) => {
            const completada = completadas.includes(relacion.id);

            return (
              <button
                key={relacion.id}
                type="button"
                disabled={completada}
                onClick={() => seleccionarRelacion(relacion)}
                onDragOver={(evento) => evento.preventDefault()}
                onDrop={() => soltarSobreRelacion(relacion)}
                aria-label={`Relacion ${relacion.texto}`}
                className={[
                  "min-h-16 touch-manipulation rounded-3xl border-2 bg-white px-4 py-4 text-left text-sm font-black shadow-sm transition duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3D8BD4]",
                  completada ? "border-[#86EFAC] text-[#166534] opacity-80" : "border-white text-[#123B2C] hover:-translate-y-0.5 active:scale-[0.98]",
                ].join(" ")}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{relacion.texto}</span>
                  {completada && <CheckCircle2 className="size-5 text-[#2E9E5B]" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={[
            "flex items-center gap-3 rounded-3xl px-4 py-3",
            feedback.tipo === "correcto" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]",
          ].join(" ")}
        >
          {feedback.tipo === "correcto" ? <CheckCircle2 className="size-6 shrink-0" aria-hidden="true" /> : <XCircle className="size-6 shrink-0" aria-hidden="true" />}
          <p className="text-sm font-black">{feedback.mensaje}</p>
        </div>
      )}

      {estaCompletada && (
        <div className="flex items-center gap-3 rounded-3xl bg-[#DCFCE7] px-4 py-3 text-[#166534]">
          <CheckCircle2 className="size-6 shrink-0" aria-hidden="true" />
          <p className="text-sm font-black">Excelente. Relacionaste todos los conceptos.</p>
        </div>
      )}

      <Boton variante="exito" tamano="grande" anchoCompleto iconoIzquierdo={<RefreshCcw className="size-5" />} onClick={reiniciarActividad}>
        Intentar otra vez
      </Boton>
    </section>
  );
}
