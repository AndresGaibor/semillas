import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import "../estilos.css";
import "../landing.css";

import logoImg from "@/assets/images/logos/Logotipo.png";
import landingImg from "@/assets/images/banners/landing_page.png";
import padreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import hijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import espirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";
import clubesImg from "@/assets/images/Ilustraciones/Ninños 2.png";

export const Route = createFileRoute("/")({
  component: LandingPage
});

function LandingPage() {
  return (
    <div className="landing-wrapper">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar__logo">
          <img src={logoImg} alt="Semillas Logo" />
          <div className="navbar__logo-text">
            <span className="brand">Semillas</span>
            <span className="tagline">Crecer en la Palabra, vivir Su verdad</span>
          </div>
        </div>
        
        <nav className="navbar__nav">
          <a href="#" className="nav-item active">Inicio</a>
          <a href="#como-funciona" className="nav-item">Cómo funciona</a>
          <a href="#sendas" className="nav-item">Sendas</a>
          <a href="#clubes" className="nav-item">Clubes</a>
          <a href="#metodologia" className="nav-item">Metodología</a>
        </nav>

        <div className="navbar__actions">
          {/* Links to login and APK as requested */}
          <Button asChild className="btn btn-secundario rounded-full px-5 py-2 h-auto text-sm bg-transparent text-[#2e9e5b] border-2 border-[#2e9e5b] hover:bg-[#e6f4ea] hover:text-[#2e9e5b]">
            <Link to="/login"><i className="fa-solid fa-desktop mr-2"></i> Entrar Web</Link>
          </Button>
          <Button asChild className="btn btn-primario rounded-full px-5 py-2 h-auto text-sm bg-[#2e9e5b] text-white hover:bg-[#218349]">
            <a href="#"><i className="fa-solid fa-download mr-2"></i> Descargar APK</a>
          </Button>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero__content">
            <h1>Aprende la Palabra de Dios <br /><span className="text-green">jugando <i className="fa-solid fa-seedling"></i></span></h1>
            <p>Semillas es una plataforma cristiana para niños que enseña el evangelio de forma lúdica, interactiva y segura.</p>
            
            <div className="hero__buttons">
              <Button asChild className="btn btn-primario btn-lg rounded-full px-6 py-3 h-auto text-base bg-[#2e9e5b] text-white hover:bg-[#218349]">
                <Link to="/login"><i className="fa-solid fa-play mr-2"></i> Comenzar ahora</Link>
              </Button>
            </div>

            <div className="hero__badges">
              <span><i className="fa-solid fa-shield-halved"></i> 100% segura</span>
              <span><i className="fa-solid fa-face-smile"></i> Para niños 5-14 años</span>
              <span><i className="fa-regular fa-heart"></i> Basada en la Biblia</span>
            </div>
          </div>
          
          <div className="hero__image">
            <img src={landingImg} alt="Niños aprendiendo" />
          </div>
        </section>

        {/* Sendas */}
        <section id="sendas" className="paths">
          {/* Padre */}
          <div className="path-card path-card--yellow">
            <div className="path-card__info">
              <span className="path-label">Senda del</span>
              <h3>Padre</h3>
              <p>Dios es nuestro Padre amoroso.</p>
              <button className="icon-btn"><i className="fa-solid fa-arrow-right"></i></button>
            </div>
            <img src={padreImg} alt="Senda del Padre" />
          </div>

          {/* Hijo */}
          <div className="path-card path-card--blue">
            <div className="path-card__info">
              <span className="path-label">Senda del</span>
              <h3>Hijo</h3>
              <p>Jesús es nuestro Salvador y amigo.</p>
              <button className="icon-btn"><i className="fa-solid fa-arrow-right"></i></button>
            </div>
            <img src={hijoImg} alt="Senda del Hijo" />
          </div>

          {/* Espiritu Santo */}
          <div className="path-card path-card--purple">
            <div className="path-card__info">
              <span className="path-label">Senda del</span>
              <h3>Espíritu Santo</h3>
              <p>El Espíritu Santo nos guía y fortalece.</p>
              <button className="icon-btn"><i className="fa-solid fa-arrow-right"></i></button>
            </div>
            <img src={espirituImg} alt="Senda del Espíritu Santo" />
          </div>
        </section>

        {/* Separador */}
        <hr className="section-divider" />

        {/* Features */}
        <section id="como-funciona" className="features">
          <div className="feature-card feature-card--green">
            <div className="feature-card__icon"><i className="fa-solid fa-seedling"></i></div>
            <div className="feature-card__text">
              <h4>Aprende con CRECER</h4>
              <p>Nuestra metodología CRECER hace del aprendizaje una aventura espiritual.</p>
            </div>
          </div>

          <div className="feature-card feature-card--blue">
            <div className="feature-card__icon"><i className="fa-solid fa-cloud-arrow-down"></i></div>
            <div className="feature-card__text">
              <h4>Funciona offline</h4>
              <p>Descarga nuestra app y sigue aprendiendo sin conexión a internet.</p>
            </div>
          </div>

          <div className="feature-card feature-card--yellow">
            <div className="feature-card__icon"><i className="fa-solid fa-trophy"></i></div>
            <div className="feature-card__text">
              <h4>Gana insignias y XP</h4>
              <p>Completa actividades, gana XP y desbloquea recompensas.</p>
            </div>
          </div>
        </section>

        {/* Clubes */}
        <section id="clubes" className="clubes">
          <div className="clubes__content">
            <h2>Únete a los <span className="text-green">Clubes</span></h2>
            <p>Comparte lo que aprendes en grupo,en compañia de amigos¡Pertenece a una comunidad genial!</p>
            <Button asChild className="btn btn-primario btn-lg rounded-full px-6 py-3 h-auto text-base bg-[#2e9e5b] text-white hover:bg-[#218349]">
              <Link to="/login"><i className="fa-solid fa-users mr-2"></i> Ver Clubes</Link>
            </Button>
          </div>
          <div className="clubes__image">
            <img src={clubesImg} alt="Niños compartiendo en club" />
          </div>
        </section>

        {/* Methodology */}
        <section id="metodologia" className="methodology">
          <div className="methodology__header">
            <h2>Nuestra metodología <span className="text-green">CRECER</span></h2>
            <p>Seis pasos para conocer, vivir y compartir la Palabra de Dios.</p>
          </div>
          
          <div className="methodology__timeline">
            <div className="timeline-connector"></div>
            
            <div className="timeline-step">
              <div className="step-circle bg-green">C</div>
              <h4>Conectar</h4>
              <p>Me conecto con Dios y Su verdad.</p>
            </div>
            
            <div className="timeline-step">
              <div className="step-circle bg-blue">R</div>
              <h4>Relatar</h4>
              <p>Escucho y comprendo lo que dice la Biblia.</p>
            </div>
            
            <div className="timeline-step">
              <div className="step-circle bg-yellow">E</div>
              <h4>Enseñar</h4>
              <p>Aprendo y aplico en mi vida.</p>
            </div>
            
            <div className="timeline-step">
              <div className="step-circle bg-purple">C</div>
              <h4>Comprobar</h4>
              <p>Refuerzo lo aprendido con actividades.</p>
            </div>
            
            <div className="timeline-step">
              <div className="step-circle bg-red">E</div>
              <h4>Experimentar</h4>
              <p>Vivo lo aprendido en lo cotidiano.</p>
            </div>
            
            <div className="timeline-step">
              <div className="step-circle bg-orange">R</div>
              <h4>Recompensar</h4>
              <p>Dios me motiva a seguir creciendo.</p>
            </div>
            
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__logo">
          <div className="footer__logo-inner">
            <img src={logoImg} alt="Semillas Logo" />
            <span className="brand">Semillas</span>
          </div>
          <span className="tagline">Crecer en la Palabra, vivir Su verdad</span>
          <p className="copyright">© 2026 Semillas. Todos los derechos reservados.</p>
        </div>
        
        <div className="footer__heart">
          <i className="fa-regular fa-heart text-pink"></i>
          <span>Hecho con amor para la próxima generación.</span>
        </div>

        <div className="footer__verse">
          <p className="verse-text">"Id por todo el mundo y predicad el evangelio a toda criatura."</p>
          <span className="verse-ref">Marcos 16:15</span>
        </div>
      </footer>
    </div>
  );
}
