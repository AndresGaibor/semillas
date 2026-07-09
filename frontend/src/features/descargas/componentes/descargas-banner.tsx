import * as React from "react";
import { Download, X } from "lucide-react";

export interface DescargasBannerProps {
  visible: boolean;
  onCerrar: () => void;
}

export const DescargasBanner: React.FC<DescargasBannerProps> = ({ visible, onCerrar }) => {
  if (!visible) return null;

  return (
    <div className="bg-[#EDE7F6] border border-[#D1C4E9] rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#7E57C2]/10 flex items-center justify-center text-[#7E57C2] flex-shrink-0">
          <Download size={24} />
        </div>
        <div className="text-left">
          <h3 className="text-base font-black text-[#512DA8] mb-0.5">
            Aprende donde estés
          </h3>
          <p className="text-sm text-[#7E57C2] leading-normal font-semibold">
            Descarga historias, actividades y materiales para disfrutarlos sin internet.
          </p>
        </div>
      </div>
      <button
        onClick={onCerrar}
        className="bg-transparent border-0 text-[#7E57C2] hover:text-[#512DA8] p-1.5 cursor-pointer rounded-full hover:bg-[#D1C4E9]/30 transition-colors"
        aria-label="Cerrar banner"
      >
        <X size={20} />
      </button>
    </div>
  );
};
