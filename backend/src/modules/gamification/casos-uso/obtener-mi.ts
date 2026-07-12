import type { GamificationRepository } from "../gamification.repository";

function serializarLogro(logro: Record<string, unknown>) {
  return {
    id: String(logro.id ?? ""),
    codigo: String(logro.codigo ?? ""),
    nombre: String(logro.nombre ?? ""),
    descripcion: (logro.descripcion ?? null) as string | null,
    codigo_criterio: String(logro.codigo_criterio ?? ""),
    valor_criterio: (logro.valor_criterio ?? null) as number | null,
    bono_xp: Number(logro.bono_xp ?? 0),
    url_icono: (logro.url_icono ?? null) as string | null,
    activo: Boolean(logro.activo ?? false),
    creado_en: String(logro.creado_en ?? "")
  };
}

export function crearCasoObtenerMiGamificacion(repositorio: GamificationRepository) {
  return async function obtenerMiGamificacion(usuarioId: string) {
    const nivel = await repositorio.obtenerNivelUsuario(usuarioId);
    const logros = await repositorio.listarLogrosUsuario(usuarioId);
    const pendientes_reclamar = await repositorio.contarLogrosPendientesReclamar(usuarioId);

    return {
      nivel: nivel
        ? {
            usuario_id: String(nivel.usuario_id ?? ""),
            xp_total: Number(nivel.xp_total ?? 0),
            numero_nivel: Number(nivel.numero_nivel ?? 0),
            nombre_nivel: String(nivel.nombre_nivel ?? "")
          }
        : null,
      logros: logros.map((logroUsuario) => ({
        usuario_id: String(logroUsuario.usuario_id ?? ""),
        logro_id: String(logroUsuario.logro_id ?? ""),
        ganado_en: logroUsuario.ganado_en.toISOString(),
        reclamado_en: logroUsuario.reclamado_en ? logroUsuario.reclamado_en.toISOString() : null,
        ...(logroUsuario.logro ? { logro: serializarLogro({ ...logroUsuario.logro, creado_en: logroUsuario.logro.creadoEn.toISOString() }) } : {})
      })),
      // Cantidad de logros desbloqueados pendientes de reclamar (para el badge del menú)
      pendientes_reclamar,
    };
  };
}
