import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../features/profile/profile.api";
import { getMyGamification } from "../features/gamification/gamification.api";
import { useState, useEffect } from "react";

import dashboardBannerImg from "@/assets/images/banners/Dashboard_prinicipal.png";
import versiculoImg from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import sendaPadreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import sendaHijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import sendaEspirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";

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
  const meQuery = useQuery({ queryKey: ["me"], queryFn: getMe });
  const gamificationQuery = useQuery({ queryKey: ["gamification", "me"], queryFn: getMyGamification });
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
      <section className="widget-card" style={{ position: 'relative', overflow: 'hidden', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '24px', background: 'var(--color-blanco)', border: '2px solid var(--color-secundario-palido)' }}>
        <div style={{ flex: 1, zIndex: 1 }}>
          <h2 className="section-title" style={{ marginBottom: '12px', color: 'var(--color-secundario-oscuro)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-book-bible" style={{ color: 'var(--color-secundario)' }}></i> Versículo del día
          </h2>
          <p id="verse-text" style={{ fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--color-neutro-oscuro-max)', marginBottom: '8px' }}>
            "{verseOfTheDay.text}"
          </p>
          <p id="verse-ref" style={{ textAlign: 'right', fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-secundario-oscuro)' }}>
            - {verseOfTheDay.ref}
          </p>
        </div>
        <div style={{ flex: '0 0 140px', zIndex: 1 }}>
          <img src={versiculoImg} alt="Versículo del día" style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--sombra-md)' }} />
        </div>
      </section>

      {/* Elige tu senda */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Elige tu senda</h2>
        </div>
        <div className="paths-grid">
          {/* Senda Padre */}
          <div className="path-card path-card--yellow" style={{ minHeight: '140px' }}>
            <img src={sendaPadreImg} alt="Senda del Padre" className="path-card__img" style={{ left: '-15px' }} />
            <div className="path-card__content" style={{ width: '55%' }}>
              <span className="path-card__label">Senda del</span>
              <h3 className="path-card__title">Padre</h3>
              <p className="path-card__desc">Dios es nuestro Padre amoroso.</p>
              <Link to="/app/sendas#padre" className="path-card__btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          
          {/* Senda Hijo */}
          <div className="path-card path-card--blue" style={{ minHeight: '140px' }}>
            <img src={sendaHijoImg} alt="Senda del Hijo" className="path-card__img" style={{ left: '-15px' }} />
            <div className="path-card__content" style={{ width: '55%' }}>
              <span className="path-card__label">Senda del</span>
              <h3 className="path-card__title">Hijo</h3>
              <p className="path-card__desc">Jesús es nuestro Salvador y amigo.</p>
              <Link to="/app/sendas#hijo" className="path-card__btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          
          {/* Senda Espíritu Santo */}
          <div className="path-card path-card--purple" style={{ minHeight: '140px' }}>
            <img src={sendaEspirituImg} alt="Senda del Espíritu Santo" className="path-card__img" style={{ left: '-15px' }} />
            <div className="path-card__content" style={{ width: '55%' }}>
              <span className="path-card__label">Senda del</span>
              <h3 className="path-card__title">Espíritu Santo</h3>
              <p className="path-card__desc">El Espíritu Santo nos guía y fortalece.</p>
              <Link to="/app/sendas#espiritu" className="path-card__btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Racha y Insignias Container */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Racha Horizontal */}
        <div className="widget-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>Racha actual</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Completa una lección para iniciar tu racha.</p>
          </div>
          <div className="empty-state-widget" style={{ margin: 0, padding: '16px', minHeight: 'auto', width: 'auto', aspectRatio: '1/1', borderRadius: '50%' }}>
            <i className="fa-solid fa-fire" style={{ fontSize: '2rem' }}></i>
          </div>
        </div>

        {/* Insignias */}
        <div className="widget-card">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <h2 className="section-title">Insignias</h2>
          </div>
          <div className="empty-state-widget">
            <i className="fa-solid fa-medal"></i>
            <p>Aún no tienes insignias.</p>
          </div>
        </div>
      </section>
    </>
  );
}
