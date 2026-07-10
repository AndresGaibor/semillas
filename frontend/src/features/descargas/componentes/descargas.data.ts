import arkImg from "@/assets/images/Ilustraciones/Tema1.png";
import prayerImg from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import davidImg from "@/assets/images/Ilustraciones/Exploradores.png";
import mazeImg from "@/assets/images/Ilustraciones/Tema3.png";
import jesusKidsImg from "@/assets/images/Ilustraciones/Ninos 2.png";
import versesImg from "@/assets/images/Ilustraciones/Tema4.png";

export type TipoRecurso = "Historia" | "Actividad" | "Imprimible" | "Canción";
export type EdadRecurso = "5-8" | "9-12" | "13-17" | "3-6";

export interface Recurso {
  id: string;
  titulo: string;
  tipo: TipoRecurso;
  edad: EdadRecurso;
  sizeMB: number;
  descripcion: string;
  imagen: string;
  fecha: string;
}

export const RECURSOS_CATALOGO: Recurso[] = [
  {
    id: "noe",
    titulo: "La historia de Noé",
    tipo: "Historia",
    edad: "5-8",
    sizeMB: 15.2,
    descripcion: "Conoce cómo Dios protegió a Noé y a los animales del gran diluvio.",
    imagen: arkImg,
    fecha: "2026-07-01",
  },
  {
    id: "oracion",
    titulo: "Oración de la noche",
    tipo: "Canción",
    edad: "3-6",
    sizeMB: 3.4,
    descripcion: "Canción suave para agradecer a Dios antes de dormir.",
    imagen: prayerImg,
    fecha: "2026-07-05",
  },
  {
    id: "david",
    titulo: "David y Goliat",
    tipo: "Historia",
    edad: "5-8",
    sizeMB: 18.7,
    descripcion: "Aprende cómo David confió en Dios y derrotó al gigante Goliat.",
    imagen: davidImg,
    fecha: "2026-06-25",
  },
  {
    id: "laberinto",
    titulo: "Laberinto: El buen pastor",
    tipo: "Actividad",
    edad: "5-8",
    sizeMB: 2.1,
    descripcion: "Encuentra el camino para ayudar al pastor a cuidar sus ovejas.",
    imagen: mazeImg,
    fecha: "2026-07-06",
  },
  {
    id: "jesus_ninos",
    titulo: "Jesús ama a los niños",
    tipo: "Imprimible",
    edad: "3-6",
    sizeMB: 1.8,
    descripcion: "Dibujo para colorear e imprimir sobre el amor de Jesús.",
    imagen: jesusKidsImg,
    fecha: "2026-06-20",
  },
  {
    id: "versiculos_animo",
    titulo: "Versículos de ánimo",
    tipo: "Historia",
    edad: "5-8",
    sizeMB: 12.6,
    descripcion: "Versículos bíblicos para recordar cada día y fortalecer tu fe.",
    imagen: versesImg,
    fecha: "2026-06-28",
  }
];
