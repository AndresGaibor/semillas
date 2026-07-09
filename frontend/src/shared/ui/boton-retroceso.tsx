import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type BotonRetrocesoProps = {
  onClick: () => void;
  children?: ReactNode;
};

export function BotonRetroceso({ onClick, children = "Volver" }: BotonRetrocesoProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4"
    >
      <ArrowLeft size={16} /> {children}
    </button>
  );
}
