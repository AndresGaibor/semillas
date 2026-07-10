import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { AlertaCompletado } from "@/componentes/ui/alerta-completado";
import {
  calcularFondoPieza,
  crearPiezasRompecabezas,
  intercambiarPiezas,
  mezclarPiezasRompecabezas,
  normalizarDimensionesRompecabezas,
  rompecabezasCompletado,
  type PiezaRompecabezas,
} from "./rompecabezas.utils";
import { ImagenAmpliadaModal } from "./ImagenAmpliadaModal";
import { VistaReferencia } from "./VistaReferencia";
import { PiezaRompecabezasBtn } from "./PiezaRompecabezasBtn";

export type RompecabezasProps = {
  imagen: string;
  filas?: number;
  columnas?: number;
  retroalimentacion?: string;
  mostrarVistaReferencia?: boolean;
  onComplete?: () => void;
};

function ordenarPorPosicionActual(piezas: PiezaRompecabezas[]): PiezaRompecabezas[] {
  return [...piezas].sort((a, b) => a.posicionActual - b.posicionActual);
}

export function Rompecabezas({
  imagen,
  filas = 3,
  columnas = 3,
  retroalimentacion,
  mostrarVistaReferencia = true,
  onComplete,
}: RompecabezasProps): JSX.Element {
  const dimensiones = useMemo(() => normalizarDimensionesRompecabezas(filas, columnas), [filas, columnas]);
  const piezasBase = useMemo(() => crearPiezasRompecabezas(dimensiones.filas, dimensiones.columnas), [dimensiones]);
  const [piezas, setPiezas] = useState(() => mezclarPiezasRompecabezas(piezasBase));
  const [piezaSeleccionadaId, setPiezaSeleccionadaId] = useState<number | null>(null);
  const [piezaArrastradaId, setPiezaArrastradaId] = useState<number | null>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(false);
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
    <div className="w-full max-w-4xl mx-auto py-2 animate-in fade-in zoom-in-95">

      <ImagenAmpliadaModal
        imagen={imagen}
        estaAbierta={imagenAmpliada}
        onCerrar={() => setImagenAmpliada(false)}
      />

      {!estaCompletado ? (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center w-full">

          <div className="w-full md:w-1/3 flex flex-col justify-center gap-6">
            {mostrarVistaReferencia && (
              <VistaReferencia
                imagen={imagen}
                onAmpliar={() => setImagenAmpliada(true)}
              />
            )}

            <div className="w-full text-center">
              <p id="rompecabezas-ayuda" className="text-sm font-medium text-slate-600 bg-white inline-block px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                Toca o arrastra dos piezas para intercambiarlas.
              </p>
            </div>
          </div>

          <div className="w-full md:w-2/3 max-w-md mx-auto">
            <div
              role="group"
              className="grid aspect-square w-full overflow-hidden rounded-[1.75rem] border-4 border-slate-200 bg-slate-100 shadow-inner"
              style={{ gridTemplateColumns: `repeat(${dimensiones.columnas}, 1fr)`, gridTemplateRows: `repeat(${dimensiones.filas}, 1fr)` }}
              aria-label={`Rompecabezas de ${dimensiones.filas} por ${dimensiones.columnas}`}
              aria-describedby="rompecabezas-ayuda"
            >
              {ordenarPorPosicionActual(piezas).map((pieza) => {
                const fondo = calcularFondoPieza(pieza.posicionCorrecta, dimensiones.filas, dimensiones.columnas);
                const seleccionada = piezaSeleccionadaId === pieza.id;

                return (
                  <PiezaRompecabezasBtn
                    key={pieza.id}
                    pieza={pieza}
                    imagen={imagen}
                    totalPiezas={totalPiezas}
                    seleccionada={seleccionada}
                    fondo={fondo}
                    onSeleccionar={seleccionarPieza}
                    onIniciarArrastre={iniciarArrastre}
                    onSoltar={soltarSobrePieza}
                    onArrastreFinalizado={() => setPiezaArrastradaId(null)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <AlertaCompletado
          clase="mt-4"
          mensaje={retroalimentacion || "Armaste la imagen correctamente."}
        />
      )}
    </div>
  );
}
