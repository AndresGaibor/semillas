import * as React from "react";
import { HardDrive, Settings } from "lucide-react";
import { BarraProgreso } from "@/componentes/ui/barra-progreso";
import { Boton } from "@/componentes/ui/boton";

export interface StorageWidgetProps {
  usedMB: number;
  totalMB: number;
  percentage: number;
  onGestionarClick?: () => void;
}

export const StorageWidget: React.FC<StorageWidgetProps> = ({
  usedMB,
  totalMB,
  percentage,
  onGestionarClick,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
          <HardDrive size={18} />
        </div>
        <div className="text-left flex-1 min-w-0">
          <span className="text-sm font-bold text-slate-800 block mb-0.5">
            Almacenamiento usado: {usedMB} MB de {totalMB} MB
          </span>
          <div className="w-full sm:w-80">
            <BarraProgreso valor={percentage} color="morado" mostrarEtiquetas={false} />
          </div>
        </div>
      </div>

      <Boton
        onClick={onGestionarClick}
        variante="violetaContorno"
        className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer shadow-sm flex-shrink-0"
      >
        <Settings size={14} />
        Gestionar descargas
      </Boton>
    </div>
  );
};
