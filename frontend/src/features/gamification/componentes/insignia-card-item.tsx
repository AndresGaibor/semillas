import * as React from "react";
import { CheckCircle2, Gift, LockKeyhole, Loader2, Share2, Sparkles } from "lucide-react";

export interface InsigniaCardItemProps {
  id?: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  criterio: string;
  bono_xp: number;
  imagen: string;
  obtenido: boolean;
  ganadoEn?: string | null;
  progresoActual?: number;
  progresoObjetivo?: number;
  porcentaje?: number;
  pendienteReclamar?: boolean;
  reclamando?: boolean;
  onReclamar?: (id: string) => void;
  onCompartir?: () => void;
}

export const InsigniaCardItem: React.FC<InsigniaCardItemProps> = ({
  nombre,
  descripcion,
  criterio,
  bono_xp,
  imagen,
  obtenido,
  ganadoEn,
  progresoActual = 0,
  progresoObjetivo = 1,
  porcentaje = obtenido ? 100 : 0,
  id,
  pendienteReclamar = false,
  reclamando = false,
  onReclamar,
  onCompartir,
}) => (
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
        <span className="logro-card__xp"><Sparkles size={14} aria-hidden="true" />+{bono_xp} XP</span>
      </div>
      <p className="logro-card__criterion">{criterio}</p>
      <p className="logro-card__description">{descripcion}</p>

      {!obtenido ? (
        <div className="logro-card__progress">
          <div><span>Progreso</span><strong>{progresoActual}/{progresoObjetivo}</strong></div>
          <div role="progressbar" aria-label={`Progreso de ${nombre}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={porcentaje}><span style={{ width: `${porcentaje}%` }} /></div>
        </div>
      ) : null}

      <div className="logro-card__footer">
        <span className={`logro-card__status ${obtenido ? "is-earned" : ""}`}>{obtenido ? (pendienteReclamar ? "Lista para reclamar" : "Reclamada") : "En progreso"}</span>
        {obtenido && ganadoEn ? (
          <time dateTime={ganadoEn} className="logro-card__date">
            {new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(ganadoEn))}
          </time>
        ) : null}
      </div>
      {pendienteReclamar ? (
        <div className="logro-card__claim-actions">
          <button type="button" className="logro-card__claim-button" disabled={reclamando || !id} onClick={() => id && onReclamar?.(id)}>
            {reclamando ? <Loader2 size={15} className="animate-spin" /> : <Gift size={15} />}
            {reclamando ? "Reclamando…" : "Reclamar XP"}
          </button>
          {onCompartir ? <button type="button" className="logro-card__share-button" onClick={onCompartir} aria-label={`Compartir ${nombre}`}><Share2 size={15} /></button> : null}
        </div>
      ) : obtenido && onCompartir ? (
        <button type="button" className="logro-card__share-button" onClick={onCompartir} aria-label={`Compartir ${nombre}`}><Share2 size={15} /></button>
      ) : null}
    </div>
  </article>
);
