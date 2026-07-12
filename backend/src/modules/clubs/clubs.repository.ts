import { and, desc, eq, ilike, sql } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

export type ClubsRepository = ReturnType<typeof crearClubsRepository>;

type RetoParaProgreso = {
  id: string;
  codigoMetrica: string;
  fechaInicio: Date;
  fechaFin: Date;
  valorObjetivo: number;
};

export function crearClubsRepository(db: DbClient) {
  return {
    async listarMisClubes(usuarioId: string) {
      return db
        .select({
          club: schema.club,
          rolMiembro: schema.miembroClub.rolMiembro,
          unidoEn: schema.miembroClub.unidoEn,
        })
        .from(schema.miembroClub)
        .innerJoin(schema.club, eq(schema.miembroClub.clubId, schema.club.id))
        .where(and(eq(schema.miembroClub.usuarioId, usuarioId), eq(schema.club.activo, true)))
        .orderBy(desc(schema.miembroClub.unidoEn));
    },

    async listarClubes(search?: string) {
      const condiciones = [eq(schema.club.activo, true)];
      if (search) condiciones.push(ilike(schema.club.nombre, `%${search}%`));
      return db.select().from(schema.club).where(and(...condiciones)).orderBy(desc(schema.club.creadoEn));
    },

    async contarMiembrosPorClub() {
      return db
        .select({ clubId: schema.miembroClub.clubId, total: sql<number>`count(*)` })
        .from(schema.miembroClub)
        .groupBy(schema.miembroClub.clubId);
    },

    async obtenerClub(clubId: string) {
      const [club] = await db.select().from(schema.club).where(eq(schema.club.id, clubId)).limit(1);
      return club ?? null;
    },

    async obtenerClubPorCodigo(codigo: string) {
      const [club] = await db
        .select()
        .from(schema.club)
        .where(and(eq(schema.club.codigoInvitacion, codigo.toUpperCase()), eq(schema.club.activo, true)))
        .limit(1);
      return club ?? null;
    },

    async obtenerCreadorClub(usuarioId: string) {
      const [creador] = await db
        .select({ id: schema.usuarioApp.id, nombre_visible: schema.usuarioApp.nombreVisible })
        .from(schema.usuarioApp)
        .where(eq(schema.usuarioApp.id, usuarioId))
        .limit(1);
      return creador ?? null;
    },

    async listarMiembrosClub(clubId: string) {
      const resultado = await db.execute(sql`
        select
          cm.club_id,
          cm.usuario_id,
          cm.rol_miembro,
          cm.unido_en,
          coalesce(p.apodo, ua.nombre_visible, 'Semillero') as apodo,
          p.clave_avatar,
          p.url_avatar,
          coalesce(vx.xp_total, 0)::int as xp_total,
          coalesce(semanal.xp_semana, 0)::int as xp_semana,
          coalesce(semanal.actividades_semana, 0)::int as actividades_semana
        from miembro_club cm
        join usuario_app ua on ua.id = cm.usuario_id
        left join perfil p on p.usuario_id = cm.usuario_id
        left join v_xp_usuario vx on vx.usuario_id = cm.usuario_id
        left join lateral (
          select
            coalesce(sum(ep.xp_otorgada), 0)::int as xp_semana,
            count(*) filter (where ep.tipo_evento = 'actividad_completada')::int as actividades_semana
          from evento_progreso ep
          where ep.usuario_id = cm.usuario_id
            and ep.ocurrido_en_cliente >= date_trunc('week', now())
        ) semanal on true
        where cm.club_id = ${clubId}
        order by
          case cm.rol_miembro when 'propietario' then 0 when 'lider' then 1 else 2 end,
          xp_semana desc,
          xp_total desc,
          apodo asc
      `);
      return Array.from(resultado as Iterable<Record<string, unknown>>);
    },

    async buscarCodigoInvitacion(codigo: string) {
      const [existing] = await db
        .select({ id: schema.club.id })
        .from(schema.club)
        .where(eq(schema.club.codigoInvitacion, codigo))
        .limit(1);
      return existing ?? null;
    },

    async crearClub(datos: { nombre: string; descripcion: string | null; codigoInvitacion: string; creadoPor: string }) {
      const [club] = await db.insert(schema.club).values(datos).returning();
      return club;
    },

    async actualizarClub(clubId: string, datos: { nombre?: string; descripcion?: string | null }) {
      const [club] = await db.update(schema.club).set(datos).where(eq(schema.club.id, clubId)).returning();
      return club ?? null;
    },

    async actualizarCodigoInvitacion(clubId: string, codigoInvitacion: string) {
      const [club] = await db
        .update(schema.club)
        .set({ codigoInvitacion })
        .where(eq(schema.club.id, clubId))
        .returning();
      return club ?? null;
    },

    async agregarMiembro(datos: { clubId: string; usuarioId: string; rolMiembro: string }) {
      const [creado] = await db.insert(schema.miembroClub).values(datos).onConflictDoNothing().returning();
      return creado ?? null;
    },

    async eliminarClub(clubId: string) {
      await db.delete(schema.club).where(eq(schema.club.id, clubId));
    },

    async obtenerMembresia(usuarioId: string, clubId: string) {
      const [membership] = await db
        .select({
          rolMiembro: schema.miembroClub.rolMiembro,
          unidoEn: schema.miembroClub.unidoEn,
        })
        .from(schema.miembroClub)
        .where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, usuarioId)))
        .limit(1);
      return membership ?? null;
    },

    async contarMiembrosClub(clubId: string) {
      const [countRow] = await db
        .select({ total: sql<number>`count(*)` })
        .from(schema.miembroClub)
        .where(eq(schema.miembroClub.clubId, clubId));
      return Number(countRow?.total ?? 0);
    },

    async eliminarMiembro(usuarioId: string, clubId: string) {
      await db
        .delete(schema.miembroClub)
        .where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, usuarioId)));
    },

    async actualizarRolMiembro(usuarioId: string, clubId: string, rolMiembro: string) {
      const [membership] = await db
        .update(schema.miembroClub)
        .set({ rolMiembro })
        .where(and(eq(schema.miembroClub.clubId, clubId), eq(schema.miembroClub.usuarioId, usuarioId)))
        .returning();
      return membership ?? null;
    },

    async desactivarClub(clubId: string) {
      const [club] = await db
        .update(schema.club)
        .set({ activo: false })
        .where(eq(schema.club.id, clubId))
        .returning();
      return club ?? null;
    },

    async obtenerRanking(clubId: string) {
      const resultado = await db.execute(sql`
        select
          cm.club_id,
          cm.usuario_id,
          cm.rol_miembro,
          coalesce(p.apodo, ua.nombre_visible, 'Semillero') as apodo,
          p.clave_avatar,
          p.url_avatar,
          coalesce(vx.xp_total, 0)::int as xp_total,
          coalesce(semanal.xp_semana, 0)::int as xp_semana,
          coalesce(semanal.actividades_semana, 0)::int as actividades_semana,
          rank() over (
            order by coalesce(semanal.xp_semana, 0) desc, coalesce(vx.xp_total, 0) desc
          )::int as numero_ranking
        from miembro_club cm
        join usuario_app ua on ua.id = cm.usuario_id
        left join perfil p on p.usuario_id = cm.usuario_id
        left join v_xp_usuario vx on vx.usuario_id = cm.usuario_id
        left join lateral (
          select
            coalesce(sum(ep.xp_otorgada), 0)::int as xp_semana,
            count(*) filter (where ep.tipo_evento = 'actividad_completada')::int as actividades_semana
          from evento_progreso ep
          where ep.usuario_id = cm.usuario_id
            and ep.ocurrido_en_cliente >= date_trunc('week', now())
        ) semanal on true
        where cm.club_id = ${clubId}
        order by numero_ranking asc, apodo asc
      `);
      return Array.from(resultado as Iterable<Record<string, unknown>>);
    },

    async listarRetos(clubId: string) {
      return db
        .select()
        .from(schema.retoClub)
        .where(eq(schema.retoClub.clubId, clubId))
        .orderBy(desc(schema.retoClub.fechaInicio));
    },

    async obtenerReto(clubId: string, retoId: string) {
      const [reto] = await db
        .select()
        .from(schema.retoClub)
        .where(and(eq(schema.retoClub.clubId, clubId), eq(schema.retoClub.id, retoId)))
        .limit(1);
      return reto ?? null;
    },

    async obtenerRecompensaReto(retoId: string, usuarioId: string) {
      const [recompensa] = await db
        .select()
        .from(schema.recompensaRetoClubUsuario)
        .where(and(
          eq(schema.recompensaRetoClubUsuario.retoId, retoId),
          eq(schema.recompensaRetoClubUsuario.usuarioId, usuarioId),
        ))
        .limit(1);
      return recompensa ?? null;
    },

    async reclamarRecompensaReto(retoId: string, usuarioId: string, xpOtorgada: number) {
      const resultado = await db.execute(sql`
        with reclamo as (
          insert into recompensa_reto_club_usuario (reto_id, usuario_id, xp_otorgada)
          values (${retoId}, ${usuarioId}, ${xpOtorgada})
          on conflict (reto_id, usuario_id) do nothing
          returning reto_id
        ), evento as (
          insert into evento_progreso (
            id_evento_cliente, usuario_id, tipo_evento, datos, xp_otorgada, ocurrido_en_cliente
          )
          select
            gen_random_uuid(),
            ${usuarioId},
            'recompensa_reclamada',
            jsonb_build_object('reto_club_id', ${retoId}),
            ${xpOtorgada},
            now()
          from reclamo
          returning id
        )
        select exists(select 1 from reclamo) as reclamado
      `);
      const [fila] = Array.from(resultado as Iterable<Record<string, unknown>>);
      return Boolean(fila?.reclamado);
    },

    async crearReto(datos: {
      clubId: string;
      nombre: string;
      descripcion: string | null;
      codigoMetrica: string;
      valorObjetivo: number;
      xpReto: number;
      fechaInicio: Date;
      fechaFin: Date;
      creadoPor: string;
    }) {
      const [data] = await db.insert(schema.retoClub).values(datos).returning();
      return data;
    },

    async calcularProgresoReto(clubId: string, usuarioId: string, reto: RetoParaProgreso) {
      const condicionComun = and(
        eq(schema.miembroClub.clubId, clubId),
        sql`${schema.eventoProgreso.ocurridoEnCliente} >= ${reto.fechaInicio}`,
        sql`${schema.eventoProgreso.ocurridoEnCliente} <= ${reto.fechaFin}`,
      );

      if (reto.codigoMetrica === "xp_grupal") {
        const [fila] = await db
          .select({
            total: sql<number>`coalesce(sum(${schema.eventoProgreso.xpOtorgada}), 0)`,
            aporteUsuario: sql<number>`coalesce(sum(${schema.eventoProgreso.xpOtorgada}) filter (where ${schema.eventoProgreso.usuarioId} = ${usuarioId}), 0)`,
          })
          .from(schema.eventoProgreso)
          .innerJoin(schema.miembroClub, eq(schema.miembroClub.usuarioId, schema.eventoProgreso.usuarioId))
          .where(condicionComun);
        return { total: Number(fila?.total ?? 0), aporteUsuario: Number(fila?.aporteUsuario ?? 0) };
      }

      const tipoEvento = reto.codigoMetrica === "temas_completados" ? "tema_completado" : "actividad_completada";
      const [fila] = await db
        .select({
          total: sql<number>`count(*) filter (where ${schema.eventoProgreso.tipoEvento} = ${tipoEvento})`,
          aporteUsuario: sql<number>`count(*) filter (where ${schema.eventoProgreso.tipoEvento} = ${tipoEvento} and ${schema.eventoProgreso.usuarioId} = ${usuarioId})`,
        })
        .from(schema.eventoProgreso)
        .innerJoin(schema.miembroClub, eq(schema.miembroClub.usuarioId, schema.eventoProgreso.usuarioId))
        .where(condicionComun);

      return { total: Number(fila?.total ?? 0), aporteUsuario: Number(fila?.aporteUsuario ?? 0) };
    },
  };
}
