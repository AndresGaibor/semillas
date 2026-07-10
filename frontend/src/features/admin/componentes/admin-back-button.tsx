import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-6">
      <ArrowLeft size={16} /> Volver
    </button>
  );
}
