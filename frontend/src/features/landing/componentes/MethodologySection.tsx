interface TimelineStepProps {
  letra: string;
  color: string;
  nombre: string;
  descripcion: string;
}

export function TimelineStep({ letra, color, nombre, descripcion }: TimelineStepProps) {
  return (
    <div className="timeline-step">
      <div className={`step-circle ${color}`}>{letra}</div>
      <h4>{nombre}</h4>
      <p>{descripcion}</p>
    </div>
  );
}

export function MethodologySection() {
  const pasos = [
    { letra: "C", color: "bg-green", nombre: "Conectar", descripcion: "Me conecto con Dios y Su verdad." },
    { letra: "R", color: "bg-blue", nombre: "Relatar", descripcion: "Escucho y comprendo lo que dice la Biblia." },
    { letra: "E", color: "bg-yellow", nombre: "Enseñar", descripcion: "Aprendo y aplico en mi vida." },
    { letra: "C", color: "bg-purple", nombre: "Comprobar", descripcion: "Refuerzo lo aprendido con actividades." },
    { letra: "E", color: "bg-red", nombre: "Experimentar", descripcion: "Vivo lo aprendido en lo cotidiano." },
    { letra: "R", color: "bg-orange", nombre: "Recompensar", descripcion: "Dios me motiva a seguir creciendo." },
  ];

  return (
    <section id="metodologia" className="methodology">
      <div className="methodology__header">
        <h2>
          Nuestra metodología <span className="text-green">CRECER</span>
        </h2>
        <p>Seis pasos para conocer, vivir y compartir la Palabra de Dios.</p>
      </div>

      <div className="methodology__timeline">
        <div className="timeline-connector"></div>

        {pasos.map((paso) => (
          <TimelineStep key={paso.nombre} {...paso} />
        ))}
      </div>
    </section>
  );
}
