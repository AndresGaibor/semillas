import * as React from "react";
import { CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";

import confetti from "canvas-confetti";

export interface InsigniaCardItemProps {
  codigo: string;
  nombre: string;
  descripcion: string;
  criterio: string;
  bono_xp: number;
  imagen: string;
  obtenido: boolean;
  ganadoEn?: string | null;
}

export const InsigniaCardItem: React.FC<InsigniaCardItemProps> = ({
  nombre,
  descripcion,
  criterio,
  bono_xp,
  imagen,
  obtenido,
  ganadoEn,
}) => {
  const [mockReclamado, setMockReclamado] = React.useState(false);

  const handleReclamar = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ["#16a34a", "#22c55e", "#facc15", "#ffffff"]
    });

    setMockReclamado(true);
  };

  return (
    <article className={`logro-card ${obtenido ? "is-earned" : "is-locked"}`}>
      <div className="logro-card__visual">
        <img src={imagen} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span className="logro-card__state-icon" aria-hidden="true">
          {obtenido ? <CheckCircle2 size={18} /> : <LockKeyhole size={17} />}
        </span>
      </div>

      <div className="logro-card__content">
        <div className="logro-card__heading">
          <h2>{nombre}</h2>
          <span className="logro-card__xp">
            <Sparkles size={14} aria-hidden="true" />
            +{bono_xp} XP
          </span>
        </div>

        <p className="logro-card__criterion">{criterio}</p>
        <p className="logro-card__description">{descripcion}</p>

        <div className="logro-card__footer" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className={`logro-card__status ${obtenido ? "is-earned" : ""}`}>
            {obtenido ? "Obtenida" : "Por obtener"}
          </span>
          {obtenido && ganadoEn && (
            <time dateTime={ganadoEn} className="logro-card__date">
              {new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(ganadoEn))}
            </time>
          )}
          
          {/* MOCK BUTTON FOR ANIMATION TEST */}
          {obtenido && !mockReclamado && (
            <button 
              onClick={handleReclamar}
              style={{
                background: "linear-gradient(135deg, #16a34a, #22c55e)",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(22, 163, 74, 0.3)",
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "transform 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <Sparkles size={12} />
              Reclamar
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
