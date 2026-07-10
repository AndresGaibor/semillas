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
    <Card className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[220px]">
      <div className="text-left w-full">
        <h3 className="text-base font-black text-slate-800 mb-1">Unirse a otro club</h3>
        <p className="text-xs text-slate-400 leading-normal font-semibold">
          ¿Tienes un código de invitación? Únete a otro club y sigue aprendiendo.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4 w-full">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Ingresa el código del club"
            className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-sm font-semibold outline-none focus:border-[#7E57C2] transition-colors pr-12 text-slate-700"
          />
          <Boton
            type="submit"
            disabled={!joinCode.trim()}
            className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !w-8 !h-8 !rounded-lg !bg-[#7E57C2]/10 hover:!bg-[#7E57C2] !text-[#7E57C2] hover:!text-white !border-0"
          >
            <Plus size={16} />
          </Boton>
        </div>

        <Boton
          type="submit"
          disabled={!joinCode.trim()}
          className="!w-full !bg-[#7E57C2] hover:!bg-[#5B21B6] disabled:!bg-slate-200 disabled:!text-slate-400 disabled:!cursor-not-allowed !text-white !border-0 !py-3.5 !px-4 !rounded-xl !text-xs !font-bold !shadow-sm"
        >
          Unirse al club
        </Boton>
      </form>
    </Card>
  );
};
