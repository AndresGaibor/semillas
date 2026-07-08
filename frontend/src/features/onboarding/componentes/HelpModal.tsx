interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "450px",
          padding: "32px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#512DA8", margin: 0, lineHeight: 1.3 }}>
            Preguntas Frecuentes
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "#F5F5F5",
              border: "none",
              fontSize: "24px",
              lineHeight: 1,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#5C5C5C",
              cursor: "pointer",
            }}
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <div>
          <strong style={{ fontWeight: 700, color: "#512DA8", display: "block", marginBottom: "4px" }}>¿Qué es el apodo?</strong>
          <p style={{ fontSize: "15px", color: "#2E2E2E", lineHeight: 1.65, marginBottom: "16px" }}>
            Es un nombre corto o sobrenombre que usaremos para llamarte dentro de la aplicación de manera amigable. Te sugerimos no usar tu nombre real completo para proteger tu privacidad.
          </p>
          <strong style={{ fontWeight: 700, color: "#512DA8", display: "block", marginBottom: "4px" }}>¿Para qué sirve el avatar?</strong>
          <p style={{ fontSize: "15px", color: "#2E2E2E", lineHeight: 1.65, margin: 0 }}>
            Tu avatar es el personaje que te representará en las actividades de Semillas. Elige el que más te guste o con el que más te identifiques.
          </p>
        </div>
      </div>
    </div>
  );
}
