import { useQuery } from "@tanstack/react-query";
import { Button } from "@/componentes/ui/button";
import { AppAccountMenu } from "./app-account-menu";
import { obtenerMiPerfil } from "../../features/profile/profile.api";

import { MAPA_AVATARES } from "@/shared/constants/avatares";

type AppTopbarProps = {
  title: string;
  subtitle: string;
  onOpenSidebar: () => void;
  onLogout: () => void;
};

export function AppTopbar({ title, subtitle, onOpenSidebar, onLogout }: AppTopbarProps) {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: obtenerMiPerfil,
  });

  const perfil = meQuery.data?.perfil;
  const apodo = perfil?.apodo || "Semillero";
  const avatarIndex = perfil?.url_avatar || "1";
  const resolvedAvatarUrl = MAPA_AVATARES[avatarIndex] || MAPA_AVATARES["1"] || "";

  return (
    <header className="mb-6 flex items-center justify-between max-sm:gap-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hidden text-xl text-neutro hover:text-neutro-oscuro-max max-md:flex"
        aria-label="Abrir menú"
        onClick={onOpenSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </Button>

      <div className="flex flex-col text-left max-md:hidden">
        <h1 className="mb-1 text-2xl font-black text-blue-900">{title}</h1>
        <p className="text-sm text-neutro">{subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-5 sm:ml-0">
        <Button type="button" variant="ghost" size="icon" className="text-xl text-neutro hover:text-neutro-oscuro-max" aria-label="Descargas">
          <i className="fa-solid fa-download"></i>
        </Button>

        <Button type="button" variant="ghost" size="icon" className="relative text-xl text-neutro hover:text-neutro-oscuro-max" aria-label="Notificaciones">
          <i className="fa-regular fa-bell"></i>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9.6px] font-bold text-white">
            3
          </span>
        </Button>

        <AppAccountMenu
          nombreVisible={apodo}
          nivelTexto="Explorador • Nivel 7"
          avatarUrl={resolvedAvatarUrl}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
