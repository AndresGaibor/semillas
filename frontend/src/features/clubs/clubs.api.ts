import { peticion, RUTAS_API } from "../../shared/api/api";

export type Club = {
  id: string;
  nombre: string;
  descripcion: string | null;
  codigo_invitacion: string;
  creado_por: string;
  activo: boolean;
  creado_en: string;
  member_count?: number;
};

export type ClubPublico = Omit<Club, "codigo_invitacion">;

export type MiembroRankingClub = {
  club_id: string;
  usuario_id: string;
  apodo: string;
  numero_ranking: number;
  xp_total: number;
};

export type RetoCooperativo = {
  id: string;
  club_id: string | null;
  nombre: string;
  descripcion: string | null;
  codigo_metrica: string;
  valor_objetivo: number;
  xp_reto: number;
  fecha_inicio: string;
  fecha_fin: string;
  creado_por: string | null;
  creado_en: string;
};

export function listarClubes() {
  return peticion<ClubPublico[]>(RUTAS_API.CLUBES.LISTAR);
}

export function listarMisClubes() {
  return peticion<Club[]>(RUTAS_API.CLUBES.MIOS);
}

export function crearClub(datos: { nombre: string; descripcion?: string }) {
  return peticion<Club>(RUTAS_API.CLUBES.CREAR, { metodo: "POST", cuerpo: datos });
}

export function unirseAClub(datos: { codigo_acceso: string }) {
  return peticion<{ unido: boolean; ya_era_miembro: boolean; club: Club }>(RUTAS_API.CLUBES.UNIRSE, {
    metodo: "POST",
    cuerpo: datos
  });
}

export function salirDeClub(idClub: string) {
  return peticion<{ left: true }>(RUTAS_API.CLUBES.SALIR(idClub), { metodo: "POST" });
}

export function obtenerRankingClub(idClub: string) {
  return peticion<MiembroRankingClub[]>(RUTAS_API.CLUBES.RANKING(idClub));
}

export function listarRetosClub(idClub: string) {
  return peticion<RetoCooperativo[]>(RUTAS_API.CLUBES.RETOS(idClub));
}

export function crearRetoCooperativo(
  idClub: string,
  datos: {
    nombre: string;
    descripcion?: string;
    codigo_metrica: string;
    valor_objetivo: number;
    xp_reto?: number;
    fecha_inicio: string;
    fecha_fin: string;
  }
) {
  return peticion<RetoCooperativo>(RUTAS_API.CLUBES.RETOS(idClub), {
    metodo: "POST",
    cuerpo: { xp_reto: 100, ...datos }
  });
}
