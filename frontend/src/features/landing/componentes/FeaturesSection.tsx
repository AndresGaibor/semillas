import { Link } from "@tanstack/react-router";
import { Button } from "@/componentes/ui/button";

interface FeatureCardProps {
  variante: "green" | "blue" | "yellow";
  icono: string;
  titulo: string;
  descripcion: string;
}

export function FeatureCard({ variante, icono, titulo, descripcion }: FeatureCardProps) {
  const variantClass = `feature-card--${variante}`;

  return (
    <div className={`feature-card ${variantClass}`}>
      <div className="feature-card__icon">
        <i className={icono}></i>
      </div>
      <div className="feature-card__text">
        <h4>{titulo}</h4>
        <p>{descripcion}</p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      variante: "green" as const,
      icono: "fa-solid fa-seedling",
      titulo: "Aprende con CRECER",
      descripcion: "Nuestra metodología CRECER hace del aprendizaje una aventura espiritual.",
    },
    {
      variante: "blue" as const,
      icono: "fa-solid fa-cloud-arrow-down",
      titulo: "Funciona offline",
      descripcion: "Descarga nuestra app y sigue aprendiendo sin conexión a internet.",
    },
    {
      variante: "yellow" as const,
      icono: "fa-solid fa-trophy",
      titulo: "Gana insignias y XP",
      descripcion: "Completa actividades, gana XP y desbloquea recompensas.",
    },
  ];

  return (
    <section id="como-funciona" className="features">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </section>
  );
}
