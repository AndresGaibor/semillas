import * as React from "react";
import { Link } from "@tanstack/react-router";

export interface SendaCardProps {
  variante: "padre" | "hijo" | "espiritu";
  imagenUrl: string;
  label: string;
  titulo: string;
  descripcion: string;
  hash: string;
}

export const SendaCard: React.FC<SendaCardProps> = ({
  variante,
  imagenUrl,
  label,
  titulo,
  descripcion,
  hash,
}) => {
  const getVarianteClass = () => {
    switch (variante) {
      case "padre":
        return "path-card--yellow";
      case "hijo":
        return "path-card--blue";
      case "espiritu":
        return "path-card--purple";
      default:
        return "";
    }
  };

  return (
    <div className={`path-card ${getVarianteClass()}`} style={{ minHeight: "140px" }}>
      <img
        src={imagenUrl}
        alt={`Senda del ${titulo}`}
        className="path-card__img"
        style={{ left: "-15px" }}
      />
      <div className="path-card__content" style={{ width: "55%" }}>
        <span className="path-card__label">{label}</span>
        <h3 className="path-card__title">{titulo}</h3>
        <p className="path-card__desc">{descripcion}</p>
        <Link
          to="/app/sendas"
          hash={hash}
          className="path-card__btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};
