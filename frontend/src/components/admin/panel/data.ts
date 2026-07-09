import type { ComponentType, SVGProps } from "react";
import {
  Archive, BarChart3, CheckCircle2, Clock3, CloudUpload, FileText,
  Leaf, Pencil, Plus, Route, ShieldCheck, UsersRound,
} from "lucide-react";

type Icono = ComponentType<SVGProps<SVGSVGElement>>;

export interface TarjetaMetricaDato {
  titulo: string;
  valor: string;
  cambio: string;
  icono: Icono;
  colorIcono: string;
  fondoIcono: string;
  colorValor: string;
}

export interface EstadoContenidoDato {
  titulo: string;
  valor: number;
  porcentaje: string;
  icono: Icono;
  fondo: string;
  colorIcono: string;
  colorPunto: string;
}

export interface AccionRapidaDato {
  titulo: string;
  descripcion: string;
  icono: Icono;
  fondo: string;
  colorIcono: string;
  colorTitulo: string;
  to: string;
}

export type EstadoTema = "Publicado" | "En revisión" | "Borrador";

export interface TemaRecienteDato {
  titulo: string;
  senda: string;
  estado: EstadoTema;
  autor: string;
  avatar: string;
  ultimaEdicion: string;
}

export interface ActividadDato {
  icono: Icono;
  fondo: string;
  colorIcono: string;
  texto: string;
  tiempo: string;
}

export interface RevisionDato {
  dia: string;
  mes: string;
  titulo: string;
  senda: string;
  estado: "En revisión" | "Borrador";
  responsable: string;
  avatar: string;
  colorFecha: string;
}

export interface ProgresoDiaDato {
  dia: string;
  valor: number;
}

export const METRICAS: TarjetaMetricaDato[] = [
  { titulo: "Temas publicados", valor: "128", cambio: "12% vs. la semana pasada", icono: Leaf, colorIcono: "text-emerald-600", fondoIcono: "bg-emerald-100", colorValor: "text-emerald-600" },
  { titulo: "Usuarios activos", valor: "2,845", cambio: "8% vs. la semana pasada", icono: UsersRound, colorIcono: "text-blue-600", fondoIcono: "bg-blue-100", colorValor: "text-blue-600" },
  { titulo: "Actividades creadas", valor: "362", cambio: "15% vs. la semana pasada", icono: Pencil, colorIcono: "text-orange-500", fondoIcono: "bg-orange-100", colorValor: "text-orange-500" },
  { titulo: "Clubes activos", valor: "156", cambio: "9% vs. la semana pasada", icono: UsersRound, colorIcono: "text-purple-600", fondoIcono: "bg-purple-100", colorValor: "text-purple-600" },
];

export const ESTADOS_CONTENIDO: EstadoContenidoDato[] = [
  { titulo: "Borradores", valor: 42, porcentaje: "12% del total", icono: FileText, fondo: "bg-amber-50", colorIcono: "text-amber-500", colorPunto: "bg-amber-400" },
  { titulo: "En revisión", valor: 18, porcentaje: "5% del total", icono: Clock3, fondo: "bg-indigo-50", colorIcono: "text-indigo-600", colorPunto: "bg-indigo-500" },
  { titulo: "Publicados", valor: 128, porcentaje: "78% del total", icono: CheckCircle2, fondo: "bg-emerald-50", colorIcono: "text-emerald-600", colorPunto: "bg-emerald-600" },
  { titulo: "Archivados", valor: 14, porcentaje: "5% del total", icono: Archive, fondo: "bg-slate-100", colorIcono: "text-slate-500", colorPunto: "bg-slate-400" },
];

