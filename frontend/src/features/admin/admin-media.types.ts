export type MediaViewMode = "grid" | "list";

export type MediaCardItem = {
  id: string;
  nombre: string;
  tipo: "imagen" | "audio" | "video" | "documento";
  tipoLabel: string;
  imgUrl: string;
  usadoEnCount: number | null;
  subidoPor: string | null;
  fechaSubido: string;
  fechaTimestamp: number;
  tamano: string;
  tamanoBytes: number | null;
  formato: string;
  tipoMime: string | null;
  resolucion: string;
  dimensiones: string;
  anchoPx: number | null;
  altoPx: number | null;
  duracionSeg: number | null;
  altText: string | null;
};
