import { createFileRoute } from "@tanstack/react-router";
import dashboardBannerImg from "@/assets/images/banners/Dashboard_prinicipal.png";
import senderoPadreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import senderoHijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import senderoEspirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";
import { InicioHero } from "@/features/home/componentes/inicio-hero";
import { InsigniasWidget } from "@/features/home/componentes/insignias-widget";
import { PathsGrid } from "@/features/home/componentes/paths-grid";
import { RachaWidget } from "@/features/home/componentes/racha-widget";
import { ResumenProgreso } from "@/features/home/componentes/resumen-progreso";
import { VersiculoDelDia } from "@/features/home/componentes/versiculo-del-dia";
import { useAppHomePage } from "@/features/home/hooks/use-app-home-page";

export const Route = createFileRoute("/app/")({
  component: AppHomePage,
});

function AppHomePage() {
  const {
    verseOfTheDay,
    diasRacha,
    insignias,
    nombreUsuario,
    progreso,
    isError,
  } = useAppHomePage();

  return (
    <div className="app-home">
      <InicioHero imagenUrl={dashboardBannerImg} nombreUsuario={nombreUsuario} />

      <ResumenProgreso
        xpTotal={progreso.xpTotal}
        numeroNivel={progreso.numeroNivel}
        nombreNivel={progreso.nombreNivel}
        diasRacha={diasRacha}
        totalInsignias={progreso.totalInsignias}
      />

      {isError ? (
        <p className="app-home__notice" role="status">
          No pudimos actualizar tu progreso. Puedes seguir explorando tus temas.
        </p>
      ) : null}

      <div className="app-home__dashboard">
        <div className="app-home__primary">
          <PathsGrid
            sendaPadreImg={senderoPadreImg}
            sendaHijoImg={senderoHijoImg}
            sendaEspirituImg={senderoEspirituImg}
          />
        </div>

        <aside className="app-home__aside" aria-label="Inspiración y progreso">
          <VersiculoDelDia texto={verseOfTheDay.text} referencia={verseOfTheDay.ref} />
          <RachaWidget diasRacha={diasRacha} />
          <InsigniasWidget insignias={insignias} />
        </aside>
      </div>
    </div>
  );
}
