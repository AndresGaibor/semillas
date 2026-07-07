import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { obtenerMiPerfil } from "../features/profile/profile.api";
import { obtenerGamificacionPropia } from "../features/gamification/gamification.api";
import { useState, useEffect, useMemo } from "react";

import dashboardBannerImg from "@/assets/images/banners/Dashboard_prinicipal.png";
import sendaPadreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import sendaHijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import sendaEspirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";

// Importaciones de ilustraciones de insignias
import in1Img from "@/assets/images/Ilustraciones/in1.png";
import in2Img from "@/assets/images/Ilustraciones/in2.png";

// Subcomponentes descompuestos
import { VersiculoDelDia } from "../features/home/componentes/versiculo-del-dia";
import { PathsGrid } from "../features/home/componentes/paths-grid";
import { RachaWidget } from "../features/home/componentes/racha-widget";
import { InsigniasWidget } from "../features/home/componentes/insignias-widget";

export const Route = createFileRoute("/app/")({
  component: AppHomePage
});

const dailyVerses = [
  { text: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Jehová es mi pastor; nada me faltará.", ref: "Salmos 23:1" },
  { text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal...", ref: "Jeremías 29:11" },
  { text: "Confía en Jehová con todo tu corazón, y no te apoyes en tu propia prudencia.", ref: "Proverbios 3:5" },
  { text: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", ref: "Salmos 119:105" },
  { text: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.", ref: "Salmos 46:1" },
  { text: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", ref: "Mateo 6:33" },
  { text: "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.", ref: "1 Corintios 13:4" },
  { text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", ref: "Mateo 11:28" },
  { text: "En el principio creó Dios los cielos y la tierra.", ref: "Génesis 1:1" }
];

function AppHomePage() {
  const meQuery = useQuery({ queryKey: ["me"], queryFn: obtenerMiPerfil });
  const gamificationQuery = useQuery({ queryKey: ["gamification", "me"], queryFn: obtenerGamificacionPropia });
  const [verseOfTheDay, setVerseOfTheDay] = useState(dailyVerses[0]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const verseIndex = dayOfYear % dailyVerses.length;
    setVerseOfTheDay(dailyVerses[verseIndex]);
  }, []);

  const diasRacha = 0;
  const logrosObtenidos = useMemo(() => {
    const logros = (gamificationQuery.data?.logros as any[]) || [];
    return logros.map((l) => ({
      id: l.id,
      nombre: l.logro?.nombre || "Insignia",
      imagenUrl: l.logro?.codigo === "primera_leccion" ? in1Img : in2Img,
    }));
  }, [gamificationQuery.data]);

  return (
    <>
      {/* Dashboard Principal Image */}
      <div className="dashboard-banner">
        <img 
          src={dashboardBannerImg} 
          alt="Dashboard Principal" 
          style={{ width: '100%', maxHeight: '250px', borderRadius: '16px', objectFit: 'cover', objectPosition: 'center' }} 
        />
      </div>

      {/* Versículo del día */}
      <VersiculoDelDia 
        texto={verseOfTheDay?.text ?? ""} 
        referencia={verseOfTheDay?.ref ?? ""} 
      />

      {/* Elige tu senda */}
      <PathsGrid 
        sendaPadreImg={sendaPadreImg} 
        sendaHijoImg={sendaHijoImg} 
        sendaEspirituImg={sendaEspirituImg} 
      />

      {/* Racha e Insignias Container */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <RachaWidget diasRacha={diasRacha} />
        <InsigniasWidget insignias={logrosObtenidos} />
      </section>
    </>
  );
}
