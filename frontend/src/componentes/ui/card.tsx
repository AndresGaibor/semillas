import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Book,
  Clock,
  Cloud,
  Download,
  Flame,
  Heart,
  Lock,
  RotateCcw,
  Star,
  Trophy,
  WifiOff,
} from "lucide-react";
import { unirClases } from "@/lib/utilidades";
import { Chip } from "./chip";
import { BarraProgreso } from "./indicadores-progreso";
import { Boton } from "./boton";

// ── Contenedor Base Card ──────────────────────────────────────────────────────

const variantesCard = cva(
  "rounded-2xl border bg-white text-slate-900 transition-all duration-200 ease-in-out",
  {
    variants: {
      sombra: {
        sm: "shadow-[0_2px_8px_rgba(15,23,42,0.06)]",
        md: "shadow-[0_8px_24px_rgba(15,23,42,0.10)]",
        lg: "shadow-[0_16px_40px_rgba(15,23,42,0.14)]",
      },
      hoverEffect: {
        none: "",
        elevate: "hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)]",
      },
    },
    defaultVariants: {
      sombra: "sm",
      hoverEffect: "elevate",
    },
  }
);

export interface PropiedadesCard
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variantesCard> {
  clase?: string;
}

export const Card = React.forwardRef<HTMLDivElement, PropiedadesCard>(
  ({ sombra, hoverEffect, clase, className, children, ...propiedades }, referencia) => {
    return (
      <div
        ref={referencia}
        className={unirClases(variantesCard({ sombra, hoverEffect }), className, clase)}
        {...propiedades}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// ── Sub-componentes del Layout ───────────────────────────────────────────────

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={unirClases("flex flex-col space-y-1.5 p-5", className)} {...props}>
    {children}
  </div>
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={unirClases("text-sm font-extrabold text-slate-800 leading-none", className)} {...props}>
    {children}
  </h3>
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={unirClases("text-[11px] text-slate-400 font-semibold", className)} {...props}>
    {children}
  </p>
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={unirClases("p-5 pt-0 text-xs", className)} {...props}>
    {children}
  </div>
);
CardContent.displayName = "CardContent";

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={unirClases("flex items-center p-5 pt-0", className)} {...props}>
    {children}
  </div>
);
CardFooter.displayName = "CardFooter";


// ── 01. Card de Lección (Template Principal) ─────────────────────────────────

export interface PropiedadesCardLeccion {
  estado?: "porDefecto" | "enProgreso" | "completada" | "descargada" | "bloqueada" | "error";
  senda: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  xp: number;
  progreso?: number;
  favorito?: boolean;
  onFavorito?: () => void;
  onAccion?: () => void;
  clase?: string;
}

export const CardLeccion: React.FC<PropiedadesCardLeccion> = ({
  estado = "porDefecto",
  senda,
  titulo,
  descripcion,
  duracion,
  xp,
  progreso = 0,
  favorito = false,
  onFavorito,
  onAccion,
  clase,
}) => {
  const esBloqueada = estado === "bloqueada";
  const esError = estado === "error";

  // Mapear colores de píldora cabecera según senda
  const colorPildora: import("./chip").ColorDisenoKey =
    esError ? "rosa" :
    esBloqueada ? "gris" :
    senda.toLowerCase().includes("padre") ? "azul" :
    senda.toLowerCase().includes("hijo") ? "morado" : "naranja";

  // Renderizar Ilustración Vectorial SVG para fidelidad total sin placeholders
  const renderIlustracion = () => {
    if (esError) {
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <rect width="200" height="120" fill="#FEE2E2" />
          {/* Sad Cloud Vector */}
          <path d="M 70 80 Q 60 70 65 55 Q 75 40 95 45 Q 105 35 120 40 Q 135 35 140 50 Q 150 65 135 80 Z" fill="#FCA5A5" />
          <circle cx="95" cy="60" r="2.5" fill="#EF4444" />
          <circle cx="110" cy="60" r="2.5" fill="#EF4444" />
          <path d="M 100 70 Q 102.5 67 105 70" stroke="#EF4444" strokeWidth="2" fill="none" />
        </svg>
      );
    }
    if (esBloqueada) {
      return (
        <div className="relative w-full h-full">
          <svg viewBox="0 0 200 120" className="w-full h-full grayscale opacity-50">
            <rect width="200" height="120" fill="#E2E8F0" />
            {/* Castle / Tower silhouette */}
            <path d="M 40 120 L 40 70 L 60 70 L 60 50 L 80 50 L 80 70 L 120 70 L 120 50 L 140 50 L 140 70 L 160 70 L 160 120 Z" fill="#94A3B8" />
            <rect x="90" y="85" width="20" height="35" rx="4" fill="#64748B" />
          </svg>
          {/* Lock Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
            <span className="p-3 bg-white rounded-full shadow-md text-slate-500">
              <Lock className="size-5 stroke-[2.5]" />
            </span>
          </div>
        </div>
      );
    }
    if (senda.toLowerCase().includes("padre")) {
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <rect width="200" height="120" fill="#E0F2FE" />
          <path d="M 0 95 Q 50 65 100 95 Q 150 115 200 100 L 200 120 L 0 120 Z" fill="#86EFAC" />
          <path d="M 0 105 Q 100 85 200 105 L 200 120 L 0 120 Z" fill="#4ADE80" />
          {/* Noah's Ark */}
          <path d="M 60 85 L 140 85 L 130 105 L 70 105 Z" fill="#B45309" />
          <rect x="80" y="68" width="40" height="18" rx="2" fill="#78350F" />
          <polygon points="100,50 85,68 115,68" fill="#D97706" />
        </svg>
      );
    }
    if (senda.toLowerCase().includes("hijo")) {
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <rect width="200" height="120" fill="#FAF5FF" />
          {/* Green grass hill */}
          <path d="M 0 90 Q 100 70 200 90 L 200 120 L 0 120 Z" fill="#4ADE80" />
          {/* Sun Rays */}
          <circle cx="100" cy="120" r="50" fill="#FEF08A" opacity="0.3" />
          {/* Children and Jesus vectors representation */}
          <circle cx="100" cy="65" r="10" fill="#FDBA74" />
          <path d="M 90 75 L 110 75 L 105 100 L 95 100 Z" fill="#3B82F6" />
          <circle cx="75" cy="78" r="7" fill="#FDBA74" />
          <path d="M 68 85 L 82 85 L 80 100 L 70 100 Z" fill="#EF4444" />
          <circle cx="125" cy="78" r="7" fill="#FDBA74" />
          <path d="M 118 85 L 132 85 L 130 100 L 120 100 Z" fill="#10B981" />
        </svg>
      );
    }
    // Senda del Espíritu
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#FEF3C7" />
        {/* Soft wind curves */}
        <path d="M 20 40 Q 60 20 100 40 Q 140 60 180 40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M 10 70 Q 50 50 90 70 Q 130 90 170 70" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
        {/* Holy Spirit Dove */}
        <path d="M 85 55 Q 100 25 115 55 Q 130 65 100 80 Q 70 65 85 55 Z" fill="#FFFFFF" />
        <path d="M 100 40 L 95 55 L 105 55 Z" fill="#FFFFFF" />
        {/* Little Flame */}
        <path d="M 97 88 Q 100 80 103 88 Q 105 95 100 95 Q 95 95 97 88 Z" fill="#EF4444" />
      </svg>
    );
  };

  return (
    <Card
      sombra="sm"
      hoverEffect={esBloqueada ? "none" : "elevate"}
      clase={unirClases("w-full max-w-[260px] overflow-hidden flex flex-col justify-between h-[360px]", clase)}
      style={{
        borderColor: esError ? "#FECACA" : "#E2E8F0",
        opacity: esBloqueada ? 0.75 : 1,
      }}
    >
      <div>
        {/* Banner de Senda & Favorito */}
        <div className="flex items-center justify-between p-3.5 pb-2">
          {esError ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{ backgroundColor: "#FEE2E2", borderColor: "#EF4444", color: "#EF4444" }}
            >
              Error
            </span>
          ) : (
            <Chip color={colorPildora} forma="badgePildora">
              {senda}
            </Chip>
          )}

          {!esError && !esBloqueada && (
            <button
              type="button"
              onClick={onFavorito}
              className="p-1 rounded-full text-slate-300 hover:text-red-500 transition-colors"
            >
              <Heart
                className={unirClases("size-4", favorito ? "fill-red-500 text-red-500" : "text-slate-400")}
              />
            </button>
          )}
        </div>

        {/* Ilustración */}
        <div className="w-full h-[120px] bg-slate-50 flex items-center justify-center overflow-hidden border-y border-slate-100 relative">
          {renderIlustracion()}
        </div>

        {/* Textos */}
        <div className="p-4 flex flex-col gap-1 text-left">
          <h4 className="text-sm font-extrabold text-slate-800 leading-tight truncate">{titulo}</h4>
          <p className="text-[11px] text-slate-400 font-semibold leading-normal line-clamp-2 h-[34px]">
            {descripcion}
          </p>

          {/* Duración y XP */}
          {!esError && !esBloqueada && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mt-1.5">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-slate-400" />
                {duracion}
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-amber-400 fill-amber-400" />
                +{xp} XP
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Acciones e Indicadores al Pie */}
      <div className="p-4 pt-0">
        {/* Barra de progreso si está en progreso o completada */}
        {!esError && !esBloqueada && (estado === "enProgreso" || estado === "completada") && (
          <div className="mb-3">
            <BarraProgreso
              valor={progreso}
              maximo={100}
              mostrarEtiquetas={false}
              color={estado === "completada" ? "verde" : "morado"}
            />
            <span className="text-[9px] text-slate-400 font-bold mt-1 block text-right">
              {progreso}%
            </span>
          </div>
        )}

        {/* Etiqueta offline si está descargada */}
        {estado === "descargada" && (
          <div className="flex items-center gap-1 text-[10px] text-[#3D8BD4] font-bold py-1 justify-center rounded-lg bg-[#EFF6FF] border border-[#3D8BD4]/20 mb-1">
            <Cloud className="size-3.5 fill-[#3D8BD4]" />
            <span>Sin conexión</span>
          </div>
        )}

        {/* Botones de acción */}
        {estado === "porDefecto" && (
          <Boton variante="contorno" className="w-full text-xs py-1.5" onClick={onAccion}>
            Comenzar
          </Boton>
        )}
        {estado === "enProgreso" && (
          <Boton variante="primario" className="w-full text-xs py-1.5" onClick={onAccion}>
            Continuar
          </Boton>
        )}
        {estado === "completada" && (
          <Boton variante="exito" className="w-full text-xs py-1.5" onClick={onAccion}>
            Repasar
          </Boton>
        )}
        {estado === "error" && (
          <Boton
            variante="contorno"
            className="w-full text-xs py-1.5 border-[#EE6C4D] text-[#EE6C4D] hover:bg-[#FFF8F1]"
            onClick={onAccion}
          >
            Reintentar
          </Boton>
        )}
      </div>
    </Card>
  );
};

