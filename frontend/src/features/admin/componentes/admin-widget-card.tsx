import type { ReactNode } from "react";
import { Card } from "@/componentes/ui/card-base";

type AdminWidgetCardProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  padding?: "sm" | "md" | "lg";
  sombra?: "sm" | "md" | "lg";
  hoverEffect?: "none" | "elevate";
  className?: string;
};

const PADDING_MAP = {
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

export function AdminWidgetCard({
  title,
  subtitle,
  badge,
  children,
  footer,
  padding = "md",
  sombra = "sm",
  hoverEffect = "none",
  className = "",
}: AdminWidgetCardProps) {
  return (
    <Card sombra={sombra} hoverEffect={hoverEffect} className={`flex flex-col text-left ${PADDING_MAP[padding]} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">{title}</h3>
          {subtitle && (
            <span className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider select-none">
              {subtitle}
            </span>
          )}
        </div>
        {badge && <div className="shrink-0 pt-0.5">{badge}</div>}
      </div>
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-slate-100">{footer}</div>}
    </Card>
  );
}
