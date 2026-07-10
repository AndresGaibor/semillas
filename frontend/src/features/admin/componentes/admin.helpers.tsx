import { Boton } from "@/componentes/ui/boton";

export type SendaIconConfig = {
  icon: string;
  color: string;
};

export const getSendaIcon = (s: string, icono?: string): SendaIconConfig => {
  if (icono === "fa-crown") return { icon: "fa-crown", color: "text-[#3D8BD4] bg-[#3D8BD4]/10" };
  if (icono === "fa-heart") return { icon: "fa-heart", color: "text-[#6C3AED] bg-[#6C3AED]/10" };
  if (icono === "fa-flame") return { icon: "fa-flame", color: "text-[#F97316] bg-[#F97316]/10" };
  const lower = s.toLowerCase();
  if (lower.includes("padre")) return { icon: "fa-crown", color: "text-[#3D8BD4] bg-[#3D8BD4]/10" };
  if (lower.includes("hijo")) return { icon: "fa-heart", color: "text-[#6C3AED] bg-[#6C3AED]/10" };
  if (lower.includes("espíritu") || lower.includes("espiritu")) return { icon: "fa-flame", color: "text-[#F97316] bg-[#F97316]/10" };
  return { icon: "fa-star", color: "text-[#17A398] bg-[#17A398]/10" };
};

export const BOTON_ACCION_CLS = "w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer";

export type BotonAccionProps = {
  onClick?: () => void;
  title: string;
  icon: string;
  className?: string;
};

export function BotonAccion({ onClick, title, icon, className = BOTON_ACCION_CLS }: BotonAccionProps) {
  return (
    <Boton type="button" onClick={onClick} title={title} aria-label={title} className={className} variante="texto" tamano="iconoPequeno">
      <i className={`fa-solid ${icon} text-xs`} aria-hidden="true" />
    </Boton>
  );
}

export const CELDA_CHECKBOX_CLS = "py-4 px-2 text-center";

export const CheckboxCell = ({ stopPropagation = true, ariaLabel }: { stopPropagation?: boolean; ariaLabel: string }) => (
  <td className={CELDA_CHECKBOX_CLS} onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}>
    <input type="checkbox" aria-label={ariaLabel} className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />
  </td>
);

export const FILA_HOVER_CLS = "hover:bg-slate-50/40 transition-colors group cursor-pointer";
