import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { sessionStorageApi } from "@/shared/api/session";
import { cerrarSesionAutenticada } from "@/shared/auth/supabase";
import { obtenerNavMovilActivo, obtenerNavegacionMovil } from "@/shared/layout/app-mobile-nav";

type PageHeaderInfo = {
  titulo: string;
  subtitulo: string;
};

const PAGE_HEADER_MAP: Record<string, PageHeaderInfo> = {
  "/app/temas": {
    titulo: "Mis temas",
    subtitulo: "Explora y repasa los temas que has estudiado.",
  },
  "/app/logros": {
    titulo: "Mis insignias",
    subtitulo: "Los logros y premios que has alcanzado.",
  },
  "/app/perfil": {
    titulo: "Mi perfil",
    subtitulo: "Administra tu avatar y configuración.",
  },
  "/app/clubes": {
    titulo: "Mi club",
    subtitulo: "Aprende y participa con tu iglesia, curso o familia.",
  },
  "/app/descargas": {
    titulo: "Descargas",
    subtitulo: "Recursos para aprender y crecer en la fe, incluso sin conexión.",
  },
};

const DEFAULT_HEADER: PageHeaderInfo = {
  titulo: "Hola Semillero",
  subtitulo: "Sigue aprendiendo y creciendo en la Palabra de Dios.",
};

export function useAppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await cerrarSesionAutenticada();
    sessionStorageApi.clearGuestSession();
    navigate({ to: "/login", search: { redirect: "/onboarding" } });
  };

  const navegacionMovil = obtenerNavegacionMovil();
  const opcionesBottomNav = navegacionMovil.map(({ id, etiqueta, icono }) => ({ id, etiqueta, icono }));
  const activoMovil = obtenerNavMovilActivo(location.pathname);

  const pageHeader = getPageHeaderInfo(location.pathname) ?? DEFAULT_HEADER;

  const navigateTo = (id: string) => {
    const destino = navegacionMovil.find((opcion) => opcion.id === id)?.to ?? "/app";
    navigate({ to: destino as never });
  };

  return {
    sidebarOpen,
    closeSidebar,
    openSidebar,
    isOffline,
    handleLogout,
    opcionesBottomNav,
    activoMovil,
    navigateTo,
    pageHeader,
    path: location.pathname,
  };
}

function getPageHeaderInfo(path: string): PageHeaderInfo {
  const basePath = Object.keys(PAGE_HEADER_MAP).find((key) => path.startsWith(key));
  return basePath ? PAGE_HEADER_MAP[basePath]! : DEFAULT_HEADER;
}
