import * as React from "react";
import { Bell } from "lucide-react";
import { unirClases } from "@/lib/utilidades";

export interface PropiedadesCampanaBadge extends React.HTMLAttributes<HTMLDivElement> {
  conteo: number;
  clase?: string;
}

export const CampanaBadge: React.FC<PropiedadesCampanaBadge> = ({
  conteo,
  clase,
  className,
  style,
  ...propiedades
}) => {
  return (
    <div
      className={unirClases("relative inline-flex items-center justify-center p-2 rounded-full border", className, clase)}
      style={{
        backgroundColor: "#FAF5FF",
        borderColor: "rgba(108, 93, 237, 0.2)",
        width: "36px",
        height: "36px",
        ...style
      }}
      {...propiedades}
    >
      <Bell className="size-4.5 text-[#6C3AED] stroke-[2.5]" />
      {conteo > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white shadow-sm ring-2 ring-white"
          style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}
        >
          {conteo}
        </span>
      )}
    </div>
  );
};
