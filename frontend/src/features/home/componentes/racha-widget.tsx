import * as React from "react";

export interface RachaWidgetProps {
  diasRacha: number;
}

export const RachaWidget: React.FC<RachaWidgetProps> = ({ diasRacha }) => {
  const tieneRacha = diasRacha > 0;

  return (
    <div 
      className="widget-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'stretch', 
        justifyContent: 'space-between',
        gap: '16px',
        padding: '20px',
        borderRadius: '16px',
        background: 'var(--color-blanco)',
        border: '1.5px solid var(--color-border)'
      }}
    >
      <div style={{ flex: 1, textAlign: 'left' }}>
        <h2 className="section-title" style={{ marginBottom: '8px', fontSize: '1rem', fontWeight: 'bold' }}>
          {tieneRacha ? "Racha actual" : "Racha actual"}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
          {tieneRacha 
            ? `¡Increíble! Has estudiado ${diasRacha} días seguidos.` 
            : "Completa una lección para iniciar tu racha."
          }
        </p>
      </div>
      <div 
        className={tieneRacha ? "" : "empty-state-widget"} 
        style={{ 
          margin: 0,
          alignSelf: 'center', 
          padding: '16px', 
          minHeight: 'auto', 
          width: 'auto', 
          aspectRatio: '1/1', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tieneRacha ? 'var(--color-yellow-light)' : undefined,
          color: tieneRacha ? 'var(--color-yellow)' : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <i className="fa-solid fa-fire" style={{ fontSize: '1.75rem' }}></i>
          {tieneRacha && (
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', marginLeft: '4px' }}>{diasRacha}</span>
          )}
        </div>
      </div>
    </div>
  );
};
