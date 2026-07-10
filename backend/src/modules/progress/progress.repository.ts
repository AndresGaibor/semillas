import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

export function crearProgressRepository(db: DbClient) {
  return {
    async obtenerProgresoPropio(usuarioId: string) {
      const themes = await db
        .select()
        .from(schema.progresoTemaUsuario)
        .where(eq(schema.progresoTemaUsuario.usuarioId, usuarioId));

      const activities = await db
        .select()
        .from(schema.progresoActividadUsuario)
        .where(eq(schema.progresoActividadUsuario.usuarioId, usuarioId));

      return { themes, activities };
    },

    async registrarEvento(usuarioId: string, body: {
      evento_id_cliente: string;
      tipo_evento: string;
      tema_id?: string;
      paso_id?: string;
      actividad_id?: string;
      correcta?: boolean;
      puntaje?: number;
      xp_otorgada?: number;
      datos?: Record<string, unknown>;
      ocurrido_en_cliente?: string;
      dispositivo_id?: string;
    }) {
      const fila = {
        usuarioId,
        idEventoCliente: body.evento_id_cliente,
        tipoEvento: body.tipo_evento,
        temaId: body.tema_id ?? null,
        pasoId: body.paso_id ?? null,
        actividadId: body.actividad_id ?? null,
        correcta: body.correcta ?? null,
        puntaje: body.puntaje ?? null,
        xpOtorgada: body.xp_otorgada ?? 0,
        datos: body.datos ?? {},
        ocurridoEnCliente: body.ocurrido_en_cliente ? new Date(body.ocurrido_en_cliente) : new Date(),
        dispositivoId: body.dispositivo_id ?? null
      };

      const [data] = await db
        .insert(schema.eventoProgreso)
        .values(fila as never)
        .onConflictDoNothing({ target: schema.eventoProgreso.idEventoCliente })
        .returning();

      return data ?? null;
    }
  };
}

export type ProgressRepository = ReturnType<typeof crearProgressRepository>;
