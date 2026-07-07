import { Button } from "@/componentes/ui/button";
import { FilaListaCompacta } from "@/componentes/ui/fila-lista-compacta";

export type UpcomingReviewItem = {
  id: string;
  dia: string;
  mes: string;
  titulo: string;
  senda: string;
  estado: "En revisión" | "Borrador" | string;
  reviewerNombre: string;
  reviewerAvatar: string;
};

type UpcomingReviewsListProps = {
  revisiones: UpcomingReviewItem[];
  onVerTodas?: () => void;
  onSelectReview?: (id: string) => void;
};

export function UpcomingReviewsList({
  revisiones,
  onVerTodas,
  onSelectReview,
}: UpcomingReviewsListProps) {
  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case "En revisión":
        return "bg-amber-50 text-amber-600 border border-amber-200/50";
      case "Borrador":
        return "bg-slate-50 text-slate-500 border border-slate-200/50";
      default:
        return "bg-blue-50 text-blue-600 border border-blue-200/50";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[17px] font-black text-neutro-oscuro-max">Próximas revisiones</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onVerTodas}
          className="text-xs font-bold text-primario hover:text-primario-oscuro p-0 h-auto hover:bg-transparent"
        >
          Ver todas
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {revisiones.map((rev) => (
          <FilaListaCompacta
            key={rev.id}
            onClick={onSelectReview ? () => onSelectReview(rev.id) : undefined}
            className="select-none"
            izquierda={
              <div className="flex flex-col items-center justify-center shrink-0 w-11 h-12 bg-white border border-slate-100 rounded-xl shadow-xs">
                <span className="text-base font-black text-neutro-oscuro-max leading-none">{rev.dia}</span>
                <span className="text-[9px] font-extrabold text-neutro uppercase tracking-wider mt-0.5">{rev.mes}</span>
              </div>
            }
            titulo={rev.titulo}
            subtitulo={`Senda: ${rev.senda}`}
            derecha={
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold ${getBadgeStyle(rev.estado)}`}>
                  {rev.estado}
                </span>
                <div className="flex items-center gap-1">
                  <img
                    src={rev.reviewerAvatar}
                    alt={rev.reviewerNombre}
                    className="w-4 h-4 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-[10px] font-bold text-neutro-oscuro leading-none">
                    {rev.reviewerNombre}
                  </span>
                </div>
              </div>
            }
            contenidoClassName="self-center"
            derechaClassName="self-center"
          />
        ))}
      </div>
    </div>
  );
}
