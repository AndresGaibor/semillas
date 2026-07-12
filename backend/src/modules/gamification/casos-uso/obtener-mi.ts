import type { GamificationRepository } from "../gamification.repository";

function serializarLogro(logro: Record<string, unknown>) {
  return {
    id: String(logro.id ?? ""),
    codigo: String(logro.codigo ?? ""),
    nombre: String(logro.nombre ?? ""),
    descripcion: (logro.descripcion ?? null) as string | null,
    codigo_criterio: String(logro.codigoCriterio ?? logro.codigo_criterio ?? ""),
    valor_criterio: Number(logro.valorCriterio ?? logro.valor_criterio ?? 0),
    bono_xp: Number(logro.bonoXp ?? logro.bono_xp ?? 0),
    url_icono: (logro.urlIcono ?? logro.url_icono ?? null) as string | null,
    activo: Boolean(logro.activo ?? false),
    creado_en: logro.creadoEn instanceof Date
      ? logro.creadoEn.toISOString()
      : String(logro.creado_en ?? ""),
  };
}

export function crearCasoObtenerMiGamificacion(repositorio: GamificationRepository) {
  return async function obtenerMiGamificacion(usuarioId: string) {
    const [resumen, catalogo, niveles] = await Promise.all([
      repositorio.obtenerResumen(usuarioId),
      repositorio.listarCatalogoLogros(usuarioId),
      repositorio.listarNiveles(),
    ]);

    return {
      nivel: resumen.nivelActual
        ? {
            usuario_id: usuarioId,
            xp_total: resumen.xpTotal,
            numero_nivel: resumen.nivelActual.numeroNivel,
            nombre_nivel: resumen.nivelActual.nombre,
            color_insignia: resumen.nivelActual.colorInsignia ?? null,
            porcentaje: resumen.porcentaje,
            siguiente_nivel: resumen.siguienteNivel
              ? {
                  numero_nivel: resumen.siguienteNivel.numeroNivel,
                  nombre: resumen.siguienteNivel.nombre,
                  xp_minima: resumen.siguienteNivel.xpMinima,
                  xp_restante: Math.max(0, resumen.siguienteNivel.xpMinima - resumen.xpTotal),
                }
              : null,
          }
        : null,
      racha: {
        dias_actuales: resumen.racha.diasActuales,
        dias_maximos: resumen.racha.diasMaximos,
        ultima_actividad_fecha: resumen.racha.ultimaActividadFecha,
      },
      logros: resumen.logrosUsuario.map((item) => ({
        usuario_id: usuarioId,
        logro_id: item.logro.id,
        ganado_en: item.ganadoEn.toISOString(),
        logro: serializarLogro(item.logro),
      })),
      catalogo_logros: catalogo.map((item) => ({
        ...serializarLogro(item),
        obtenido: item.obtenido,
        ganado_en: item.ganadoEn?.toISOString() ?? null,
        progreso_actual: item.progresoActual,
        progreso_objetivo: item.progresoObjetivo,
        porcentaje: item.porcentaje,
      })),
      reglas_nivel: niveles.map((nivel) => ({
        id: nivel.id,
        numero_nivel: nivel.numeroNivel,
        nombre: nivel.nombre,
        xp_minima: nivel.xpMinima,
        color_insignia: nivel.colorInsignia,
      })),
      movimientos_recientes: resumen.movimientos.map((movimiento) => ({
        id: movimiento.id,
        origen: movimiento.origen,
        origen_id: movimiento.origenId,
        cantidad: movimiento.cantidad,
        metadatos: movimiento.metadatos,
        creado_en: movimiento.creadoEn.toISOString(),
      })),
    };
  };
}
