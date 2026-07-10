import { Card } from "@/componentes/ui/card-base";
import { TarjetaMiembro } from "./tarjeta-miembro";

type MiembroRanking = {
  posicion: number;
  nombre: string;
  nivel: string;
  xpSemana: number;
  contribuciones: number;
  avatarIndex: string;
};

type PropsTablaRanking = {
  miembros: MiembroRanking[];
  onVerCompleto: () => void;
};

export function TablaRanking({ miembros, onVerCompleto }: PropsTablaRanking) {
  return (
    <Card sombra="sm" className="p-6 flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-black text-slate-800">Ranking de miembros esta semana</h3>
        <button
          onClick={onVerCompleto}
          className="bg-transparent border-0 p-0 text-xs font-bold text-violet-600 hover:underline cursor-pointer"
        >
          Ver ranking completo
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
          <span className="col-span-2 text-center">Posición</span>
          <span className="col-span-4 text-left">Miembro</span>
          <span className="col-span-3 text-center">XP esta semana</span>
          <span className="col-span-3 text-center">Contribuciones</span>
        </div>

        {miembros.map((m) => (
          <TarjetaMiembro
            key={m.posicion}
            posicion={m.posicion}
            nombre={m.nombre}
            nivel={m.nivel}
            xpSemana={m.xpSemana}
            contribuciones={m.contribuciones}
            avatarIndex={m.avatarIndex}
          />
        ))}
      </div>
    </Card>
  );
}

export type { MiembroRanking };
