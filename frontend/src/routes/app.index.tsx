import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import dashboardBannerImg from "@/assets/images/banners/Dashboard_prinicipal.png";
import { VersiculoDelDia } from "../features/home/componentes/versiculo-del-dia";
import { PathsGrid } from "../features/home/componentes/paths-grid";
import { RachaWidget } from "../features/home/componentes/racha-widget";
import { InsigniasWidget } from "../features/home/componentes/insignias-widget";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { obtenerGamificacionPropia } from "../features/gamification/gamification.api";
import in1Img from "@/assets/images/Ilustraciones/in1.png";
import in2Img from "@/assets/images/Ilustraciones/in2.png";
import senderoPadreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import senderoHijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import senderoEspirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";

const VERSICULOS_DEL_DIA = [
  { text: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Jehová es mi pastor; nada me faltará.", ref: "Salmos 23:1" },
  { text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehova, pensamientos de paz, y no de mal...", ref: "Jeremías 29:11" },
  { text: "Confía en Jehova con todo tu corazón, y no te apoyes en tu propia prudencia.", ref: "Proverbios 3:5" },
  { text: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", ref: "Salmos 119:105" },
  { text: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.", ref: "Salmos 46:1" },
  { text: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", ref: "Mateo 6:33" },
  { text: "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.", ref: "1 Corintios 13:4" },
  { text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", ref: "Mateo 11:28" },
  { text: "En el principio creó Dios los cielos y la tierra.", ref: "Génesis 1:1" },
];

export const Route = createFileRoute("/app/")({
  component: AppHomePage,
});

function AppHomePage() {
  const meQuery = useQuery({ queryKey: ["me"], queryFn: obtenerMiPerfil });
  const gamificationQuery = useQuery({ queryKey: ["gamification", "me"], queryFn: obtenerGamificacionPropia });
  const [verseOfTheDay, setVerseOfTheDay] = useState(VERSICULOS_DEL_DIA[0]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const verseIndex = dayOfYear % VERSICULOS_DEL_DIA.length;
    setVerseOfTheDay(VERSICULOS_DEL_DIA[verseIndex]!);
  }, []);

  const diasRacha = 0;

  const insignias = useMemo(() => {
    const logros = gamificationQuery.data?.logros ?? [];
    return logros.map((l) => ({
      id: l.logro_id,
      nombre: l.logro?.nombre || "Insignia",
      imagenUrl: l.logro?.codigo === "primera_leccion" ? in1Img : in2Img,
    }));
  }, [gamificationQuery.data]);

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

      <PathsGrid
        sendaPadreImg={senderoPadreImg}
        sendaHijoImg={senderoHijoImg}
        sendaEspirituImg={senderoEspirituImg}
      />

      <section className="flex flex-col gap-6">
        <RachaWidget diasRacha={diasRacha} />
        <InsigniasWidget insignias={insignias} />
      </section>
    </>
  );
}
