import { and, desc, eq, gte } from "drizzle-orm";
import { schema, type DbClient } from "../../db/client";
import type { SyncPushEvent } from "./sync.schemas";

export type FilaEventoSincronizacion = {
  id: string;
  usuarioId: string;
  idEventoCliente: string;
  tipoEvento: string;
  temaId: string | null;
  pasoId: string | null;
  actividadId: string | null;
  correcta: boolean | null;
  puntaje: number | null;
  xpOtorgada: number;
  datos: unknown;
  ocurridoEnCliente: Date;
  dispositivoId: string | null;
  recibidoEnServidor: Date;
};

export type FilaProgresoTemaSincronizacion = {
  usuarioId: string;
  temaId: string;
  estado: string;
  porcentaje: number;
  iniciadoEn: Date | null;
  completadoEn: Date | null;
  ultimoPasoId: string | null;
  actualizadoEn: Date;
};

export type FilaProgresoActividadSincronizacion = {
  usuarioId: string;
  actividadId: string;
  intentos: number;
  mejorPuntaje: number;
  completado: boolean;
  completadoEn: Date | null;
  actualizadoEn: Date;
};

export interface SyncRepository {
  listarEventosUsuario(usuarioId: string, since?: string): Promise<FilaEventoSincronizacion[]>;
  listarProgresoTemas(usuarioId: string): Promise<FilaProgresoTemaSincronizacion[]>;
  listarProgresoActividades(usuarioId: string): Promise<FilaProgresoActividadSincronizacion[]>;
  registrarEvento(usuarioId: string, evento: SyncPushEvent): Promise<boolean>;
  obtenerProgresoTema(usuarioId: string, temaId: string): Promise<FilaProgresoTemaSincronizacion | undefined>;
  crearProgresoTema(
    usuarioId: string,
    temaId: string,
    datos: {
      estado: "en_progreso" | "completado";
      porcentaje: number;
      iniciadoEn: Date;
      completadoEn: Date | null;
      actualizadoEn: Date;
    }
  ): Promise<void>;
  actualizarProgresoTema(
    usuarioId: string,
    temaId: string,
    datos: {
      estado?: "en_progreso" | "completado";
      porcentaje?: number;
      iniciadoEn?: Date;
      completadoEn?: Date | null;
      actualizadoEn: Date;
    }
  ): Promise<void>;
  obtenerProgresoActividad(usuarioId: string, actividadId: string): Promise<FilaProgresoActividadSincronizacion | undefined>;
  crearProgresoActividad(
    usuarioId: string,
    actividadId: string,
    datos: {
      intentos: number;
      mejorPuntaje: number;
      completado: boolean;
      completadoEn: Date | null;
      actualizadoEn: Date;
    }
  ): Promise<void>;
  actualizarProgresoActividad(
    usuarioId: string,
    actividadId: string,
    datos: {
      intentos?: number;
      mejorPuntaje?: number;
      completado?: boolean;
      completadoEn?: Date | null;
      actualizadoEn: Date;
    }
  ): Promise<void>;
}

type Dependencias = {
  db: DbClient;
};

function normalizarFechaCliente(fecha?: string) {
  const ahora = new Date();
  if (!fecha) return ahora;
  const candidata = new Date(fecha);
  if (Number.isNaN(candidata.getTime()) || candidata > ahora) return ahora;
  return candidata;
}

