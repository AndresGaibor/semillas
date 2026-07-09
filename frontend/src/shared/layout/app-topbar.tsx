import { useQuery } from "@tanstack/react-query";
import { Button } from "@/componentes/ui/button";
import { CampoBusqueda } from "@/componentes/ui/campo-busqueda";
import { AppAccountMenu } from "./app-account-menu";
import { obtenerMiPerfil } from "../../features/profile/profile.api";

import { MAPA_AVATARES } from "@/shared/constants/avatares";

type AppTopbarProps = {
  title: string;
  subtitle: string; // Keep for compatibility, though not used in new design
  onOpenSidebar: () => void;
  onLogout: () => void;
};

export function AppTopbar({ title, subtitle, onOpenSidebar, onLogout }: AppTopbarProps) {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: obtenerMiPerfil,
  });

  const perfil = meQuery.data?.perfil;
  const apodo = perfil?.apodo || "Administrador";
  const avatarIndex = perfil?.url_avatar || "1";
  const resolvedAvatarUrl = MAPA_AVATARES[avatarIndex] || MAPA_AVATARES["1"] || "";

  return (
    <header className="mb-5 flex items-center justify-between gap-4 max-sm:flex-wrap">
      <Button
        type="button"
        variant="ghost"
        size="icon-responsive"
        className="hidden text-lg text-neutro hover:text-neutro-oscuro-max md:hidden max-md:flex shrink-0"
        aria-label="Abrir menú"
        onClick={onOpenSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </Button>

      <div className="flex items-center gap-3 text-left max-md:hidden">
        <span className="text-3xl leading-none">🌱</span>
        <h1 className="text-[28px] font-black leading-tight tracking-tight text-slate-800">{title}</h1>
      </div>

      <div className="mx-0 hidden max-w-[460px] flex-1 sm:mx-6 sm:block max-md:order-3 max-md:w-full">
        <div className="relative w-full">
          <CampoBusqueda
            valor=""
            onChange={() => undefined}
            placeholder="Buscar..."
            contenedorClassName="w-full"
            inputClassName="rounded-full py-2.5 pl-11 pr-10 text-xs font-semibold text-slate-700 placeholder:font-normal placeholder:text-slate-400 focus:border-[#2E9E5B] focus:ring-2 focus:ring-[#2E9E5B]/20 sm:pr-12"
          />
          <div className="absolute right-3 top-1/2 hidden h-6 -translate-y-1/2 items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 px-2 text-[10px] font-bold text-slate-400 select-none sm:flex">
            <span className="text-[11px] font-medium font-sans">⌘</span>K
          </div>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0 sm:gap-4">
        <Button type="button" variant="ghost" size="icon-responsive" className="relative text-lg text-slate-600 hover:text-slate-900 cursor-pointer sm:text-xl" aria-label="Notificaciones">
          <i className="fa-regular fa-bell"></i>
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-50 bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </Button>

        <div className="flex items-center gap-3 cursor-pointer rounded-xl p-1.5 transition-colors hover:bg-slate-100">
          <img src={resolvedAvatarUrl} alt="Avatar" className="h-9 w-9 rounded-full border border-slate-200 bg-white sm:h-10 sm:w-10" />
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-black leading-tight text-slate-800">{apodo}</span>
            <span className="text-xs font-bold text-slate-500">admin@semillas.org</span>
          </div>
          <i className="fa-solid fa-chevron-down text-slate-400 text-[10px] ml-1 hidden md:block"></i>
        </div>
      </div>
    </header>
  );
}
