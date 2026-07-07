import * as React from "react";
import { unirClases } from "@/lib/utilidades";

// ── 01. Barra Lineal de Progreso ─────────────────────────────────────────────

export interface PropiedadesBarraProgreso extends React.HTMLAttributes<HTMLDivElement> {
  valor: number; // 0 a 100 o valor actual
  maximo?: number; // si se usa formato "12/20"
  mostrarEtiquetas?: boolean;
  etiqueta?: string;
  color?: "morado" | "verde" | "azul" | "naranja";
  clase?: string;
}

export const BarraProgreso: React.FC<PropiedadesBarraProgreso> = ({
  valor,
  maximo,
  mostrarEtiquetas = true,
  etiqueta,
  color = "morado",
  clase,
  className,
  ...propiedades
}) => {
  const porcentaje = maximo ? Math.min((valor / maximo) * 100, 100) : Math.min(Math.max(valor, 0), 100);

  const coloresBarraHex = {
    morado: "#6C3AED",
    verde: "#2E9E5B",
    azul: "#3D8BD4",
    naranja: "#EE6C4D",
  };

  return (
    <div className={unirClases("w-full flex flex-col gap-1.5", className, clase)} {...propiedades}>
      {mostrarEtiquetas && (
        <div className="flex justify-between items-center text-[11px] font-bold text-gray-700">
          <span>{etiqueta}</span>
          <span className="tabular-nums">{maximo ? `${valor}/${maximo}` : `${Math.round(porcentaje)}%`}</span>
        </div>
      )}
      {/* Background Track with inline fallback style for 100% rendering safety */}
      <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9", height: "8px" }}>
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${porcentaje}%`, backgroundColor: coloresBarraHex[color], height: "100%" }}
        />
      </div>
    </div>
  );
};

// ── 02. Progreso Circular ────────────────────────────────────────────────────

export interface PropiedadesProgresoCircular extends React.HTMLAttributes<HTMLDivElement> {
  porcentaje: number;
  etiqueta: string;
  color?: "morado" | "verde" | "naranja" | "azul";
  tamano?: number;
  clase?: string;
}

export const ProgresoCircular: React.FC<PropiedadesProgresoCircular> = ({
  porcentaje,
  etiqueta,
  color = "morado",
  tamano = 64,
  clase,
  className,
  ...propiedades
}) => {
  const radio = 24;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;

  const coloresCirculoHex = {
    morado: "#6C3AED",
    verde: "#2E9E5B",
    naranja: "#EE6C4D",
    azul: "#3D8BD4",
  };

  return (
    <div className={unirClases("flex flex-col items-center gap-1.5", className, clase)} {...propiedades}>
      <div className="relative" style={{ width: tamano, height: tamano }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
          {/* Background Circle with explicit SVG stroke attribute for bulletproof rendering */}
          <circle
            cx="30"
            cy="30"
            r={radio}
            stroke="#F1F5F9"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Progress Circle with explicit SVG stroke attribute */}
          <circle
            cx="30"
            cy="30"
            r={radio}
            stroke={coloresCirculoHex[color]}
            strokeWidth="5"
            strokeDasharray={circunferencia}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
          />
        </svg>
        {/* Central percentage text */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {porcentaje}%
        </div>
      </div>
      <span className="text-[11px] font-bold text-gray-500">{etiqueta}</span>
    </div>
  );
};

// ── 03. Stepper CRECER ───────────────────────────────────────────────────────

export interface PasoStepper {
  numero: number;
  nombre: string;
  estado: "completado" | "actual" | "pendiente";
  colorHex: string;
}

export interface PropiedadesStepper extends React.HTMLAttributes<HTMLDivElement> {
  pasos: PasoStepper[];
  clase?: string;
}

export const StepperCRECER: React.FC<PropiedadesStepper> = ({ pasos, clase, className, ...propiedades }) => {
  return (
    <div className={unirClases("w-full flex flex-col gap-6", className, clase)} {...propiedades}>
      <div className="relative flex justify-between items-center w-full">
        {/* Background connector line - moved in front of page stack but behind circles via DOM flow and stacking */}
        <div className="absolute left-0 right-0 top-5 h-[3px] bg-[#E2E8F0] z-0" style={{ position: "absolute", left: 0, right: 0, top: "20px", height: "3px", backgroundColor: "#E2E8F0", zIndex: 0 }} />

        {pasos.map((paso, idx) => {
          let estiloBurbuja = {};
          if (paso.estado === "completado" || paso.estado === "actual") {
            estiloBurbuja = {
              backgroundColor: paso.colorHex,
              borderColor: paso.colorHex,
              color: "#FFFFFF",
              zIndex: 10,
            };
          } else {
            estiloBurbuja = {
              backgroundColor: "#FFFFFF",
              borderColor: "#E2E8F0",
              color: "#94A3B8",
              zIndex: 10,
            };
          }

          return (
            <div key={paso.numero} className="flex flex-col items-center flex-1 relative z-10" style={{ position: "relative", zIndex: 10 }}>
              {/* Step Circle Bubble */}
              <div
                style={estiloBurbuja}
                className={unirClases(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300",
                  paso.estado === "actual" ? "ring-4 ring-offset-2" : ""
                )}
              >
                {paso.numero}
              </div>

              {/* Step Label */}
              <span className="absolute top-12 text-[11px] font-bold text-gray-800 whitespace-nowrap" style={{ position: "absolute", top: "48px" }}>
                {paso.nombre}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stepper Legend */}
      <div className="flex justify-center items-center gap-6 mt-8 text-xs font-bold text-gray-600">
        <div className="flex items-center gap-2">
          <span className="size-3.5 rounded-full bg-[#6C3AED]" style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#6C3AED" }} />
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3.5 rounded-full border-2 border-[#6C3AED] bg-white" style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid #6C3AED", backgroundColor: "#FFFFFF" }} />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3.5 rounded-full bg-[#E2E8F0]" style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#E2E8F0" }} />
          <span>Pendiente</span>
        </div>
      </div>
    </div>
  );
};
