import { Sprout } from "lucide-react";

export function TarjetaPromocional() {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5">
      <div className="relative z-10 max-w-[170px]">
        <h3 className="text-xl font-extrabold leading-tight text-violet-700">Semillas crece contigo</h3>
        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
          Cada contenido que gestionas inspira corazones y transforma vidas.
        </p>
      </div>
      <div className="absolute bottom-3 right-3">
        <div className="relative grid size-28 place-items-center rounded-full bg-lime-100">
          <Sprout className="absolute -top-6 size-16 text-lime-600" />
          <div className="grid size-20 place-items-center rounded-full bg-lime-400 text-4xl shadow-lg shadow-lime-200">😊</div>
        </div>
      </div>
    </article>
  );
}
