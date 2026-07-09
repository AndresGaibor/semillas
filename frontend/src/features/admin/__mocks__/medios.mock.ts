import imgSemilla from "@/assets/images/Ilustraciones/Semilla.png";
import imgIn1 from "@/assets/images/Ilustraciones/in1.png";
import imgVersiculo from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import imgIn2 from "@/assets/images/Ilustraciones/in2.png";
import imgTema2 from "@/assets/images/Ilustraciones/Tema2.png";
import imgTema3 from "@/assets/images/Ilustraciones/Tema3.png";
import imgExploradores from "@/assets/images/Ilustraciones/Exploradores.png";
import imgEmbajadores from "@/assets/images/Ilustraciones/Embajadores.png";

export type MediaCardItem = {
  id: string;
  nombre: string;
  tipo: "imagen" | "audio" | "video" | "documento";
  tipoLabel: string;
  imgUrl: string;
  usadoEnCount: number;
  carpeta: string;
  subidoPor: string;
  fechaSubido: string;
  tamano: string;
  formato: string;
  resolucion: string;
  dimensiones: string;
  altText: string;
  etiquetas: string[];
};

export const mockupMedias: MediaCardItem[] = [
  {
    id: "mock-med-1",
    nombre: "semilla_crece.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgSemilla,
    usadoEnCount: 5,
    carpeta: "Ilustraciones",
    subidoPor: "Ana Torres",
    fechaSubido: "12 may, 2024 09:20",
    tamano: "1.2 MB",
    formato: "JPG",
    resolucion: "1920 x 1080",
    dimensiones: "16:9",
    altText: "Semilla brotando en la tierra con luz natural.",
    etiquetas: ["creación", "crecimiento", "naturaleza", "fe"],
  },
  {
    id: "mock-med-2",
    nombre: "oracion_nino.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgIn1,
    usadoEnCount: 3,
    carpeta: "Ilustraciones",
    subidoPor: "Luis García",
    fechaSubido: "11 may, 2024 14:15",
    tamano: "850 KB",
    formato: "JPG",
    resolucion: "1200 x 800",
    dimensiones: "3:2",
    altText: "Niño orando por la mañana en su habitación.",
    etiquetas: ["oración", "niño", "fe", "devocional"],
  },
  {
    id: "mock-med-3",
    nombre: "biblia_abierta.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgVersiculo,
    usadoEnCount: 7,
    carpeta: "Ilustraciones",
    subidoPor: "Ana Torres",
    fechaSubido: "10 may, 2024 16:30",
    tamano: "1.5 MB",
    formato: "JPG",
    resolucion: "1920 x 1280",
    dimensiones: "3:2",
    altText: "Biblia abierta con luz de fondo cálida.",
    etiquetas: ["versículo", "palabra", "estudio", "enseñanza"],
  },
  {
    id: "mock-med-4",
    nombre: "alegria_en_dios.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgIn2,
    usadoEnCount: 2,
    carpeta: "Ilustraciones",
    subidoPor: "Juan Pérez",
    fechaSubido: "09 may, 2024 11:10",
    tamano: "2.1 MB",
    formato: "JPG",
    resolucion: "2000 x 2000",
    dimensiones: "1:1",
    altText: "Niño feliz saltando en el campo bajo el sol.",
    etiquetas: ["alegría", "gozo", "niños", "naturaleza"],
  },
  {
    id: "mock-med-5",
    nombre: "camino_verdad.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgTema2,
    usadoEnCount: 4,
    carpeta: "Ilustraciones",
    subidoPor: "María López",
    fechaSubido: "08 may, 2024 08:45",
    tamano: "950 KB",
    formato: "JPG",
    resolucion: "1920 x 1080",
    dimensiones: "16:9",
    altText: "Camino de tierra rodeado de árboles y sol.",
    etiquetas: ["senda", "camino", "verdad", "sabiduría"],
  },
  {
    id: "mock-med-6",
    nombre: "amor_projimo.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgTema3,
    usadoEnCount: 6,
    carpeta: "Ilustraciones",
    subidoPor: "Luis García",
    fechaSubido: "07 may, 2024 10:20",
    tamano: "1.1 MB",
    formato: "JPG",
    resolucion: "1280 x 720",
    dimensiones: "16:9",
    altText: "Manos sosteniendo un corazón rojo de lana.",
    etiquetas: ["amor", "prójimo", "compartir", "relaciones"],
  },
  {
    id: "mock-med-7",
    nombre: "ninos_aprendiendo.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgExploradores,
    usadoEnCount: 3,
    carpeta: "Ilustraciones",
    subidoPor: "Ana Torres",
    fechaSubido: "06 may, 2024 15:05",
    tamano: "1.8 MB",
    formato: "PNG",
    resolucion: "1500 x 1000",
    dimensiones: "3:2",
    altText: "Grupo de niños sentados aprendiendo en círculo.",
    etiquetas: ["compañerismo", "clubes", "enseñanza", "crecer"],
  },
  {
    id: "mock-med-8",
    nombre: "creacion_dios.jpg",
    tipo: "imagen",
    tipoLabel: "Imagen",
    imgUrl: imgEmbajadores,
    usadoEnCount: 2,
    carpeta: "Ilustraciones",
    subidoPor: "Juan Pérez",
    fechaSubido: "05 may, 2024 17:50",
    tamano: "2.4 MB",
    formato: "PNG",
    resolucion: "1920 x 1080",
    dimensiones: "16:9",
    altText: "Montañas verdes con el cielo al atardecer.",
    etiquetas: ["creación", "paisaje", "naturaleza", "grandiosidad"],
  },
];
