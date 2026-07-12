import { and, desc, eq, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";
import { evaluarYDesbloquearLogros, type LogroDesbloqueado } from "./gamification-awards";

type OrigenXp =
  | "actividad"
  | "tema"
  | "logro"
  | "reto_club"
  | "ajuste_admin"
  | "migracion";

export type ResultadoGamificacion = {
  xpOtorgada: number;
  racha: { diasActuales: number; diasMaximos: number } | null;
  logros: LogroDesbloqueado[];
};

async function obtenerAjuste<T>(db: DbClient, clave: string, valorPredeterminado: T): Promise<T> {
  const [fila] = await db
    .select({ valor: schema.configuracionPlataforma.valor })
    .from(schema.configuracionPlataforma)
    .where(eq(schema.configuracionPlataforma.clave, clave))
    .limit(1);
  return (fila?.valor as T | undefined) ?? valorPredeterminado;
}

function fechaEnZona(date: Date, zonaHoraria: string): string {
  try {
    const partes = new Intl.DateTimeFormat("en-CA", {
      timeZone: zonaHoraria,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const mapa = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
    return `${mapa.year}-${mapa.month}-${mapa.day}`;
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function diferenciaDias(desde: string, hasta: string): number {
  const a = Date.parse(`${desde}T00:00:00.000Z`);
  const b = Date.parse(`${hasta}T00:00:00.000Z`);
  return Math.round((b - a) / 86_400_000);
}

export async function registrarMovimientoXp(
  db: DbClient,
  input: {
    usuarioId: string;
    origen: OrigenXp;
    origenId: string;
    cantidad: number;
    metadatos?: Record<string, unknown>;
  },
): Promise<number> {
  const cantidad = Math.trunc(input.cantidad);
  if (cantidad === 0) return 0;

  const [insertado] = await db
    .insert(schema.movimientoXp)
    .values({
      usuarioId: input.usuarioId,
      origen: input.origen,
      origenId: input.origenId,
      cantidad,
      metadatos: input.metadatos ?? {},
    })
    .onConflictDoNothing()
    .returning({ cantidad: schema.movimientoXp.cantidad });

  return Number(insertado?.cantidad ?? 0);
}

export async function actualizarRachaUsuario(
  db: DbClient,
  usuarioId: string,
  fecha = new Date(),
): Promise<{ diasActuales: number; diasMaximos: number }> {
  const zonaHoraria = await obtenerAjuste(db, "gamificacion.racha_zona_horaria", "America/Guayaquil");
  const hoy = fechaEnZona(fecha, zonaHoraria);
  const [actual] = await db
    .select()
    .from(schema.rachaUsuario)
    .where(eq(schema.rachaUsuario.usuarioId, usuarioId));

  let diasActuales = 1;
  let diasMaximos = 1;

  if (actual) {
    const ultima = actual.ultimaActividadFecha;
    if (ultima === hoy) {
      return {
        diasActuales: actual.diasActuales,
        diasMaximos: actual.diasMaximos,
      };
    }

    const diferencia = ultima ? diferenciaDias(ultima, hoy) : Number.POSITIVE_INFINITY;
    diasActuales = diferencia === 1 ? actual.diasActuales + 1 : 1;
    diasMaximos = Math.max(actual.diasMaximos, diasActuales);

    await db
      .update(schema.rachaUsuario)
      .set({
        diasActuales,
        diasMaximos,
        ultimaActividadFecha: hoy,
        actualizadoEn: new Date(),
      })
      .where(eq(schema.rachaUsuario.usuarioId, usuarioId));
  } else {
    await db.insert(schema.rachaUsuario).values({
      usuarioId,
      diasActuales,
      diasMaximos,
      ultimaActividadFecha: hoy,
    });
  }

  return { diasActuales, diasMaximos };
}

export async function crearNotificacionUsuario(
  db: DbClient,
  input: {
    usuarioId: string;
    tipo: string;
    titulo: string;
    mensaje: string;
    datos?: Record<string, unknown>;
  },
): Promise<void> {
  await db.insert(schema.notificacionUsuario).values({
    usuarioId: input.usuarioId,
    tipo: input.tipo,
    titulo: input.titulo,
    mensaje: input.mensaje,
    datos: input.datos ?? {},
  });
}

export async function procesarGamificacionPorAprendizaje(
  db: DbClient,
  input: {
    usuarioId: string;
    origen: "actividad" | "tema";
    origenId: string;
    xpConfigurada: number;
    metadatos?: Record<string, unknown>;
  },
): Promise<ResultadoGamificacion> {
  const claveHabilitada = input.origen === "tema"
    ? "gamificacion.xp_tema_habilitado"
    : "gamificacion.xp_actividad_habilitado";
  const habilitado = await obtenerAjuste(db, claveHabilitada, true);
  const xpOtorgada = habilitado
    ? await registrarMovimientoXp(db, {
        usuarioId: input.usuarioId,
        origen: input.origen,
        origenId: input.origenId,
        cantidad: Math.max(0, input.xpConfigurada),
        metadatos: input.metadatos,
      })
    : 0;

  const racha = await actualizarRachaUsuario(db, input.usuarioId);
  const logros = await evaluarYDesbloquearLogros(db, input.usuarioId);

  return { xpOtorgada, racha, logros };
}

export async function obtenerResumenGamificacion(db: DbClient, usuarioId: string) {
  const [[xpRow], reglas, [racha], movimientos, logrosUsuario] = await Promise.all([
    db
      .select({ total: sql<number>`coalesce(sum(${schema.movimientoXp.cantidad}), 0)::int` })
      .from(schema.movimientoXp)
      .where(eq(schema.movimientoXp.usuarioId, usuarioId)),
    db.select().from(schema.reglaNivel).orderBy(schema.reglaNivel.numeroNivel),
    db.select().from(schema.rachaUsuario).where(eq(schema.rachaUsuario.usuarioId, usuarioId)).limit(1),
    db
      .select()
      .from(schema.movimientoXp)
      .where(eq(schema.movimientoXp.usuarioId, usuarioId))
      .orderBy(desc(schema.movimientoXp.creadoEn))
      .limit(20),
    db
      .select({
        logro: schema.logro,
        ganadoEn: schema.logroUsuario.ganadoEn,
        reclamadoEn: schema.logroUsuario.reclamadoEn,
      })
      .from(schema.logroUsuario)
      .innerJoin(schema.logro, eq(schema.logroUsuario.logroId, schema.logro.id))
      .where(eq(schema.logroUsuario.usuarioId, usuarioId))
      .orderBy(desc(schema.logroUsuario.ganadoEn)),
  ]);

  const xpTotal = Number(xpRow?.total ?? 0);
  const nivelActual = [...reglas]
    .reverse()
    .find((regla) => xpTotal >= regla.xpMinima) ?? reglas[0] ?? null;
  const siguienteNivel = reglas.find((regla) => regla.xpMinima > xpTotal) ?? null;

  const xpBase = nivelActual?.xpMinima ?? 0;
  const xpSiguiente = siguienteNivel?.xpMinima ?? xpTotal;
  const rango = Math.max(1, xpSiguiente - xpBase);
  const porcentaje = siguienteNivel
    ? Math.min(100, Math.round(((xpTotal - xpBase) / rango) * 100))
    : 100;

  return {
    xpTotal,
    nivelActual,
    siguienteNivel,
    porcentaje,
    racha: racha ?? {
      usuarioId,
      diasActuales: 0,
      diasMaximos: 0,
      ultimaActividadFecha: null,
      actualizadoEn: new Date(0),
    },
    movimientos,
    logrosUsuario,
  };
}

export async function obtenerMetricasCriterio(db: DbClient, usuarioId: string) {
  const [[temas], [actividades], [xp], [racha]] = await Promise.all([
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.progresoTemaUsuario)
      .where(and(
        eq(schema.progresoTemaUsuario.usuarioId, usuarioId),
        eq(schema.progresoTemaUsuario.estado, "completado"),
      )),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.progresoActividadUsuario)
      .where(and(
        eq(schema.progresoActividadUsuario.usuarioId, usuarioId),
        eq(schema.progresoActividadUsuario.completado, true),
      )),
    db
      .select({ total: sql<number>`coalesce(sum(${schema.movimientoXp.cantidad}), 0)::int` })
      .from(schema.movimientoXp)
      .where(eq(schema.movimientoXp.usuarioId, usuarioId)),
    db
      .select({ total: schema.rachaUsuario.diasActuales })
      .from(schema.rachaUsuario)
      .where(eq(schema.rachaUsuario.usuarioId, usuarioId)),
  ]);

  return {
    temas_completados: Number(temas?.total ?? 0),
    actividades_completadas: Number(actividades?.total ?? 0),
    xp_total: Number(xp?.total ?? 0),
    dias_racha: Number(racha?.total ?? 0),
  };
}
