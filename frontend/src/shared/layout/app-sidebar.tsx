import { Link } from "@tanstack/react-router";

import { Button } from "@/componentes/ui/button";
import logoImg from "@/assets/images/logos/Logotipo.png";

type AppSidebarProps = {
  activePage: string;
  isOffline: boolean;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

type SidebarItem = {
  to: string;
  label: string;
  icon: string;
  match: (path: string) => boolean;
};

const items: SidebarItem[] = [
  { to: "/app", label: "Inicio", icon: "fa-house", match: (path) => path === "/app" },
  { to: "/app/temas", label: "Mis temas", icon: "fa-book-open", match: (path) => path.includes("/temas") },
  { to: "/app/clubes", label: "Clubes", icon: "fa-users", match: (path) => path.includes("/clubes") },
  { to: "/app/logros", label: "Insignias", icon: "fa-medal", match: (path) => path.includes("/logros") },
  { to: "/app/perfil", label: "Perfil", icon: "fa-user", match: (path) => path.includes("/perfil") },
  { to: "/app/descargas", label: "Descargas", icon: "fa-download", match: (path) => path.includes("/descargas") }
];

export function AppSidebar({ activePage, isOffline, isOpen, onClose, onLogout }: AppSidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/45 transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-[110] flex h-screen w-[250px] flex-col border-r border-[#e5e7eb] bg-slate-50 p-6 shadow-2xl transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none md:sticky md:translate-x-0 md:opacity-100 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 py-2.5">
          <img src={logoImg} alt="Semillas Logo" className="h-12" />
          <span className="text-2xl font-black text-primario">Semillas</span>
        </div>

        <div className="mb-8 ml-[60px] text-[13.6px] font-medium text-neutro">Crecer en la Palabra, vivir su verdad</div>

        <nav className="flex flex-1 flex-col gap-2">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-neutro transition-all hover:bg-black/5 hover:text-neutro-oscuro-max ${
                item.match(activePage) ? "bg-primario-palido text-primario hover:bg-primario-palido hover:text-primario" : ""
              }`}
            >
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 pt-4">
          {isOffline && (
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-[13.6px] font-bold text-neutro-oscuro-max">
                <i className="fa-solid fa-circle-check text-primario"></i> Estás sin conexión
              </div>
              <p className="mb-3 text-xs leading-normal text-neutro">Tu progreso se sincronizará cuando vuelva internet.</p>
              <button className="w-full rounded-xl border-0 bg-primario py-2 text-[12.8px] font-semibold text-white transition-opacity hover:opacity-90">
                Ver estado
              </button>
            </div>
          )}

          <Button
            type="button"
            onClick={onLogout}
            className="h-11 w-full justify-center gap-2 rounded-2xl bg-[#8b5cf6] px-4 text-sm font-semibold text-white shadow-none hover:bg-[#7c3aed]"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
