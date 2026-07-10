import { and, desc, eq, ilike, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

export type ClubsRepository = ReturnType<typeof crearClubsRepository>;

export function crearClubsRepository(db: DbClient) {
  return {
    async listarMisClubes(usuarioId: string) {
      return db.select({ club: schema.club }).from(schema.miembroClub).innerJoin(schema.club, eq(schema.miembroClub.clubId, schema.club.id)).where(eq(schema.miembroClub.usuarioId, usuarioId));
    },
    async listarClubes(search?: string) {
      const condiciones = [eq(schema.club.activo, true)];
      if (search) condiciones.push(ilike(schema.club.nombre, `%${search}%`));
      return db.select().from(schema.club).where(and(...condiciones)).orderBy(desc(schema.club.creadoEn));
    },
    async contarMiembrosPorClub() {
      return db.select({ clubId: schema.miembroClub.clubId, total: sql<number>`count(*)` }).from(schema.miembroClub).groupBy(schema.miembroClub.clubId);
    },
    async obtenerClub(clubId: string) {
      const [club] = await db.select().from(schema.club).where(eq(schema.club.id, clubId)).limit(1);
      return club ?? null;
    },
    async obtenerCreadorClub(usuarioId: string) {
      const [creador] = await db.select({ id: schema.usuarioApp.id, nombre_visible: schema.usuarioApp.nombreVisible }).from(schema.usuarioApp).where(eq(schema.usuarioApp.id, usuarioId)).limit(1);
      return creador ?? null;
    },
    async listarMiembrosClub(clubId: string) {
      return db.select().from(schema.miembroClub).where(eq(schema.miembroClub.clubId, clubId));
    },
    async buscarCodigoInvitacion(codigo: string) {
      const [existing] = await db.select({ id: schema.club.id }).from(schema.club).where(eq(schema.club.codigoInvitacion, codigo)).limit(1);
      return existing ?? null;
    },
    async crearClub(datos: { nombre: string; descripcion: string | null; codigoInvitacion: string; creadoPor: string }) {
      const [club] = await db.insert(schema.club).values(datos).returning();
      return club;
    },
    async agregarMiembro(datos: { clubId: string; usuarioId: string; rolMiembro: string }) {
      await db.insert(schema.miembroClub).values(datos);
    },
    async obtenerMembresia(usuarioId: string, clubId: string) {
      const [membership] = await db.select({ rolMiembro: schema.miembroClub.rolMiembro }).from(schema.miembroClub).where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, usuarioId))).limit(1);
      return membership ?? null;
    },
    async contarMiembrosClub(clubId: string) {
      const [countRow] = await db.select({ total: sql<number>`count(*)` }).from(schema.miembroClub).where(eq(schema.miembroClub.clubId, clubId));
      return Number(countRow?.total ?? 0);
    },
    async eliminarMiembro(usuarioId: string, clubId: string) {
      await db.delete(schema.miembroClub).where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, usuarioId)));
    },
    async desactivarClub(clubId: string) {
      await db.update(schema.club).set({ activo: false }).where(eq(schema.club.id, clubId));
    },
    async obtenerRanking(clubId: string) {
      return db.execute(sql`
        select club_id, usuario_id, apodo, numero_ranking, xp_total
        from v_ranking_club
        where club_id = ${clubId}
        order by numero_ranking asc
      `);
    },
    async listarRetos(clubId: string) {
      return db.select().from(schema.retoClub).where(eq(schema.retoClub.clubId, clubId)).orderBy(desc(schema.retoClub.fechaInicio));
    },
    async crearReto(datos: { clubId: string; nombre: string; descripcion: string | null; codigoMetrica: string; valorObjetivo: number; xpReto: number; fechaInicio: Date; fechaFin: Date; creadoPor: string }) {
      const [data] = await db.insert(schema.retoClub).values(datos).returning();
      return data;
    }
  };
}
