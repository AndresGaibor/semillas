import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Bell } from "lucide-react";
import { unirClases } from "@/lib/utilidades";

// ── Mapeo de Colores de Diseño (Garantiza renderizado sin depender de compilación de clases arbitrarias) ──

export const MAPEO_COLORES_DISENO = {
  azul: {
    bg: "#EFF6FF",
    border: "#3D8BD4",
    text: "#3D8BD4",
  },
  morado: {
    bg: "#FAF5FF",
    border: "#6C3AED",
    text: "#6C3AED",
  },
  naranja: {
    bg: "#FFF8F1",
    border: "#EE6C4D",
    text: "#EE6C4D",
  },
  verde: {
    bg: "#F0FDF4",
    border: "#2E9E5B",
    text: "#2E9E5B",
  },
  amarillo: {
    bg: "#FFFDF5",
    border: "#F4B740",
    text: "#F4B740",
  },
  gris: {
    bg: "#F8FAFC",
    border: "#64748B",
    text: "#64748B",
  },
  rosa: {
    bg: "#FDF2F8",
    border: "#EC4899",
    text: "#EC4899",
  },
  moradoOscuro: {
    bg: "#6C3AED",
    border: "#6C3AED",
    text: "#FFFFFF",
  },
};

export type ColorDisenoKey = keyof typeof MAPEO_COLORES_DISENO;

// ── Variantes de Chip ────────────────────────────────────────────────────────

const variantesChip = cva(
  [
    "inline-flex items-center gap-2 font-bold transition-all duration-150 select-none whitespace-nowrap pl-1.5",
  ],
  {
    variants: {
      forma: {
        pildora: "rounded-full border pr-3.5 py-1 text-xs",
        badge: "rounded-lg border pr-2 py-0.5 text-[11px]",
        badgePildora: "rounded-full border pr-2.5 py-0.5 text-[11px]",
      },
    },
    defaultVariants: {
      forma: "pildora",
    },
  }
);

export interface PropiedadesChip
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof variantesChip> {
  color?: ColorDisenoKey;
  icono?: React.ReactNode;
  clase?: string;
}

export const Chip = React.forwardRef<HTMLDivElement, PropiedadesChip>(
  ({ color = "gris", forma, icono, clase, className, children, style, ...propiedades }, referencia) => {
    const configColor = MAPEO_COLORES_DISENO[color] || MAPEO_COLORES_DISENO.gris;

    return (
      <div
        ref={referencia}
        className={unirClases(variantesChip({ forma }), className, clase)}
        style={{
          backgroundColor: configColor.bg,
          borderColor: configColor.border,
          color: configColor.text,
          ...style,
        }}
        {...propiedades}
      >
        {icono && (
          <span
            className="flex items-center justify-center rounded-full size-5 flex-shrink-0 text-white"
            style={{ backgroundColor: configColor.border }}
          >
            {React.cloneElement(icono as React.ReactElement<{ className?: string }>, {
              className: "size-3 stroke-[3]"
            })}
          </span>
        )}
        <span>{children}</span>
      </div>
    );
  }
);

Chip.displayName = "Chip";

// ── Componente Badge (Relleno sin bordes notorios o simplificado) ────────────

const variantesBadge = cva(
  [
    "inline-flex items-center font-bold rounded-full select-none text-[11px] py-0.5 pl-1 pr-2.5 whitespace-nowrap",
  ]
);

export interface PropiedadesBadge
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof variantesBadge> {
  color?: ColorDisenoKey;
  icono?: React.ReactNode;
  clase?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, PropiedadesBadge>(
  ({ color = "gris", icono, clase, className, children, style, ...propiedades }, referencia) => {
    const configColor = MAPEO_COLORES_DISENO[color] || MAPEO_COLORES_DISENO.gris;

    return (
      <span
        ref={referencia}
        className={unirClases(variantesBadge(), className, clase)}
        style={{
          backgroundColor: configColor.bg,
          color: configColor.text,
          ...style,
        }}
        {...propiedades}
      >
        {icono && (
          <span
            className="flex items-center justify-center rounded-full size-4.5 flex-shrink-0 text-white mr-1.5"
            style={{ backgroundColor: configColor.border || configColor.text }}
          >
            {React.cloneElement(icono as React.ReactElement<{ className?: string }>, {
              className: "size-2.5 stroke-[3]"
            })}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// ── Badge con Campana de Notificación ────────────────────────────────────────

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
