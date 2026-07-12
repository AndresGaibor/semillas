import { Link } from "@tanstack/react-router";
import { AppAccountMenu } from "./app-account-menu";
import logoImg from "@/assets/images/logos/Logotipo.png";

type AppUserHeaderProps = {
  title: string;
  subtitle: string;
  nombreVisible: string;
  nivelTexto: string;
  avatarUrl: string;
  onLogout: () => void;
  isOffline: boolean;
  esInicio?: boolean;
};

export function AppUserHeader({
  title,
  subtitle,
  nombreVisible,
  nivelTexto,
  avatarUrl,
  onLogout,
  isOffline,
  esInicio = false,
}: AppUserHeaderProps) {
  return (
    <header className={`app-user-header ${esInicio ? "app-user-header--home" : ""}`} aria-label="Encabezado de la pantalla">
      <div className="app-user-header__desktop-row">
        <div className="app-user-header__page-copy">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        <AppAccountMenu
          nombreVisible={nombreVisible}
          nivelTexto={nivelTexto}
          avatarUrl={avatarUrl}
          onLogout={onLogout}
        />
      </div>

      <div className="app-user-header__mobile-row">
        <Link to="/app" className="app-user-header__mobile-brand" aria-label="Ir al inicio">
          <img src={logoImg} alt="Semillas" className="app-user-header__logo" />
        </Link>

        <h1 className="app-user-header__mobile-title">{title}</h1>

        <AppAccountMenu
          nombreVisible={nombreVisible}
          nivelTexto={nivelTexto}
          avatarUrl={avatarUrl}
          onLogout={onLogout}
        />
      </div>

      {isOffline ? (
        <div className="app-user-header__offline" role="status">
          Estás sin conexión. Tu progreso se sincronizará cuando vuelva internet.
        </div>
      ) : null}
    </header>
  );
}
