export type EstadoTema = "porDefecto" | "enProgreso" | "completada";

export type TemaUI = {
  id: string;
  titulo: string;
  descripcion: string;
  senda: string;
  duracion: string;
  xp: number;
  progreso: number;
  favorito: boolean;
  imagenUrl: string | null;
  estado: EstadoTema;
};
