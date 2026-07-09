import { unirClases } from "@/lib/utilidades";
import { AvatarEmoji } from "@/componentes/ui/avatar-emoji";
import { BadgeEstado } from "@/componentes/ui/badge-estado";
import { REVISIONES } from "./data";

export function ProximasRevisiones({ onVerTodas }: { onVerTodas: () => void }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-950">Próximas revisiones</h3>
        <button type="button" onClick={onVerTodas} className="text-sm font-extrabold text-emerald-600 hover:text-emerald-700">Ver todas</button>
      </div>
      <div className="mt-4 space-y-3">
        {REVISIONES.map((revision) => (
          <ItemRevision key={revision.titulo} {...revision} />
        ))}
      </div>
    </section>
  );
}

interface RevisionItemProps {
  dia: string;
  mes: string;
  titulo: string;
  senda: string;
  estado: "En revisión" | "Borrador";
  responsable: string;
  avatar: string;
  colorFecha: string;
}

function ItemRevision({ dia, mes, titulo, senda, estado, responsable, avatar, colorFecha }: RevisionItemProps) {
  return (
    <article className="flex min-w-0 flex-wrap items-center gap-3">
      <div className={unirClases("grid size-10 shrink-0 place-items-center rounded-xl text-center leading-none", colorFecha)}>
        <span className="text-base font-extrabold">{dia}</span>
        <span className="text-[10px] font-black">{mes}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-extrabold text-slate-800">{titulo}</h4>
        <p className="truncate text-xs font-medium text-slate-500">Senda: {senda}</p>
      </div>
      <BadgeEstado estado={estado} />
      <div className="flex min-w-0 flex-1 items-center gap-2 2xl:flex-none">
        <AvatarEmoji emoji={avatar} className="size-7 text-base" />
        <span className="truncate text-xs font-medium text-slate-600">{responsable}</span>
      </div>
    </article>
  );
}
