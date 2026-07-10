import * as React from "react";
import { Plus } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { Boton } from "@/componentes/ui/boton";

export interface UnirseClubFormProps {
  joinCode: string;
  onCodeChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const UnirseClubForm: React.FC<UnirseClubFormProps> = ({
  joinCode,
  onCodeChange,
  onSubmit,
}) => {
  return (
    <Card sombra="sm" className="p-6 flex flex-col justify-between min-h-[220px]">
      <div className="text-left w-full">
        <h3 className="text-base font-black text-slate-800 mb-1">Unirse a otro club</h3>
        <p className="text-xs text-slate-400 leading-normal font-semibold">
          ¿Tienes un código de invitación? Únete a otro club y sigue aprendiendo.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4 w-full">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Ingresa el código del club"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-colors pr-12 text-slate-700"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Boton
              type="submit"
              variante="violeta"
              tamano="icono"
              disabled={!joinCode.trim()}
              className="bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white border-0"
            >
              <Plus size={16} />
            </Boton>
          </div>
        </div>

        <Boton
          type="submit"
          variante="violeta"
          disabled={!joinCode.trim()}
          className="w-full py-3.5 px-4 rounded-xl text-xs font-bold shadow-sm"
        >
          Unirse al club
        </Boton>
      </form>
    </Card>
  );
};
