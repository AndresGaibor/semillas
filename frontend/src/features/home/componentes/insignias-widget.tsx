import * as React from "react";

export interface Insignia {
  id: string;
  nombre: string;
  imagenUrl: string;
}

export interface InsigniasWidgetProps {
  insignias: Insignia[];
}

export const InsigniasWidget: React.FC<InsigniasWidgetProps> = ({ insignias }) => {
  const tieneInsignias = insignias && insignias.length > 0;

  return (
    <div className="widget-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--color-blanco)', border: '1.5px solid var(--color-border)' }}>
      <div className="section-header" style={{ marginBottom: tieneInsignias ? '16px' : 0, textAlign: 'left' }}>
        <h2 className="section-title" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Insignias</h2>
      </div>
      
      {tieneInsignias ? (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {insignias.map((insignia) => (
            <div 
              key={insignia.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '60px' 
              }}
            >
              <img 
                src={insignia.imagenUrl} 
                alt={insignia.nombre} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <span style={{ fontSize: '0.65rem', textAlign: 'center', marginTop: '4px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
                {insignia.nombre}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-widget">
          <i className="fa-solid fa-medal"></i>
          <p>Aún no tienes insignias.</p>
        </div>
      )}
    </div>
  );
};
