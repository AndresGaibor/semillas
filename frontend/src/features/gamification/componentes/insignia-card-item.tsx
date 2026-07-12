import * as React from "react";
import { CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";

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

        <div className="logro-card__footer">
          <span className={`logro-card__status ${obtenido ? "is-earned" : ""}`}>
            {obtenido ? "Obtenida" : "Por obtener"}
          </span>
          {obtenido && ganadoEn ? (
            <time dateTime={ganadoEn} className="logro-card__date">
              {new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(ganadoEn))}
            </time>
          ) : null}
        </div>
      </div>
    </article>
  );
};
