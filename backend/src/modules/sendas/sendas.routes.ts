/**
 * ============================================================
 * MÓDULO DE SENDAS
 * ============================================================
 *
 * Este módulo maneja las rutas relacionadas con las sendas
 * espirituales: Padre, Hijo y Espíritu Santo.
 *
 * ENDPOINTS:
 * - GET /sendas - Lista todas las sendas activas
 *
 * @module modules/sendas
 */

import { Hono } from "hono";
import { eq, asc } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { responderExito } from "../../shared/http/respuesta";
import { db as dbPredeterminado, schema, type DbClient } from "../../db/client";

/**
 * Tipos para Serialización
 * Define la forma de los datos que se devuelven al cliente
 */
interface SendaSerializada {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  colorHex: string;
  nombreIcono: string | null;
  orden: number;
}

/**
 * Serializa una fila de base de datos a formato API
 *
 * @param fila - Fila cruda de la base de datos
 * @returns Objeto serializado listo para enviar al cliente
 */
function serializarSenda(fila: typeof schema.enda.$inferSelect): SendaSerializada {
  return {
    id: fila.id,
    codigo: fila.codigo,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    colorHex: fila.colorHex,
    nombreIcono: fila.nombreIcono,
    orden: fila.orden
  };
}

/**
 * Rutas de Sendas
 * Agrupa todos los endpoints relacionados con sendas
 */
type Dependencias = {
  db?: DbClient;
};

export function crearModuloSendas({ db = dbPredeterminado }: Dependencias = {}) {
  const sendasRoutes = new Hono<AppBindings>();

/**
 * GET /sendas
 *
 * Lista todas las sendas espirituales activas ordenadas por orden.
 * No requiere autenticación.
 *
 * @returns Lista de sendas activas
 */
  sendasRoutes.get("/", async (c) => {
    // Query a la base de datos usando Drizzle ORM
    // Traemos todas las sendas donde activo = true, ordenadas ascendentemente
    const sendas = await db
      .select()
      .from(schema.enda)
      .where(eq(schema.enda.activo, true))
      .orderBy(asc(schema.enda.orden));

    // Respondemos con formato estándar de éxito
    return responderExito(sendas.map(serializarSenda));
  });

  return sendasRoutes;
}

export const sendasRoutes = crearModuloSendas();
