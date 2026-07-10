import { Link } from "@tanstack/react-router";
import { Button } from "@/componentes/ui/button";
import clubesImg from "@/assets/images/Ilustraciones/Ninños 2.png";

export function ClubesSection() {
  return (
    <section id="clubes" className="clubes">
      <div className="clubes__content">
        <h2>
          Únete a los <span className="text-green">Clubes</span>
        </h2>
        <p>
          Comparte lo que aprendes en grupo,en compañía de amigos¡Pertenece a una
          comunidad genial!
        </p>
        <Button
          asChild
          className="btn btn-primario btn-lg rounded-full px-6 py-3 h-auto text-base bg-[#2e9e5b] text-white hover:bg-[#218349]"
        >
          <Link to="/login" search={{ redirect: "/onboarding" }}>
            <i className="fa-solid fa-users mr-2"></i> Ver Clubes
          </Link>
        </Button>
      </div>
      <div className="clubes__image">
        <img src={clubesImg} alt="Niños compartiendo en club" />
      </div>
    </section>
  );
}
