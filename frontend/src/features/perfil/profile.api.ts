import { peticion } from "../../shared/api/api";
import type { Perfil, Usuario } from "../../shared/api/api";
import { db, type PerfilLocal } from "@/lib/offline/db";

export async function obtenerMiPerfil() {
  if (!navigator.onLine) return obtenerPerfilLocalOError();

  try {
    const respuesta = await peticion<{ usuario: Usuario; perfil: Perfil }>("/perfil");
    await guardarPerfilLocal(respuesta.usuario, respuesta.perfil);
    return respuesta;
  } catch (error) {
    const local = await obtenerPerfilLocal();
    if (local) return local;
    throw error;
  }
}

export type ActualizarPerfilDatos = {
  apodo?: string;
  grupo_edad_id?: string | null;
  url_avatar?: string | null;
  prefiere_audio?: boolean;
  tamano_texto_preferido?: string;
};

export async function actualizarPerfil(datos: ActualizarPerfilDatos) {
  const perfil = await peticion<Perfil>("/perfil/actualizar", {
    metodo: "PATCH",
    cuerpo: datos,
  });
  const local = await db.perfil.toCollection().first();
  if (local) {
    await db.perfil.update(local.localId, {
      apodo: perfil.apodo,
      grupoEdadId: perfil.grupo_edad_id,
      urlAvatar: perfil.url_avatar,
      claveAvatar: perfil.clave_avatar,
      prefiereAudio: perfil.prefiere_audio,
      tamanoTextoPreferido: perfil.tamano_texto_preferido,
      updatedAt: perfil.actualizado_en ?? new Date().toISOString(),
      syncStatus: "synced",
    });
  }
  return perfil;
}

export type GamificacionMiRespuesta = {
  nivel: {
    usuario_id: string;
    xp_total: number;
    numero_nivel: number;
    nombre_nivel: string;
    color_insignia?: string | null;
    porcentaje?: number;
    siguiente_nivel?: {
      numero_nivel: number;
      nombre: string;
      xp_minima: number;
      xp_restante: number;
    } | null;
  } | null;
  racha?: {
    dias_actuales: number;
    dias_maximos: number;
    ultima_actividad_fecha: string | null;
  };
  logros: Array<{
    usuario_id: string;
    logro_id: string;
    ganado_en: string;
    logro?: {
      id: string;
      codigo: string;
      nombre: string;
      descripcion: string | null;
      codigo_criterio: string;
      valor_criterio: number | null;
      bono_xp: number;
      url_icono: string | null;
      activo: boolean;
      creado_en: string;
    };
  }>;
  catalogo_logros?: Array<{
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    codigo_criterio: string;
    valor_criterio: number | null;
    bono_xp: number;
    url_icono: string | null;
    activo: boolean;
    creado_en: string;
    obtenido: boolean;
    ganado_en: string | null;
    progreso_actual: number;
    progreso_objetivo: number;
    porcentaje: number;
  }>;
  movimientos_recientes?: MovimientoXp[];
};

export type MovimientoXp = {
  id: string;
  origen: string;
  origen_id: string | null;
  cantidad: number;
  metadatos: Record<string, unknown>;
  creado_en: string;
};

export type NotificacionUsuario = {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  datos: Record<string, unknown>;
  leida_en: string | null;
  creado_en: string;
};

export type ProgresoMiRespuesta = {
  progresos_tema: Array<{
    usuario_id: string;
    tema_id: string;
    estado: string;
    porcentaje: number;
    iniciado_en: string | null;
    completado_en: string | null;
    ultimo_paso_id: string | null;
    actualizado_en: string;
  }>;
  progresos_actividad: Array<{
    usuario_id: string;
    actividad_id: string;
    intentos: number;
    mejor_puntaje: number;
    completado: boolean;
    completado_en: string | null;
    actualizado_en: string;
  }>;
};

export function obtenerMiProgreso() {
  return peticion<ProgresoMiRespuesta>("/progreso/mi");
}

export function obtenerMiGamificacion() {
  return peticion<GamificacionMiRespuesta>("/gamificacion/mi");
}

export function reclamarCuentaInvitada() {
  return peticion<{ vinculada: boolean; usuario: Usuario }>("/perfil/vincular-cuenta", {
    metodo: "POST",
  });
}

async function guardarPerfilLocal(usuario: Usuario, perfil: Perfil): Promise<void> {
  const now = new Date().toISOString();
  const existing = await db.perfil.toCollection().first();
  const registro: PerfilLocal = {
    localId: existing?.localId ?? perfil.id ?? crypto.randomUUID(),
    serverId: perfil.id,
    usuarioId: usuario.id,
    usuarioRol: usuario.rol,
    usuarioProveedor: usuario.proveedor,
    usuarioNombreVisible: usuario.nombre_visible,
    usuarioCorreo: usuario.correo,
    apodo: perfil.apodo,
    grupoEdadId: perfil.grupo_edad_id,
    urlAvatar: perfil.url_avatar,
    claveAvatar: perfil.clave_avatar,
    prefiereAudio: perfil.prefiere_audio,
    tamanoTextoPreferido: perfil.tamano_texto_preferido,
    createdAt: perfil.creado_en ?? existing?.createdAt ?? now,
    updatedAt: perfil.actualizado_en ?? now,
    syncStatus: "synced",
  };
  await db.perfil.put(registro);
}

async function obtenerPerfilLocal() {
  const local = await db.perfil.toCollection().first();
  if (!local) return null;
  return {
    usuario: {
      id: local.usuarioId,
      rol: local.usuarioRol,
      proveedor: local.usuarioProveedor,
      nombre_visible: local.usuarioNombreVisible,
      correo: local.usuarioCorreo,
    } satisfies Usuario,
    perfil: {
      id: local.serverId ?? local.localId,
      usuario_id: local.usuarioId,
      apodo: local.apodo,
      grupo_edad_id: local.grupoEdadId,
      url_avatar: local.urlAvatar,
      clave_avatar: local.claveAvatar,
      prefiere_audio: local.prefiereAudio,
      tamano_texto_preferido: local.tamanoTextoPreferido,
      creado_en: local.createdAt,
      actualizado_en: local.updatedAt,
    } satisfies Perfil,
  };
}

async function obtenerPerfilLocalOError() {
  const local = await obtenerPerfilLocal();
  if (!local) throw new Error("Abre Semillas con conexión al menos una vez antes de usar tu perfil offline.");
  return local;
}


export function obtenerNotificaciones(limit = 30) {
  return peticion<{ no_leidas: number; notificaciones: NotificacionUsuario[] }>(`/perfil/notificaciones?limit=${limit}`);
}

export function marcarNotificacionLeida(id: string) {
  return peticion<{ leida: boolean }>(`/perfil/notificaciones/${id}/leer`, { metodo: "PATCH" });
}

export function marcarTodasNotificacionesLeidas() {
  return peticion<{ actualizadas: boolean }>("/perfil/notificaciones/leer-todas", { metodo: "POST" });
}

export function obtenerHistorialXp(limit = 50, offset = 0) {
  return peticion<{ movimientos: MovimientoXp[]; total: number; limit: number; offset: number }>(
    `/gamificacion/historial-xp?limit=${limit}&offset=${offset}`,
  );
}

export async function eliminarMiCuenta() {
  const resultado = await peticion<{ eliminada: boolean }>("/perfil/cuenta", { metodo: "DELETE" });
  await db.delete();
  return resultado;
}
