import { Link } from "@tanstack/react-router";
import { Button } from "@/componentes/ui/button";
import { Card } from "@/componentes/ui/card-base";
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
        className={`fixed left-0 top-0 z-[110] flex h-screen w-[286px] max-w-[85vw] flex-col border-r border-slate-100 bg-white/95 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-md transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none md:sticky md:translate-x-0 md:opacity-100 md:shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-4 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
        }`}
      >
        {/* Header */}
        <div className="mb-4 flex shrink-0 items-center gap-3 border-b border-slate-50 py-2 pb-4">
          <img src={logoImg} alt="Semillas Logo" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
          <div className="flex flex-col text-left">
            <div className="text-xl font-black leading-none">
              <span className="text-[#2e9e5b]">Sem</span>
              <span className="text-[#6c3aed]">illas</span>
            </div>
            <span className="mt-1 text-[9px] font-bold tracking-tight text-[#2e9e5b]">Crecer en la Palabra, vivir Su verdad</span>
          </div>
        </div>

        {/* Links Navigation (Scrollable) */}
        <nav className="mb-4 flex flex-1 select-none flex-col gap-1 overflow-y-auto pr-1">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              onClick={onClose}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                item.match(activePage)
                  ? "bg-[#eefcf4] !text-[#2e9e5b] shadow-sm ring-1 ring-[#2e9e5b]/10 hover:bg-[#eefcf4] hover:!text-[#2e9e5b]"
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
          <Card sombra="sm" className="relative flex h-[112px] flex-col justify-between overflow-hidden border border-slate-100 bg-[#f7f4ec] p-4 text-left shadow-xs">
            <div className="flex flex-col gap-1 z-10 max-w-[65%]">
              <div className="text-[13px] font-black text-[#6c3aed]">Semillas crece contigo</div>
              <p className="text-[10px] leading-snug text-slate-500 font-bold">Cada contenido que gestionas inspira corazones y transforma vidas.</p>
            </div>
            <img
              src={semillaImg}
              alt="Semilla mascot"
              className="w-16 h-16 object-contain absolute right-2 bottom-0 z-0"
            />
          </Card>

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
