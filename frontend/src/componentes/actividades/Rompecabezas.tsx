import { CheckCircle2, Eye, Grip, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type JSX } from "react";

import { Boton } from "@/componentes/ui/boton";

import {
  calcularFondoPieza,
  crearPiezasRompecabezas,
  intercambiarPiezas,
  mezclarPiezasRompecabezas,
  normalizarDimensionesRompecabezas,
  rompecabezasCompletado,
  type PiezaRompecabezas,
} from "./rompecabezas.utils";

export type RompecabezasProps = {
  imagen: string;
  titulo?: string;
  descripcion?: string;
  filas?: number;
  columnas?: number;
  xp?: number;
  mostrarVistaReferencia?: boolean;
  onComplete?: () => void;
};

function ordenarPorPosicionActual(piezas: PiezaRompecabezas[]): PiezaRompecabezas[] {
  return [...piezas].sort((a, b) => a.posicionActual - b.posicionActual);
}

export function Rompecabezas({
  imagen,
  titulo = "Arma el rompecabezas",
  descripcion = "Toca o arrastra dos piezas para intercambiarlas.",
  filas = 3,
  columnas = 3,
  xp,
  mostrarVistaReferencia = true,
  onComplete,
}: RompecabezasProps): JSX.Element {
  const dimensiones = useMemo(() => normalizarDimensionesRompecabezas(filas, columnas), [filas, columnas]);
  const piezasBase = useMemo(() => crearPiezasRompecabezas(dimensiones.filas, dimensiones.columnas), [dimensiones]);
  const [piezas, setPiezas] = useState(() => mezclarPiezasRompecabezas(piezasBase));
  const [piezaSeleccionadaId, setPiezaSeleccionadaId] = useState<number | null>(null);
  const [piezaArrastradaId, setPiezaArrastradaId] = useState<number | null>(null);
  const completoNotificado = useRef(false);

  const totalPiezas = dimensiones.filas * dimensiones.columnas;
  const estaCompletado = rompecabezasCompletado(piezas);

  useEffect(() => {
    setPiezas(mezclarPiezasRompecabezas(piezasBase));
    setPiezaSeleccionadaId(null);
    completoNotificado.current = false;
  }, [piezasBase]);

  useEffect(() => {
    if (!estaCompletado || completoNotificado.current) {
      return;
    }

    completoNotificado.current = true;
    void import("@/lib/audio")
      .then(({ playSound }) => Promise.resolve(playSound("acertado")))
      .catch(() => undefined);
    onComplete?.();
  }, [estaCompletado, onComplete]);

  function mezclarOtraVez() {
    setPiezas((piezasActuales) => mezclarPiezasRompecabezas(piezasActuales));
    setPiezaSeleccionadaId(null);
    completoNotificado.current = false;
  }

  function intercambiarPorId(primeraId: number, segundaId: number) {
    setPiezas((piezasActuales) => intercambiarPiezas(piezasActuales, primeraId, segundaId));
  }

  function seleccionarPieza(id: number) {
    if (piezaSeleccionadaId === null) {
      setPiezaSeleccionadaId(id);
      return;
    }

    if (piezaSeleccionadaId === id) {
      setPiezaSeleccionadaId(null);
      return;
    }

    intercambiarPorId(piezaSeleccionadaId, id);
    setPiezaSeleccionadaId(null);
  }

  function iniciarArrastre(id: number) {
    setPiezaArrastradaId(id);
  }

  function soltarSobrePieza(id: number) {
    if (piezaArrastradaId !== null && piezaArrastradaId !== id) {
      intercambiarPorId(piezaArrastradaId, id);
    }

    setPiezaArrastradaId(null);
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

      {mostrarVistaReferencia && (
        <div className="flex items-center gap-3 rounded-3xl border border-[#E5DEC9] bg-white/80 p-3">
          <img src={imagen} alt="Vista de referencia del rompecabezas" className="size-16 rounded-2xl object-cover" />
          <div>
            <p className="flex items-center gap-1 text-sm font-black text-[#123B2C]">
              <Eye className="size-4" aria-hidden="true" /> Mira la imagen completa
            </p>
            <p className="text-xs font-semibold leading-5 text-[#6E7F76]">Usala como pista antes de ordenar las piezas.</p>
          </div>
        </div>
      )}

      <p id="rompecabezas-ayuda" className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-[#49695D]">
        Toca o arrastra dos piezas para intercambiarlas.
      </p>

      <div
        role="group"
        className="grid aspect-square w-full overflow-hidden rounded-[1.75rem] border-4 border-white bg-white shadow-[inset_0_0_0_1px_rgba(18,59,44,0.08),0_14px_32px_rgba(18,59,44,0.16)]"
        style={{ gridTemplateColumns: `repeat(${dimensiones.columnas}, 1fr)`, gridTemplateRows: `repeat(${dimensiones.filas}, 1fr)` }}
        aria-label={`Rompecabezas de ${dimensiones.filas} por ${dimensiones.columnas}`}
        aria-describedby="rompecabezas-ayuda"
      >
        {ordenarPorPosicionActual(piezas).map((pieza) => {
          const fondo = calcularFondoPieza(pieza.posicionCorrecta, dimensiones.filas, dimensiones.columnas);
          const seleccionada = piezaSeleccionadaId === pieza.id;

          return (
            <button
              key={pieza.id}
              type="button"
              draggable
              onClick={() => seleccionarPieza(pieza.id)}
              onDragStart={() => iniciarArrastre(pieza.id)}
              onDragOver={(evento) => evento.preventDefault()}
              onDrop={() => soltarSobrePieza(pieza.id)}
              onDragEnd={() => setPiezaArrastradaId(null)}
              aria-label={`Pieza ${pieza.id + 1} de ${totalPiezas}`}
              aria-pressed={seleccionada}
              className={[
                "relative touch-manipulation border border-white bg-cover bg-no-repeat transition duration-200 ease-out",
                "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3D8BD4]",
                seleccionada ? "z-10 scale-95 ring-4 ring-[#3D8BD4]" : "hover:scale-[0.98] active:scale-95",
              ].join(" ")}
              style={{ backgroundImage: `url(${imagen})`, backgroundSize: fondo.backgroundSize, backgroundPosition: fondo.backgroundPosition }}
            >
              <span className="sr-only">Toca o arrastra esta pieza para intercambiarla</span>
              {seleccionada && <Grip className="absolute right-2 top-2 size-5 rounded-full bg-white/90 p-1 text-[#3D8BD4]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {estaCompletado && (
        <div className="flex items-center gap-3 rounded-3xl bg-[#DCFCE7] px-4 py-3 text-[#166534]">
          <CheckCircle2 className="size-6 shrink-0" aria-hidden="true" />
          <p className="text-sm font-black">Excelente. Completaste el rompecabezas.</p>
        </div>
      )}

      <Boton variante="exito" tamano="grande" anchoCompleto iconoIzquierdo={<RotateCcw className="size-5" />} onClick={mezclarOtraVez}>
        Mezclar otra vez
      </Boton>
    </section>
  );
}
