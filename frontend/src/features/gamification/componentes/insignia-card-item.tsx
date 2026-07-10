import * as React from "react";
import { Lock, CheckCircle } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { EtiquetaPildora } from "@/componentes/ui/etiqueta-pildora";
import { AvatarCircular } from "@/componentes/ui/avatar-circular";

export interface InsigniaCardItemProps {
  codigo: string;
  nombre: string;
  descripcion: string;
  criterio: string;
  bono_xp: number;
  imagen: string;
  obtenido: boolean;
}

export const InsigniaCardItem: React.FC<InsigniaCardItemProps> = ({
  nombre,
  descripcion,
  criterio,
  bono_xp,
  imagen,
  obtenido,
}) => {
  return (
    <Card
      className={`p-0 overflow-hidden flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        !obtenido ? "opacity-75 bg-slate-50/50" : "bg-white"
      }`}
    >
      <div className="relative mt-6">
        <AvatarCircular
          src={imagen}
          alt={nombre}
          tamano="lg"
          clase={obtenido ? "" : "opacity-50"}
        />
        {!obtenido && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="text-slate-400" size={36} />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col items-center">
        <h3 className="mb-1 text-base font-extrabold leading-tight text-slate-800 sm:text-lg">
          {nombre}
        </h3>
        <p className="text-xs font-semibold text-violet-600 mb-3">
          +{bono_xp} XP • {criterio}
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
          {descripcion}
        </p>

        {obtenido ? (
          <EtiquetaPildora variante="exito">
            <CheckCircle size={10} /> Obtenida
          </EtiquetaPildora>
        ) : (
          <EtiquetaPildora variante="pendiente">En progreso</EtiquetaPildora>
        )}
      </div>
    </Card>
  );
};
