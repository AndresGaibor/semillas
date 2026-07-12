import { peticion, RUTAS_API } from "../../shared/api/api";

const CACHE_PREFIX = "semillas-clubes-cache-v2";

function cacheKey(key: string) { return `${CACHE_PREFIX}:${key}`; }
function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(cacheKey(key));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}
function writeCache<T>(key: string, value: T) {
  try { localStorage.setItem(cacheKey(key), JSON.stringify(value)); } catch { /* almacenamiento opcional */ }
}
async function cachedRequest<T>(key: string, request: () => Promise<T>): Promise<T> {
  if (!navigator.onLine) {
    const cached = readCache<T>(key);
    if (cached) return cached;
    throw new Error("Conéctate a internet una vez para cargar tus clubes.");
  }
  try {
    const data = await request();
    writeCache(key, data);
    return data;
  } catch (error) {
    const cached = readCache<T>(key);
    if (cached) return cached;
    throw error;
  }
}
function requireOnline() {
  if (!navigator.onLine) throw new Error("Esta acción necesita conexión a internet.");
}

export type RolMiembroClub = "propietario" | "lider" | "miembro";

export type Club = {
  id: string;
  nombre: string;
  descripcion: string | null;
  codigo_invitacion: string;
  creado_por: string;
  activo: boolean;
  creado_en: string;
  member_count?: number;
  rol_miembro?: RolMiembroClub;
  unido_en?: string;
};

export type ClubPublico = Omit<Club, "codigo_invitacion">;

export type MiembroClub = {
  club_id: string;
  usuario_id: string;
  rol_miembro: RolMiembroClub;
  unido_en: string;
  apodo: string;
  clave_avatar: string | null;
  url_avatar: string | null;
  xp_total: number;
  xp_semana: number;
  actividades_semana: number;
};

export type ClubDetalle = Club & {
  created_by: { id: string; nombre_visible: string } | null;
  membership: { rol_miembro: RolMiembroClub; unido_en: string };
  members: MiembroClub[];
};

export type MiembroRankingClub = MiembroClub & {
  numero_ranking: number;
};

export type CodigoMetricaReto = "xp_grupal" | "actividades_completadas" | "temas_completados";

export type RetoCooperativo = {
  id: string;
  club_id: string | null;
  nombre: string;
  descripcion: string | null;
  codigo_metrica: CodigoMetricaReto;
  valor_objetivo: number;
  xp_reto: number;
  fecha_inicio: string;
  fecha_fin: string;
  creado_por: string | null;
  creado_en: string;
  progreso_actual: number;
  mi_aporte: number;
  porcentaje: number;
  completado: boolean;
  recompensa_reclamada: boolean;
};

export function listarClubes() {
  return peticion<ClubPublico[]>(RUTAS_API.CLUBES.LISTAR);
}

export function listarMisClubes() {
  return cachedRequest("mine", () => peticion<Club[]>(RUTAS_API.CLUBES.MIOS));
}

export function obtenerClub(idClub: string) {
  return cachedRequest(`detail:${idClub}`, () => peticion<ClubDetalle>(RUTAS_API.CLUBES.DETALLE(idClub)));
}

export function crearClub(datos: { nombre: string; descripcion?: string }) {
  requireOnline();
  return peticion<Club>(RUTAS_API.CLUBES.CREAR, { metodo: "POST", cuerpo: datos });
}

export function actualizarClub(idClub: string, datos: { nombre?: string; descripcion?: string }) {
  requireOnline();
  return peticion<Club>(RUTAS_API.CLUBES.DETALLE(idClub), { metodo: "PATCH", cuerpo: datos });
}

export function regenerarCodigoClub(idClub: string) {
  requireOnline();
  return peticion<Club>(RUTAS_API.CLUBES.REGENERAR_CODIGO(idClub), { metodo: "POST" });
}

export function unirseAClub(datos: { codigo_acceso: string }) {
  requireOnline();
  return peticion<{ unido: boolean; ya_era_miembro: boolean; club: Club }>(RUTAS_API.CLUBES.UNIRSE, {
    metodo: "POST",
    cuerpo: datos,
  });
}

export function salirDeClub(idClub: string) {
  requireOnline();
  return peticion<{ left: true }>(RUTAS_API.CLUBES.SALIR(idClub), { metodo: "POST" });
}

export function archivarClub(idClub: string) {
  requireOnline();
  return peticion<{ archived: true }>(RUTAS_API.CLUBES.DETALLE(idClub), { metodo: "DELETE" });
}

export function quitarMiembroClub(idClub: string, usuarioId: string) {
  requireOnline();
  return peticion<{ removed: true }>(RUTAS_API.CLUBES.MIEMBRO(idClub, usuarioId), { metodo: "DELETE" });
}

export function transferirLiderazgoClub(idClub: string, usuarioId: string) {
  requireOnline();
  return peticion<{ transferred: true; usuario_id: string }>(RUTAS_API.CLUBES.TRANSFERIR(idClub), {
    metodo: "POST",
    cuerpo: { usuario_id: usuarioId },
  });
}

export function obtenerRankingClub(idClub: string) {
  return cachedRequest(`ranking:${idClub}`, () => peticion<MiembroRankingClub[]>(RUTAS_API.CLUBES.RANKING(idClub)));
}

export function listarRetosClub(idClub: string) {
  return cachedRequest(`challenges:${idClub}`, () => peticion<RetoCooperativo[]>(RUTAS_API.CLUBES.RETOS(idClub)));
}

export function crearRetoCooperativo(
  idClub: string,
  datos: {
    nombre: string;
    descripcion?: string;
    codigo_metrica: CodigoMetricaReto;
    valor_objetivo: number;
    xp_reto?: number;
    fecha_inicio: string;
    fecha_fin: string;
  },
) {
  requireOnline();
  return peticion<RetoCooperativo>(RUTAS_API.CLUBES.RETOS(idClub), {
    metodo: "POST",
    cuerpo: { xp_reto: 100, ...datos },
  });
}

export function reclamarRecompensaReto(idClub: string, retoId: string) {
  requireOnline();
  return peticion<{ reclamado: boolean; ya_reclamada: boolean; xp_otorgada: number }>(
    RUTAS_API.CLUBES.RECLAMAR_RETO(idClub, retoId),
    { metodo: "POST" },
  );
}