export function crearSyncRepository({ db }: Dependencias): SyncRepository {
  return {
    async listarEventosUsuario(usuarioId: string, since?: string) {
      const consultaBase = db
        .select()
        .from(schema.eventoProgreso)
        .where(eq(schema.eventoProgreso.usuarioId, usuarioId))
        .orderBy(desc(schema.eventoProgreso.recibidoEnServidor));

      if (!since) return consultaBase;

      return db
        .select()
        .from(schema.eventoProgreso)
        .where(and(eq(schema.eventoProgreso.usuarioId, usuarioId), gte(schema.eventoProgreso.recibidoEnServidor, new Date(since))))
        .orderBy(desc(schema.eventoProgreso.recibidoEnServidor));
    },

    async listarProgresoTemas(usuarioId: string) {
      return db.select().from(schema.progresoTemaUsuario).where(eq(schema.progresoTemaUsuario.usuarioId, usuarioId));
    },

    async listarProgresoActividades(usuarioId: string) {
      return db.select().from(schema.progresoActividadUsuario).where(eq(schema.progresoActividadUsuario.usuarioId, usuarioId));
    },

    async registrarEvento(usuarioId: string, evento: SyncPushEvent) {
      const [nuevo] = await db
        .insert(schema.eventoProgreso)
        .values({
          usuarioId,
          idEventoCliente: evento.evento_id_cliente,
          tipoEvento: evento.tipo_evento,
          temaId: evento.tema_id ?? null,
          pasoId: evento.paso_id ?? null,
          actividadId: evento.actividad_id ?? null,
          correcta: null,
          puntaje: null,
          xpOtorgada: 0,
          datos: evento.datos,
          ocurridoEnCliente: normalizarFechaCliente(evento.creado_en_cliente),
          dispositivoId: evento.dispositivo_id ?? null
        })
        .onConflictDoNothing({ target: schema.eventoProgreso.idEventoCliente })
        .returning();

      return Boolean(nuevo);
    },

    async obtenerProgresoTema(usuarioId: string, temaId: string) {
      const [fila] = await db
        .select()
        .from(schema.progresoTemaUsuario)
        .where(and(eq(schema.progresoTemaUsuario.usuarioId, usuarioId), eq(schema.progresoTemaUsuario.temaId, temaId)))
        .limit(1);

      return fila;
    },

    async crearProgresoTema(
      usuarioId: string,
      temaId: string,
      datos: {
        estado: "en_progreso" | "completado";
        porcentaje: number;
        iniciadoEn: Date;
        completadoEn: Date | null;
        actualizadoEn: Date;
      }
    ) {
      await db.insert(schema.progresoTemaUsuario).values({
        usuarioId,
        temaId,
        estado: datos.estado,
        porcentaje: datos.porcentaje,
        iniciadoEn: datos.iniciadoEn,
        completadoEn: datos.completadoEn,
        actualizadoEn: datos.actualizadoEn
      });
    },

    async actualizarProgresoTema(
      usuarioId: string,
      temaId: string,
      datos: {
        estado?: "en_progreso" | "completado";
        porcentaje?: number;
        iniciadoEn?: Date;
        completadoEn?: Date | null;
        actualizadoEn: Date;
      }
    ) {
      await db
        .update(schema.progresoTemaUsuario)
        .set({
          ...(datos.estado ? { estado: datos.estado } : {}),
          ...(datos.porcentaje !== undefined ? { porcentaje: datos.porcentaje } : {}),
          ...(datos.iniciadoEn ? { iniciadoEn: datos.iniciadoEn } : {}),
          ...(datos.completadoEn !== undefined ? { completadoEn: datos.completadoEn } : {}),
          actualizadoEn: datos.actualizadoEn
        })
        .where(and(eq(schema.progresoTemaUsuario.usuarioId, usuarioId), eq(schema.progresoTemaUsuario.temaId, temaId)));
    },

    async obtenerProgresoActividad(usuarioId: string, actividadId: string) {
      const [fila] = await db
        .select()
        .from(schema.progresoActividadUsuario)
        .where(and(eq(schema.progresoActividadUsuario.usuarioId, usuarioId), eq(schema.progresoActividadUsuario.actividadId, actividadId)))
        .limit(1);

      return fila;
    },

    async crearProgresoActividad(
      usuarioId: string,
      actividadId: string,
      datos: {
        intentos: number;
        mejorPuntaje: number;
        completado: boolean;
        completadoEn: Date | null;
        actualizadoEn: Date;
      }
    ) {
      await db.insert(schema.progresoActividadUsuario).values({
        usuarioId,
        actividadId,
        intentos: datos.intentos,
        mejorPuntaje: datos.mejorPuntaje,
        completado: datos.completado,
        completadoEn: datos.completadoEn,
        actualizadoEn: datos.actualizadoEn
      });
    },

    async actualizarProgresoActividad(
      usuarioId: string,
      actividadId: string,
      datos: {
        intentos?: number;
        mejorPuntaje?: number;
        completado?: boolean;
        completadoEn?: Date | null;
        actualizadoEn: Date;
      }
    ) {
      await db
        .update(schema.progresoActividadUsuario)
        .set({
          ...(datos.intentos !== undefined ? { intentos: datos.intentos } : {}),
          ...(datos.mejorPuntaje !== undefined ? { mejorPuntaje: datos.mejorPuntaje } : {}),
          ...(datos.completado !== undefined ? { completado: datos.completado } : {}),
          ...(datos.completadoEn !== undefined ? { completadoEn: datos.completadoEn } : {}),
          actualizadoEn: datos.actualizadoEn
        })
        .where(and(eq(schema.progresoActividadUsuario.usuarioId, usuarioId), eq(schema.progresoActividadUsuario.actividadId, actividadId)));
    }
  };
}
