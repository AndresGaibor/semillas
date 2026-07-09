import * as React from "react";
import versiculoImg from "@/assets/images/Ilustraciones/Versiculo del dia.png";

export interface VersiculoDelDiaProps {
  texto: string;
  referencia: string;
}

export const VersiculoDelDia: React.FC<VersiculoDelDiaProps> = ({ texto, referencia }) => {
  return (
    <section 
      className="widget-card" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '24px', 
        borderRadius: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px', 
        background: 'var(--color-blanco)', 
        border: '2px solid var(--color-secundario-palido)' 
      }}
    >
      <div style={{ flex: 1, zIndex: 1 }}>
        <h2 
          className="section-title" 
          style={{ 
            marginBottom: '12px', 
            color: 'var(--color-secundario-oscuro)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}
        >
          <i className="fa-solid fa-book-bible" style={{ color: 'var(--color-secundario)' }}></i> Versículo del día
        </h2>
        <p 
          id="verse-text" 
          style={{ 
            fontSize: '1.15rem', 
            fontStyle: 'italic', 
            lineHeight: 1.5, 
            color: 'var(--color-neutro-oscuro-max)', 
            marginBottom: '8px' 
          }}
        >
          "{texto}"
        </p>
        <p 
          id="verse-ref" 
          style={{ 
            textAlign: 'right', 
            fontSize: '0.95rem', 
            fontWeight: 500, 
            color: 'var(--color-secundario-oscuro)' 
          }}
        >
          - {referencia}
        </p>
      </div>
      <div style={{ flex: '0 0 140px', zIndex: 1 }}>
        <img 
          src={versiculoImg} 
          alt="Versículo del día" 
          style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--sombra-md)' }} 
        />
      </div>
    </section>
  );
};
