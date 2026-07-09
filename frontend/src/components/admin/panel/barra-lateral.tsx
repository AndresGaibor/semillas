import { BarChart3, Home, Leaf, Pencil, PlaySquare, Route, Settings, ShieldCheck, UsersRound } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { LogoSemillas } from "./logo-semillas";
import { ItemMenu, type ItemMenuProps } from "./item-menu";
import { TarjetaPromocional } from "./tarjeta-promocional";

const itemsMenu: ItemMenuProps[] = [
  { texto: "Dashboard", icono: Home, activo: true, color: "text-emerald-600" },
  { texto: "Temas", icono: Leaf, color: "text-emerald-600" },
  { texto: "Sendas", icono: Route, color: "text-purple-600" },
  { texto: "Actividades", icono: Pencil, color: "text-orange-500" },
  { texto: "Usuarios", icono: UsersRound, color: "text-blue-600" },
  { texto: "Clubes", icono: UsersRound, color: "text-emerald-600" },
  { texto: "Medios", icono: PlaySquare, color: "text-purple-600" },
  { texto: "Revisión", icono: ShieldCheck, color: "text-amber-500" },
  { texto: "Reportes", icono: BarChart3, color: "text-blue-500" },
  { texto: "Ajustes", icono: Settings, color: "text-slate-500" },
];

export function BarraLateral() {
  return (
    <aside className="hidden w-[335px] shrink-0 border-r border-emerald-950/5 bg-white/85 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:block">
      <div className="flex h-full flex-col rounded-3xl bg-white px-4 py-5">
        <LogoSemillas />
        <nav className="mt-7 space-y-2">
          {itemsMenu.map((item) => <ItemMenu key={item.texto} {...item} />)}
        </nav>
        <div className="mt-auto">
          <TarjetaPromocional />
        </div>
      </div>
    </aside>
  );
}
