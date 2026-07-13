import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, subtitle, onClose, children }: ModalProps) {
  return (
    <div
      className="club-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="club-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="club-modal__sheet">
        <header>
          <div>
            <h2 id="club-modal-title">{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        {children}
      </section>
    </div>
  );
}
