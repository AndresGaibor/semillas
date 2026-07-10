import { useState, useCallback } from "react";

const COLORES_TIPO = {
  imagen: "from-[#2e9e5b]/20 to-[#2e9e5b]/5 text-[#2e9e5b]",
  audio: "from-[#6c3aed]/20 to-[#6c3aed]/5 text-[#6c3aed]",
  video: "from-[#ee6c4d]/20 to-[#ee6c4d]/5 text-[#ee6c4d]",
  documento: "from-[#17a398]/20 to-[#17a398]/5 text-[#17a398]",
} as const;

const ICONOS_TIPO = {
  imagen: "fa-regular fa-image",
  audio: "fa-solid fa-volume-high",
  video: "fa-solid fa-circle-play",
  documento: "fa-solid fa-file-pdf",
} as const;

type TipoMedia = keyof typeof COLORES_TIPO;

type Props = {
  src: string;
  alt: string;
  tipo?: TipoMedia;
  className?: string;
};

export function ImageWithFallback({ src, alt, tipo = "imagen", className = "" }: Props) {
  const [fallo, setFallo] = useState(false);

  const manejarError = useCallback(() => setFallo(true), []);

  if (fallo) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${COLORES_TIPO[tipo]} ${className}`}
      >
        <i className={`${ICONOS_TIPO[tipo]} text-3xl opacity-40`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={manejarError}
    />
  );
}
