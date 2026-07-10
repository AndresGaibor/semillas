import { Eye, Grip, X } from "lucide-react";
import { AlertaCompletado } from "@/componentes/ui/alerta-completado";
import { useEffect, useMemo, useRef, useState, type JSX } from "react";

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
      
      {/* Modal de Imagen Ampliada */}
      {imagenAmpliada && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setImagenAmpliada(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 md:-right-12 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
              onClick={() => setImagenAmpliada(false)}
            >
              <X size={28} />
            </button>
            <img 
              src={imagen} 
              alt="Referencia ampliada" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
            />
          </div>
        </div>
      )}

      {!estaCompletado ? (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center w-full">
          
          {/* Columna Izquierda */}
          <div className="w-full md:w-1/3 flex flex-col justify-center gap-6">
            {mostrarVistaReferencia && (
              <div 
                className="flex flex-col items-center gap-3 bg-indigo-50 border-2 border-indigo-200 text-indigo-800 rounded-2xl p-4 shadow-sm w-full cursor-pointer hover:bg-indigo-100 transition-colors"
                onClick={() => setImagenAmpliada(true)}
              >
                <div className="relative group w-full">
                  <img src={imagen} alt="Referencia" className="w-full h-auto aspect-video rounded-xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-indigo-900/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="text-center w-full">
                  <p className="font-bold text-indigo-900 flex items-center justify-center gap-1">
                    Imagen completa
                  </p>
                  <p className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full inline-block mt-1">Toca para ampliar</p>
                </div>
              </div>
            )}

            <div className="w-full text-center">
              <p id="rompecabezas-ayuda" className="text-sm font-medium text-slate-600 bg-white inline-block px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                Toca o arrastra dos piezas para intercambiarlas.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Rompecabezas Grid */}
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
