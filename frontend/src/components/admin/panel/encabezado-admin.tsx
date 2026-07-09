import { Bell, ChevronDown, Keyboard } from "lucide-react";
import { AvatarEmoji } from "@/componentes/ui/avatar-emoji";
import { CampoBusqueda } from "@/componentes/ui/campo-busqueda";

export function EncabezadoAdmin() {
  return (
    <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-4">
        <div className="text-5xl">🌱</div>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-950">Panel de administración</h2>
      </div>
      <div className="flex flex-1 items-center justify-end gap-5">
        <div className="hidden w-full max-w-[510px] items-center gap-3 lg:flex">
          <CampoBusqueda
            valor=""
            onChange={() => undefined}
            placeholder="Buscar temas, sendas, actividades, usuarios..."
            contenedorClassName="w-full max-w-[510px]"
            inputClassName="pl-12 pr-16 py-3 text-sm font-medium shadow-sm"
          />
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-400">
            <Keyboard className="size-4" />K
          </div>
        </div>
        <button type="button" className="relative grid size-12 place-items-center rounded-full bg-white shadow-sm">
          <Bell className="size-6 text-slate-500" />
          <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">5</span>
        </button>
        <div className="h-10 w-px bg-slate-200" />
        <button type="button" className="flex items-center gap-4">
          <AvatarEmoji emoji="👨" className="size-14 text-3xl" />
          <div className="hidden text-left sm:block">
            <p className="font-extrabold text-slate-900">Administrador</p>
            <p className="text-sm font-medium text-slate-500">admin@semillas.org</p>
          </div>
          <ChevronDown className="size-5 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
