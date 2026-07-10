import { Link } from "@tanstack/react-router";
import { Button } from "@/componentes/ui/button";
import landingImg from "@/assets/images/banners/landing_page.png";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1>
          Aprende la Palabra de Dios <br />
          <span className="text-green">
            jugando <i className="fa-solid fa-seedling"></i>
          </span>
        </h1>
        <p>
          Semillas es una plataforma cristiana para niños que enseña el evangelio de
          forma lúdica, interactiva y segura.
        </p>

        <div className="hero__buttons">
          <Button
            asChild
            className="btn btn-primario btn-lg rounded-full px-6 py-3 h-auto text-base bg-[#2e9e5b] text-white hover:bg-[#218349]"
          >
            <Link to="/login" search={{ redirect: "/onboarding" }}>
              <i className="fa-solid fa-play mr-2"></i> Comenzar ahora
            </Link>
          </Button>
        </div>

        <div className="hero__badges">
          <span>
            <i className="fa-solid fa-shield-halved"></i> 100% segura
          </span>
          <span>
            <i className="fa-solid fa-face-smile"></i> Para niños 5-14 años
          </span>
          <span>
            <i className="fa-regular fa-heart"></i> Basada en la Biblia
          </span>
        </div>
      </div>

      <div className="hero__image">
        <img src={landingImg} alt="Niños aprendiendo" />
      </div>
    </section>
  );
}
