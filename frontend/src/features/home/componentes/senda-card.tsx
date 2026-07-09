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

export function SendaCard({ variante, imagenUrl, label, titulo, descripcion, hash }: SendaCardProps) {
  const { bg, labelColor, titleColor } = VARIANTE_TAILWIND[variante];

  return (
    <Link
      to="/app/temas"
      search={{ senda: hash as "padre" | "hijo" | "espiritu" }}
      className="block h-full"
      aria-label={`Abrir temas de ${titulo}`}
    >
      <Card
        sombra="md"
        hoverEffect="elevate"
        className={`h-full overflow-hidden border border-white/60 ${bg}`}
      >
        <div className="flex h-full flex-col">
          <div className="relative aspect-[16/11] overflow-hidden">
            <img
              src={imagenUrl}
              alt={`Senda del ${titulo}`}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent" />
          </div>

          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <span className={`mb-1 block text-[0.78rem] font-black uppercase tracking-[0.16em] ${labelColor}`}>
              {label}
            </span>
            <h3 className={`text-[2rem] font-black leading-[0.95] tracking-[-0.04em] ${titleColor}`}>
              {titulo}
            </h3>
            <p className="mt-3 max-w-[17ch] text-[0.98rem] leading-relaxed text-slate-700">
              {descripcion}
            </p>

            <div className="mt-auto pt-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(15,23,42,0.10)] text-primario transition-transform hover:scale-105 active:scale-95">
                <i className="fa-solid fa-arrow-right text-[16px]" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
