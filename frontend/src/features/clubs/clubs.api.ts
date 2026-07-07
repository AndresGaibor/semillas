import { peticion, RUTAS_API } from "../../shared/api/api";

export type Club = {
  id: string;
  nombre: string;
  descripcion: string | null;
  codigo_acceso: string;
  creador_id: string;
  creado_en: string;
};

export type MiembroClub = {
  usuario_id: string;
  apodo: string;
  url_avatar: string | null;
  xp_aportada: number;
  rango: string;
};

export type RetoCooperativo = {
  id: string;
  club_id: string;
  titulo: string;
  meta_xp: number;
  xp_acumulada: number;
  activo: boolean;
  finaliza_en: string;
};

/**
 * Crea un nuevo club de aprendizaje (clubes lúdicos moderados para menores).
 * 
 * HTTP Verb: POST
 * Endpoint: /clubes
 * Auth: Requerido (rol admin/moderador o usuario)
 */
export function crearClub(datos: { nombre: string; descripcion?: string }) {
  return peticion<Club>(RUTAS_API.CLUBES.CREAR, {
    metodo: "POST",
    cuerpo: datos,
  });
}

/**
 * Permite a un menor unirse a un club existente ingresando un código de acceso único.
 * 
 * HTTP Verb: POST
 * Endpoint: /clubes/unirse
 * Auth: Requerido
 */
export function unirseAClub(datos: { codigo_acceso: string }) {
  return peticion<{ club: Club; exito: boolean }>(RUTAS_API.CLUBES.UNIRSE, {
    metodo: "POST",
    cuerpo: datos,
  });
}

/**
 * Obtiene la clasificación y ranking de XP de los miembros pertenecientes a un club.
 * 
 * HTTP Verb: GET
 * Endpoint: /clubes/:id/clasificacion
 * Auth: Requerido
 */
export function obtenerClasificacionClub(idClub: string) {
  return peticion<MiembroClub[]>(RUTAS_API.CLUBES.CLASIFICACION(idClub));
}

/**
 * Crea o aporta a un reto cooperativo conjunto dentro del club.
 * 
 * HTTP Verb: POST
 * Endpoint: /clubes/:id/retos
 * Auth: Requerido
 */
export function crearRetoCooperativo(idClub: string, datos: { titulo: string; meta_xp: number; finaliza_en: string }) {
  return peticion<RetoCooperativo>(RUTAS_API.CLUBES.RETOS(idClub), {
    metodo: "POST",
    cuerpo: datos,
  });
}
