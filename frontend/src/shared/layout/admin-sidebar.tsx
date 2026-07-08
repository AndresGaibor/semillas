import { Link } from "@tanstack/react-router";
import { Button } from "@/componentes/ui/button";
import logoImg from "@/assets/images/logos/Logotipo.png";
import semillaImg from "@/assets/images/Ilustraciones/Semilla.png";

type AdminSidebarProps = {
  activePage: string;
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
  { to: "/admin", label: "Dashboard", icon: "fa-house", match: (path) => path === "/admin" },
  { to: "/admin/temas", label: "Temas", icon: "fa-leaf", match: (path) => path.includes("/admin/temas") },
  { to: "/admin/sendas", label: "Sendas", icon: "fa-route", match: (path) => path.includes("/admin/sendas") },
  { to: "/admin/actividades", label: "Actividades", icon: "fa-pen-to-square", match: (path) => path.includes("/admin/actividades") },
  { to: "/admin/usuarios", label: "Usuarios", icon: "fa-user-group", match: (path) => path.includes("/admin/usuarios") },
  { to: "/admin/clubes", label: "Clubes", icon: "fa-people-group", match: (path) => path.includes("/admin/clubes") },
  { to: "/admin/medios", label: "Medios", icon: "fa-photo-film", match: (path) => path.includes("/admin/medios") },
  { to: "/admin/revision", label: "Revisión", icon: "fa-shield", match: (path) => path.includes("/admin/revision") },
  { to: "/admin/reportes", label: "Reportes", icon: "fa-chart-simple", match: (path) => path.includes("/admin/reportes") },
  { to: "/admin/ajustes", label: "Ajustes", icon: "fa-gear", match: (path) => path.includes("/admin/ajustes") }
];

export function AdminSidebar({ activePage, isOpen, onClose, onLogout }: AdminSidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/45 transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-[110] flex h-screen w-[300px] max-w-[85vw] flex-col border-r border-slate-100 bg-white p-5 shadow-2xl transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none md:sticky md:translate-x-0 md:opacity-100 md:shadow-xs sm:p-6 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 py-2.5 shrink-0 border-b border-slate-50 pb-5 mb-5">
          <img src={logoImg} alt="Semillas Logo" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          <div className="flex flex-col text-left">
            <div className="text-xl font-black leading-none sm:text-2xl">
              <span className="text-[#2e9e5b]">Sem</span>
              <span className="text-[#6c3aed]">illas</span>
            </div>
            <span className="mt-1 text-[9px] font-bold tracking-tight text-[#2e9e5b] sm:text-[10px]">Crecer en la Palabra, vivir Su verdad</span>
          </div>
        </div>

        {/* Links Navigation (Scrollable) */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 mb-4 select-none">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                item.match(activePage)
                  ? "bg-[#eefcf4] !text-[#2e9e5b] hover:bg-[#eefcf4] hover:!text-[#2e9e5b]"
                  : "!text-[#5c5c5c] hover:bg-slate-50 hover:!text-slate-900"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Panel */}
        <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-3 shrink-0">
          {/* Promo Seedling Card */}
          <div className="relative flex h-[116px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-[#f7f4ec] p-4 text-left shadow-xs">
            <div className="flex flex-col gap-1 z-10 max-w-[65%]">
              <div className="text-[13px] font-black text-[#6c3aed]">Semillas crece contigo</div>
              <p className="text-[10px] leading-snug text-slate-500 font-bold">Cada contenido que gestionas inspira corazones y transforma vidas.</p>
            </div>
            <img
              src={semillaImg}
              alt="Semilla mascot"
              className="w-16 h-16 object-contain absolute right-2 bottom-0 z-0"
            />
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            <Link 
              to="/app" 
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-600 transition-colors shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Volver a la app
            </Link>

            <Button
              type="button"
              onClick={onLogout}
              className="h-10 w-full justify-center gap-2 rounded-2xl bg-[#8b5cf6] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#7c3aed] cursor-pointer sm:h-11"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
