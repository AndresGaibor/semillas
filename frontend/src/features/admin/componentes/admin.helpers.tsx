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

export type MenuAccionItem = {
  label: string;
  icon: string;
  iconColor?: string;
  onClick: () => void;
  className?: string;
};

export type MenuAccionesProps = {
  items: MenuAccionItem[];
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function MenuAcciones({ items, isActive, onToggle, onClose }: MenuAccionesProps) {
  return (
    <div className="relative">
      <Boton
        type="button"
        onClick={onToggle}
        className={BOTON_ACCION_CLS}
        variante="texto"
        tamano="iconoPequeno"
      >
        <i className="fa-solid fa-ellipsis-vertical text-xs" />
      </Boton>

      {isActive && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute right-0 z-20 mt-1.5 w-40 rounded-xl border border-slate-100 bg-white py-1.5 text-left shadow-lg">
            {items.map((item, idx) => (
              <Boton
                key={idx}
                type="button"
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={item.className ?? "flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-neutro-oscuro-max transition-colors hover:bg-slate-50"}
                variante="texto"
              >
                <i className={`fa-solid ${item.icon} w-4 text-center ${item.iconColor ?? "text-slate-400"}`} />
                {item.label}
              </Boton>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export const CELDA_CHECKBOX_CLS = "py-4 px-2 text-center";
export const CELDA_ACCION_CLS = "py-4 px-4 text-right";

export const CheckboxCell = ({ stopPropagation = true, ariaLabel }: { stopPropagation?: boolean; ariaLabel: string }) => (
  <td className={CELDA_CHECKBOX_CLS} onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}>
    <input type="checkbox" aria-label={ariaLabel} className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />
  </td>
);

export const FILA_HOVER_CLS = "hover:bg-slate-50/40 transition-colors group cursor-pointer";

export const normalizarEstado = (estado: string): string => {
  return estado.trim().toLowerCase();
};
