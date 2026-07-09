import { Leaf } from "lucide-react";
import { AvatarEmoji } from "@/componentes/ui/avatar-emoji";
import { BadgeEstado } from "@/componentes/ui/badge-estado";
import { CabeceraSeccion } from "@/componentes/ui/cabecera-seccion";
import { TEMAS_RECIENTES } from "./data";

export function TablaTemasRecientes({ onVerTodos }: { onVerTodos: () => void }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <CabeceraSeccion titulo="Temas recientes" textoBoton="Ver todos" onBotonClick={onVerTodos} />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs text-slate-600">
              <th className="w-8 py-3" />
              <th className="py-3 font-extrabold">Título</th>
              <th className="py-3 font-extrabold">Senda</th>
              <th className="py-3 font-extrabold">Estado</th>
              <th className="py-3 font-extrabold" />
              <th className="py-3 font-extrabold">Última edición</th>
            </tr>
          </thead>
          <tbody>
            {TEMAS_RECIENTES.map((tema) => (
              <tr key={tema.titulo} className="border-b border-slate-100 text-xs font-semibold text-slate-700 last:border-0">
                <td className="py-3"><Leaf className="size-5 text-lime-500" /></td>
                <td className="py-3 text-slate-800">{tema.titulo}</td>
                <td className="py-3">{tema.senda}</td>
                <td className="py-3"><BadgeEstado estado={tema.estado} /></td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <AvatarEmoji emoji={tema.avatar} className="size-8 text-lg" />
                    <span>{tema.autor}</span>
                  </div>
                </td>
                <td className="py-3">{tema.ultimaEdicion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={onVerTodos} className="mx-auto mt-5 block font-extrabold text-emerald-600 hover:text-emerald-700">
        Ver todos los temas
      </button>
    </section>
  );
}
