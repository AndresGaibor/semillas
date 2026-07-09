import { Link } from "@tanstack/react-router";

import { Button } from "@/componentes/ui/button";
import { Card } from "@/componentes/ui/card-base";
import logoImg from "@/assets/images/logos/Logotipo.png";

type AppSidebarProps = {
  activePage: string;
  isOffline: boolean;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  variant?: "app" | "admin";
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

const adminItems: SidebarItem[] = [
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

type SidebarSection = {
  titulo?: string;
  items: SidebarItem[];
};

export function obtenerSeccionesSidebar(variant: "app" | "admin"): SidebarSection[] {
  return variant === "admin" ? [{ titulo: "Administración", items: adminItems }] : [{ items }];
}

export function AppSidebar({ activePage, isOffline, isOpen, onClose, onLogout, variant = "app" }: AppSidebarProps) {
  const secciones = obtenerSeccionesSidebar(variant);

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/45 transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-[110] hidden h-screen w-[260px] max-w-[82vw] flex-col border-r border-[#e5e7eb] bg-slate-50 px-4 py-5 shadow-2xl transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none md:sticky md:flex md:w-[248px] md:translate-x-0 md:opacity-100 md:px-4 md:py-5 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
        }`}
      >
        <div className="flex items-center gap-2.5 py-1">
          <img src={logoImg} alt="Semillas Logo" className="h-9 md:h-10" />
          <span className="text-[1.45rem] font-black leading-none text-primario md:text-[1.55rem]">Semillas</span>
        </div>

        <div className="mb-5 ml-[48px] max-w-[150px] text-[10px] font-semibold leading-snug text-neutro md:mb-6 md:ml-[50px] md:text-[11px]">Crecer en la Palabra, vivir su verdad</div>

        <nav className="flex flex-1 flex-col gap-4">
          {secciones.map((seccion) => (
            <div key={seccion.titulo ?? "principal"} className="flex flex-col gap-1.5">
              {seccion.titulo ? <p className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-neutro/50">{seccion.titulo}</p> : null}
              {seccion.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to as any}
                  onClick={onClose}
                  className={`flex h-10 items-center gap-3 rounded-xl px-3.5 text-[13px] font-semibold text-neutro transition-all hover:bg-black/5 hover:text-neutro-oscuro-max ${
                    item.match(activePage) ? "bg-primario-palido text-primario hover:bg-primario-palido hover:text-primario" : ""
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-5 text-center text-[15px]`} />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-4">
          {variant === "app" && isOffline && (
            <Card sombra="sm" className="p-3">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-neutro-oscuro-max">
                <i className="fa-solid fa-circle-check text-primario"></i> Estás sin conexión
              </div>
              <p className="mb-2.5 text-[11px] leading-normal text-neutro">Tu progreso se sincronizará cuando vuelva internet.</p>
              <button className="w-full rounded-xl border-0 bg-primario py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90">
                Ver estado
              </button>
            </Card>
          )}

          <Button
            type="button"
            onClick={onLogout}
            className="h-10 w-full justify-center gap-2 rounded-2xl bg-[#8b5cf6] px-4 text-xs font-bold text-white shadow-none hover:bg-[#7c3aed]"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
