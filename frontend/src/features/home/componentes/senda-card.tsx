import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/componentes/ui/card-base";

export interface SendaCardProps {
  variante: "padre" | "hijo" | "espiritu";
  imagenUrl: string;
  label: string;
  titulo: string;
  descripcion: string;
  hash: string;
}

const VARIANTE_TAILWIND: Record<SendaCardProps["variante"], { bg: string; labelColor: string; titleColor: string }> = {
  padre: { bg: "bg-[#FEF6E1]", labelColor: "text-[#b58e20]", titleColor: "text-[#b58e20]" },
  hijo: { bg: "bg-[#EBF4FC]", labelColor: "text-[#1565C0]", titleColor: "text-[#1565C0]" },
  espiritu: { bg: "bg-[#F4EBFA]", labelColor: "text-[#8e44ad]", titleColor: "text-[#8e44ad]" },
};

export const SendaCard: React.FC<SendaCardProps> = ({
  variante,
  imagenUrl,
  label,
  titulo,
  descripcion,
  hash,
}) => {
  const { bg, labelColor, titleColor } = VARIANTE_TAILWIND[variante];

  return (
    <Card
      sombra="md"
      hoverEffect="elevate"
      className={`p-8 relative overflow-hidden ${bg}`}
    >
      <img
        src={imagenUrl}
        alt={`Senda del ${titulo}`}
        className="absolute left-[-15px] top-0 h-full object-cover z-0"
      />
      <div className="relative z-10 w-[55%]">
        <span className={`text-[0.85rem] font-bold block mb-1 ${labelColor}`}>{label}</span>
        <h3 className={`text-[1.8rem] font-extrabold mb-3 ${titleColor}`}>{titulo}</h3>
        <p className="text-[0.9rem] text-[#666] mb-6 max-w-[140px]">{descripcion}</p>
        <Link
          to="/app/sendas"
          hash={hash}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
    </Card>
  );
};
