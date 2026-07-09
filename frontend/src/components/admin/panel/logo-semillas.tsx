import { Leaf } from "lucide-react";

export function LogoSemillas() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="grid size-11 place-items-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-200">
        <Leaf className="size-6" />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-violet-700">Semillas</h1>
        <p className="text-sm font-medium text-emerald-600">Crecer en la Palabra, vivir Su verdad</p>
      </div>
    </div>
  );
}