export const ACCIONES_RAPIDAS: AccionRapidaDato[] = [
  { titulo: "Crear tema", descripcion: "Desarrolla un nuevo tema para tus sendas.", icono: Plus, fondo: "bg-emerald-50", colorIcono: "text-emerald-600", colorTitulo: "text-emerald-700", to: "/admin/temas/new" },
  { titulo: "Agregar actividad", descripcion: "Crea actividades interactivas.", icono: Pencil, fondo: "bg-orange-50", colorIcono: "text-orange-500", colorTitulo: "text-orange-600", to: "/admin/actividades" },
  { titulo: "Subir recurso", descripcion: "Añade videos, audios o documentos.", icono: CloudUpload, fondo: "bg-blue-50", colorIcono: "text-blue-500", colorTitulo: "text-blue-600", to: "/admin/medios" },
  { titulo: "Revisar contenido", descripcion: "Revisa y aprueba contenido pendiente.", icono: ShieldCheck, fondo: "bg-purple-50", colorIcono: "text-purple-600", colorTitulo: "text-purple-600", to: "/admin/revision" },
];

export const TEMAS_RECIENTES: TemaRecienteDato[] = [
  { titulo: "La creación de Dios", senda: "Dios y su amor", estado: "Publicado", autor: "María López", avatar: "👩", ultimaEdicion: "15 may. 2024, 10:30" },
  { titulo: "La oración", senda: "Vida con Jesús", estado: "En revisión", autor: "Juan Pérez", avatar: "👨", ultimaEdicion: "14 may. 2024, 16:45" },
  { titulo: "El perdón", senda: "Relaciones sanas", estado: "Borrador", autor: "Ana Torres", avatar: "👩", ultimaEdicion: "13 may. 2024, 09:20" },
  { titulo: "El Buen Samaritano", senda: "Amor al prójimo", estado: "Publicado", autor: "Luis García", avatar: "👨", ultimaEdicion: "12 may. 2024, 11:05" },
  { titulo: "Daniel en el foso de los leones", senda: "Fe y valentía", estado: "Publicado", autor: "María López", avatar: "👩", ultimaEdicion: "11 may. 2024, 08:50" },
];

export const ACTIVIDAD_RECIENTE: ActividadDato[] = [
  { icono: Leaf, fondo: "bg-emerald-100", colorIcono: "text-emerald-600", texto: 'Se publicó el tema "La creación de Dios" en la senda "Dios y su amor".', tiempo: "Hace 15 min" },
  { icono: Pencil, fondo: "bg-orange-100", colorIcono: "text-orange-500", texto: 'María López creó una nueva actividad "Construyendo la confianza".', tiempo: "Hace 1 h" },
  { icono: UsersRound, fondo: "bg-purple-100", colorIcono: "text-purple-600", texto: 'El Club "Semillitas de Luz" agregó 8 nuevos miembros.', tiempo: "Hace 3 h" },
  { icono: CloudUpload, fondo: "bg-blue-100", colorIcono: "text-blue-500", texto: 'Se subió un nuevo recurso multimedia "Video: El Buen Samaritano".', tiempo: "Hace 5 h" },
  { icono: ShieldCheck, fondo: "bg-amber-100", colorIcono: "text-amber-500", texto: 'Juan Pérez aprobó el tema "La oración" para publicación.', tiempo: "Hace 1 día" },
];

export const REVISIONES = [
  { dia: "16", mes: "MAY", titulo: "La fe de Abraham", senda: "Héroes de la fe", estado: "En revisión" as const, responsable: "Ana Torres", avatar: "👩", colorFecha: "bg-orange-100 text-orange-700" },
  { dia: "17", mes: "MAY", titulo: "Aprendiendo a perdonar", senda: "Relaciones sanas", estado: "En revisión" as const, responsable: "Juan Pérez", avatar: "👨", colorFecha: "bg-amber-100 text-amber-700" },
  { dia: "18", mes: "MAY", titulo: "Dios cuida de mí", senda: "Confío en Dios", estado: "Borrador" as const, responsable: "María López", avatar: "👩", colorFecha: "bg-emerald-100 text-emerald-700" },
];

export const PROGRESO_SEMANAL: ProgresoDiaDato[] = [
  { dia: "Lun", valor: 12 }, { dia: "Mar", valor: 18 }, { dia: "Mié", valor: 24 },
  { dia: "Jue", valor: 20 }, { dia: "Vie", valor: 16 }, { dia: "Sáb", valor: 14 }, { dia: "Dom", valor: 10 },
];
