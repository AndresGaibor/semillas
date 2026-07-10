import { createFileRoute } from "@tanstack/react-router";
import dashboardBannerImg from "@/assets/images/banners/Dashboard_prinicipal.png";
import { VersiculoDelDia } from "../features/home/componentes/versiculo-del-dia";
import { PathsGrid } from "../features/home/componentes/paths-grid";
import { RachaWidget } from "../features/home/componentes/racha-widget";
import { InsigniasWidget } from "../features/home/componentes/insignias-widget";
import { useAppHomePage } from "../features/home/hooks/use-app-home-page";

export const Route = createFileRoute("/app/")({
  component: AppHomePage,
});

function AppHomePage() {
  const { verseOfTheDay, diasRacha, insignias } = useAppHomePage();

  return (
    <>
      <div className="dashboard-banner">
        <img
          src={dashboardBannerImg}
          alt="Dashboard Principal"
          className="w-full max-h-[250px] rounded-2xl object-cover object-center"
        />
      </div>

      <VersiculoDelDia texto={verseOfTheDay?.text ?? ""} referencia={verseOfTheDay?.ref ?? ""} />

      <section className="flex flex-col gap-6">
        <RachaWidget diasRacha={diasRacha} />
        <InsigniasWidget insignias={insignias} />
      </section>
    </>
  );
}
