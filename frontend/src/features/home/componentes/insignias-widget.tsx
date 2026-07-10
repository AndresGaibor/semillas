import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/componentes/ui/card-base";
import { AvatarCircular } from "@/componentes/ui/avatar-circular";

export interface Insignia {
  id: string;
  nombre: string;
  imagenUrl: string;
}

export interface InsigniasWidgetProps {
  insignias: Insignia[];
}

export const InsigniasWidget: React.FC<InsigniasWidgetProps> = ({ insignias }) => {
  const tieneInsignias = insignias && insignias.length > 0;

  return (
    <Card sombra="sm" hoverEffect="none" className="p-5">
      {tieneInsignias && (
        <CardHeader className="p-0 mb-4">
          <CardTitle>Insignias</CardTitle>
        </CardHeader>
      )}

      {tieneInsignias ? (
        <div className="flex gap-3 flex-wrap">
          {insignias.map((insignia) => (
            <div key={insignia.id} className="flex flex-col items-center w-[60px]">
              <AvatarCircular src={insignia.imagenUrl} alt={insignia.nombre} tamano="xs" />
              <span className="text-[0.65rem] text-center mt-1 text-slate-400 truncate w-full">
                {insignia.nombre}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-sm">
          <p>Aún no tienes insignias.</p>
        </div>
      )}
    </Card>
  );
};
