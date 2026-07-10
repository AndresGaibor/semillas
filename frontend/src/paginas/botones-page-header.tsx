import type { ReactNode } from "react";
import { Pointer, Palette, Eye, Scale, Check, Sprout } from "lucide-react";

export function BotonesPageHeader() {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-green-50">
          <Sprout className="size-11 text-green-600" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-green-700">
            Semillas
          </h1>
          <p className="text-sm font-semibold text-green-700">
            Crece en la fe cada día
          </p>
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Botones
        </h2>

        <p className="max-w-[300px] text-lg font-medium leading-8 text-slate-800">
          Nuestros botones son amigables, claros y accesibles. Tienen bordes
          redondeados, colores consistentes y estados definidos para cada
          interacción.
        </p>
      </section>

      <TarjetaLateral titulo="Principios">
        <ElementoLateral
          icono={<Pointer className="size-5" />}
          texto="Tamaño mínimo táctil de 44px de altura."
        />
        <ElementoLateral
          icono={<Palette className="size-5" />}
          texto="Uso consistente de color según la acción."
        />
        <ElementoLateral
          icono={<Eye className="size-5" />}
          texto="Estados claros para cada interacción."
        />
        <ElementoLateral
          icono={<Scale className="size-5" />}
          texto="Texto legible y contraste adecuado."
        />
      </TarjetaLateral>

      <TarjetaLateral titulo="Recomendaciones">
        <ElementoRecomendacion texto="Usa botones primarios para acciones principales." />
        <ElementoRecomendacion texto="Usa secundarios para acciones complementarias." />
        <ElementoRecomendacion texto="Usa peligro únicamente para eliminar o acciones críticas." />
        <ElementoRecomendacion texto="No uses más de 2 botones principales en una misma vista." />
      </TarjetaLateral>
    </>
  );
}

function TarjetaLateral({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-violet-100 bg-violet-50/60 p-6">
      <h3 className="mb-6 text-lg font-extrabold text-violet-700">{titulo}</h3>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ElementoLateral({ icono, texto }: { icono: ReactNode; texto: string }) {
  return (
    <div className="flex gap-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-700">{icono}</div>
      <p className="pt-1 text-sm font-bold leading-6 text-slate-900">{texto}</p>
    </div>
  );
}

function ElementoRecomendacion({ texto }: { texto: string }) {
  return (
    <div className="flex gap-4">
      <Check className="mt-1 size-5 shrink-0 text-green-600" />
      <p className="text-sm font-bold leading-6 text-slate-900">{texto}</p>
    </div>
  );
}
