export type MediaCardItem = {
  id: string;
  nombre: string;
  tipo: "imagen" | "audio" | "video" | "documento";
  tipoLabel: string;
  imgUrl: string;
  usadoEnCount: number | null;
  carpeta: string;
  subidoPor: string;
  fechaSubido: string;
  fechaTimestamp: number;
  tamano: string;
  formato: string;
  resolucion: string;
  dimensiones: string;
  altText: string;
  etiquetas: string[];
};