// ── 02. Card de Progreso / Métrica (Horizontal) ──────────────────────────────

interface PropiedadesCardMetrica {
  titulo: string;
  valor: string | number;
  subtexto: string;
  tipo: "xp" | "racha" | "lecciones" | "offline";
  clase?: string;
}

export const CardMetrica: React.FC<PropiedadesCardMetrica> = ({
  titulo,
  valor,
  subtexto,
  tipo,
  clase,
}) => {
  const configs = {
    xp: {
      gradiente: "linear-gradient(135deg, #2E9E5B, #16A34A)",
      textoIcono: "XP",
      icono: null,
      subColor: "text-[#2E9E5B]",
    },
    racha: {
      gradiente: "linear-gradient(135deg, #6C3AED, #5B30C8)",
      textoIcono: "",
      icono: <Flame className="size-5 text-white fill-white" />,
      subColor: "text-[#6C3AED]",
    },
    lecciones: {
      gradiente: "linear-gradient(135deg, #F4B740, #D97706)",
      textoIcono: "",
      icono: <Book className="size-5 text-white" />,
      subColor: "text-[#D97706]",
    },
    offline: {
      gradiente: "linear-gradient(135deg, #3D8BD4, #2563EB)",
      textoIcono: "",
      icono: <Download className="size-5 text-white" />,
      subColor: "text-[#3D8BD4]",
    },
  };

  const config = configs[tipo] || configs.xp;

  return (
    <Card sombra="sm" clase={unirClases("p-4 flex items-center gap-4 bg-white w-full", clase)}>
      {/* Icono Circular */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-extrabold text-sm shadow-inner"
        style={{ background: config.gradiente }}
      >
        {config.textoIcono || config.icono}
      </div>

      {/* Datos */}
      <div className="text-left">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block leading-none mb-1">
          {titulo}
        </span>
        <h3 className="text-lg font-black text-slate-800 leading-none">{valor}</h3>
        <p className={unirClases("text-[10px] font-bold mt-1", config.subColor)}>{subtexto}</p>
      </div>
    </Card>
  );
};

// ── 03. Card de Logro / Insignia (Vertical) ──────────────────────────────────

interface PropiedadesCardInsignia {
  titulo: string;
  descripcion: string;
  obtenida: boolean;
  color: "verde" | "morado" | "amarillo" | "gris";
  icono: React.ReactNode;
  progresoActual?: number;
  progresoMaximo?: number;
  clase?: string;
}

export const CardInsignia: React.FC<PropiedadesCardInsignia> = ({
  titulo,
  descripcion,
  obtenida,
  color,
  icono,
  progresoActual,
  progresoMaximo,
  clase,
}) => {
  const colorConfigs = {
    verde: {
      bg: "linear-gradient(135deg, #2E9E5B, #123B2C)",
      border: "#16A34A",
      bgPildora: "#DCFCE7",
      textPildora: "#16A34A",
    },
    morado: {
      bg: "linear-gradient(135deg, #6C3AED, #4C1D95)",
      border: "#5B30C8",
      bgPildora: "#FAF5FF",
      textPildora: "#6C3AED",
    },
    amarillo: {
      bg: "linear-gradient(135deg, #F4B740, #D97706)",
      border: "#D97706",
      bgPildora: "#FFFDF5",
      textPildora: "#D97706",
    },
    gris: {
      bg: "linear-gradient(135deg, #94A3B8, #475569)",
      border: "#64748B",
      bgPildora: "#F1F5F9",
      textPildora: "#64748B",
    },
  };

  const config = colorConfigs[color] || colorConfigs.gris;

  return (
    <Card
      sombra="sm"
      clase={unirClases("p-5 flex flex-col items-center justify-between text-center h-[260px] max-w-[200px] w-full", clase)}
      style={{
        backgroundColor: obtenida ? "#FFFFFF" : "#FAFAFA",
        opacity: obtenida ? 1 : 0.7,
      }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Insignia Escudo Vectorial */}
        <div className="relative w-16 h-18 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 100 115" className="w-full h-full" fill="none">
            <path
              d="M50 0C77.7778 0 95.8333 13.5833 100 40.8333C100 78.4333 75.9259 102.35 50 115C24.0741 102.35 0 78.4333 0 40.8333C4.16667 13.5833 22.2222 0 50 0Z"
              fill={obtenida ? config.bg : "#CBD5E1"}
            />
            <path
              d="M50 4C74.7778 4 91.8333 16.5833 96 42.8333C96 75.4333 73.9259 97.35 50 109C26.0741 97.35 4 75.4333 4 42.8333C8.16667 16.5833 25.2222 4 50 4Z"
              stroke={obtenida ? config.border : "#94A3B8"}
              strokeWidth="4"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {React.cloneElement(icono as React.ReactElement<{ className?: string }>, {
              className: "size-7 stroke-[2.2]",
            })}
          </div>
        </div>

        {/* Textos */}
        <div>
          <h4 className="text-xs font-black text-slate-800 leading-tight mb-1">{titulo}</h4>
          <p className="text-[10px] text-slate-400 font-semibold leading-snug line-clamp-2 px-1">
            {descripcion}
          </p>
        </div>
      </div>

      {/* Pie interactivo o de progreso */}
      <div className="w-full mt-4">
        {obtenida ? (
          <div
            className="text-[10px] font-bold py-1 rounded-lg text-center"
            style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
          >
            ¡Logro obtenido!
          </div>
        ) : progresoActual !== undefined && progresoMaximo !== undefined ? (
          <div className="flex flex-col gap-1 w-full">
            <BarraProgreso
              valor={progresoActual}
              maximo={progresoMaximo}
              mostrarEtiquetas={false}
              color={color === "amarillo" ? "naranja" : color === "gris" ? "azul" : color}
            />
            <span className="text-[9px] text-slate-400 font-bold self-end mt-0.5">
              {progresoActual} / {progresoMaximo}
            </span>
          </div>
        ) : (
          <div
            className="text-[10px] font-bold py-1 rounded-lg text-center border border-slate-200"
            style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
          >
            Bloqueado
          </div>
        )}
      </div>
    </Card>
  );
};

// ── 04. Card de Usuario / Perfil Pequeño ─────────────────────────────────────

interface PropiedadesCardPerfil {
  nombre: string;
  nivel: number;
  racha: number;
  lecciones: number;
  logros: number;
  xpActual: number;
  xpMaximo: number;
  avatarUrl?: string;
  onVerPerfil?: () => void;
  clase?: string;
}

export const CardPerfil: React.FC<PropiedadesCardPerfil> = ({
  nombre,
  nivel,
  racha,
  lecciones,
  logros,
  xpActual,
  xpMaximo,
  avatarUrl,
  onVerPerfil,
  clase,
}) => {
  return (
    <Card sombra="sm" hoverEffect="none" clase={unirClases("p-5 flex flex-col gap-4 bg-white w-full max-w-[280px]", clase)}>
      {/* Cabecera Avatar */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full border-2 border-[#6C3AED]/20 bg-cover bg-center flex-shrink-0"
          style={{
            backgroundImage: avatarUrl ? `url('${avatarUrl}')` : "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80')",
          }}
        />
        <div className="text-left">
          <h4 className="text-xs font-black text-slate-800 leading-none">{nombre}</h4>
          <span className="inline-flex mt-1.5">
            <Chip color="morado" forma="badgePildora">
              Nivel {nivel}
            </Chip>
          </span>
        </div>
      </div>

      {/* Progreso de Nivel */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-1">
          <span>{xpActual} / {xpMaximo} XP</span>
        </div>
        <BarraProgreso valor={xpActual} maximo={xpMaximo} mostrarEtiquetas={false} color="morado" />
      </div>

      {/* Row de Estadísticas */}
      <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-center">
        <div>
          <h5 className="text-xs font-black text-slate-800 leading-none">{racha}</h5>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">días</span>
        </div>
        <div>
          <h5 className="text-xs font-black text-slate-800 leading-none">{lecciones}</h5>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">lecciones</span>
        </div>
        <div>
          <h5 className="text-xs font-black text-slate-800 leading-none">{logros}</h5>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">logros</span>
        </div>
      </div>

      {/* Acción */}
      <Boton variante="contorno" className="w-full text-xs py-1.5" onClick={onVerPerfil}>
        Ver perfil
      </Boton>
    </Card>
  );
};
