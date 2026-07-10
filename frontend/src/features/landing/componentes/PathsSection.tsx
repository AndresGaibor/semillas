import padreImg from "@/assets/images/Ilustraciones/Senda del Padre.png";
import hijoImg from "@/assets/images/Ilustraciones/Senda del hijo.png";
import espirituImg from "@/assets/images/Ilustraciones/Senda del espiritu santo.png";

interface PathCardProps {
  tipo: "padre" | "hijo" | "espiritu";
  titulo: string;
  descripcion: string;
}

export function PathCard({ tipo, titulo, descripcion }: PathCardProps) {
  const imagenes = {
    padre: padreImg,
    hijo: hijoImg,
    espiritu: espirituImg,
  };

  const variantClass = {
    padre: "path-card--yellow",
    hijo: "path-card--blue",
    espiritu: "path-card--purple",
  };

  return (
    <div className={`path-card ${variantClass[tipo]}`}>
      <div className="path-card__info">
        <span className="path-label">Senda del</span>
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
        <button className="icon-btn">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <img src={imagenes[tipo]} alt={`Senda del ${titulo}`} />
    </div>
  );
}

export function PathsSection() {
  const sendas = [
    { tipo: "padre" as const, titulo: "Padre", descripcion: "Dios es nuestro Padre amoroso." },
    { tipo: "hijo" as const, titulo: "Hijo", descripcion: "Jesús es nuestro Salvador y amigo." },
    { tipo: "espiritu" as const, titulo: "Espíritu Santo", descripcion: "El Espíritu Santo nos guía y fortalece." },
  ];

  return (
    <section id="sendas" className="paths">
      {sendas.map((senda) => (
        <PathCard key={senda.tipo} {...senda} />
      ))}
    </section>
  );
}
