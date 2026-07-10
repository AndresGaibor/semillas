import { User } from "lucide-react";
import { CampoFormulario } from "@/componentes/ui/campo-formulario";
import { Input } from "@/componentes/ui/input-base";

interface NicknameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function NicknameField({ value, onChange }: NicknameFieldProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 text-lg font-bold text-[#1A1A1A] mb-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7E57C2] text-white text-sm font-bold flex-shrink-0">
          1
        </span>
        ¿Cómo quieres que te llamemos?
      </div>
      <CampoFormulario>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-[#7E57C2] pointer-events-none flex-shrink-0">
            <User size={20} />
          </span>
          <Input
            type="text"
            maxLength={20}
            placeholder="Escribe tu apodo"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            clase="border-[1.5px] border-[#e5e7eb] rounded-xl text-base text-[#1A1A1A] bg-white pl-12 pr-4 py-4 focus:border-[#2E9E5B] focus:ring-[#2E9E5B]/15"
          />
        </div>
      </CampoFormulario>
      <div className="text-right text-xs text-[#9E9E9E] mt-1 font-medium">
        Máx. 20 caracteres
      </div>
    </div>
  );
}
