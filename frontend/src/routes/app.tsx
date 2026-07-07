import { Link, Outlet, createFileRoute, redirect, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { hasSession } from "../shared/api/auth-guard";

import "./app.css";
import logoImg from "@/assets/images/logos/Logotipo.png";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!hasSession()) throw redirect({ to: "/login" });
  },
  component: AppLayout
});

function AppLayout() {
  const location = useLocation();
  const activePage = location.pathname;
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

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

  const closeSidebar = () => setSidebarOpen(false);

  // Prevenir scroll en body cuando el menú móvil está abierto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen]);

  return (
    <div className="app-container">
      {/* Overlay Móvil */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        id="sidebar-overlay"
        onClick={closeSidebar}
      />

      {/* ── BARRA LATERAL (SIDEBAR) ── */}
      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`} id="sidebar">
        <div className="sidebar__logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
          <img src={logoImg} alt="Semillas Logo" style={{ height: '48px' }} />
          <span className="sidebar__logo-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Semillas</span>
        </div>
        <div className="sidebar__tagline">Crecer en la Palabra, vivir su verdad</div>
        
        <nav className="sidebar__nav">
          <Link to="/app" onClick={closeSidebar} className={`sidebar__nav-item ${activePage === '/app' ? 'sidebar__nav-item--active' : ''}`}>
            <i className="fa-solid fa-house"></i> Inicio
          </Link>
          <Link to="/app/sendas" onClick={closeSidebar} className={`sidebar__nav-item ${activePage.includes('/sendas') ? 'sidebar__nav-item--active' : ''}`}>
            <i className="fa-solid fa-route"></i> Sendas
          </Link>
          <Link to="/app/temas" onClick={closeSidebar} className={`sidebar__nav-item ${activePage.includes('/temas') ? 'sidebar__nav-item--active' : ''}`}>
            <i className="fa-solid fa-book-open"></i> Mis temas
          </Link>
          <Link to="/app/clubes" onClick={closeSidebar} className={`sidebar__nav-item ${activePage.includes('/clubes') ? 'sidebar__nav-item--active' : ''}`}>
            <i className="fa-solid fa-users"></i> Clubes
          </Link>
          <Link to="/app/logros" onClick={closeSidebar} className={`sidebar__nav-item ${activePage.includes('/logros') ? 'sidebar__nav-item--active' : ''}`}>
            <i className="fa-solid fa-medal"></i> Insignias
          </Link>
          <Link to="/app/perfil" onClick={closeSidebar} className={`sidebar__nav-item ${activePage.includes('/perfil') ? 'sidebar__nav-item--active' : ''}`}>
            <i className="fa-regular fa-user"></i> Perfil
          </Link>
          <Link to="/app/descargas" onClick={closeSidebar} className={`sidebar__nav-item ${activePage.includes('/descargas') ? 'sidebar__nav-item--active' : ''}`}>
            <i className="fa-solid fa-download"></i> Descargas
          </Link>
        </nav>

        {isOffline && (
          <div className="sidebar__offline-card">
            <div className="sidebar__offline-title">
              <i className="fa-solid fa-circle-check"></i> Estás sin conexión
            </div>
            <p className="sidebar__offline-desc">Tu progreso se sincronizará cuando vuelva internet.</p>
            <button className="sidebar__offline-btn">Ver estado</button>
          </div>
        )}
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="main-content">
        
        {/* Topbar */}
        <header className="topbar">
          <button 
            className="mobile-menu-btn" 
            id="mobile-menu-btn" 
            aria-label="Abrir menú"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="topbar__greeting">
            <h1 className="topbar__greeting-title">Hola Semillero</h1>
            <p className="topbar__greeting-subtitle">Sigue aprendiendo y creciendo en la Palabra de Dios.</p>
          </div>

          <div className="topbar__actions">
            <button className="topbar__icon-btn" aria-label="Descargas">
              <i className="fa-solid fa-download"></i>
            </button>
            <button className="topbar__icon-btn" aria-label="Notificaciones">
              <i className="fa-regular fa-bell"></i>
              <span className="topbar__notification-badge">3</span>
            </button>

            <div className="topbar__profile">
              <div className="topbar__profile-avatar">
                <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=Felix" alt="Avatar" />
              </div>
              <div className="topbar__profile-info">
                <span className="topbar__profile-name">Semillero</span>
                <span className="topbar__profile-level">Explorador • Nivel 7</span>
              </div>
              <i className="fa-solid fa-chevron-down" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}></i>
            </div>
          </div>
        </header>

        {/* Contenido Específico Inyectado Aquí */}
        <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', gap: activePage.includes('/sendas') ? '32px' : '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
