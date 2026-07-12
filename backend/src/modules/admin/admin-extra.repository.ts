import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";
import { BadRequestError, NotFoundError } from "../../shared/errors/http-error";

function iso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function serializarSenda(senda: typeof schema.senda.$inferSelect, extra?: { temas?: number; publicados?: number }) {
  return {
    id: senda.id,
    nombre: senda.nombre,
    codigo: senda.codigo,
    descripcion: senda.descripcion,
    color_hex: senda.colorHex,
    nombre_icono: senda.nombreIcono,
    orden: senda.orden,
    activo: senda.activo,
    creado_en: senda.creadoEn.toISOString(),
    temas: extra?.temas ?? 0,
    publicados: extra?.publicados ?? 0,
  };
}

function serializarClub(club: typeof schema.club.$inferSelect) {
  return {
    id: club.id,
    nombre: club.nombre,
    descripcion: club.descripcion,
    codigo_invitacion: club.codigoInvitacion,
    creado_por: club.creadoPor,
    activo: club.activo,
    creado_en: club.creadoEn.toISOString(),
  };
}

function serializarNivel(nivel: typeof schema.reglaNivel.$inferSelect) {
  return {
    id: nivel.id,
    nombre: nivel.nombre,
    numero_nivel: nivel.numeroNivel,
    xp_minima: nivel.xpMinima,
    color_insignia: nivel.colorInsignia,
  };
}

function serializarLogro(logro: typeof schema.logro.$inferSelect) {
  return {
    id: logro.id,
    nombre: logro.nombre,
    codigo: logro.codigo,
    descripcion: logro.descripcion,
    url_icono: logro.urlIcono,
    bono_xp: logro.bonoXp,
    codigo_criterio: logro.codigoCriterio,
    valor_criterio: logro.valorCriterio,
    activo: logro.activo,
    creado_en: logro.creadoEn.toISOString(),
  };
}

export function crearAdminExtraRepository(db: DbClient) {
  async function registrarAuditoria(input: {
    actorId?: string | null;
    accion: string;
    tipoEntidad: string;
    entidadId?: string | null;
    antes?: unknown;
    despues?: unknown;
  }) {
    await db.insert(schema.registroAuditoria).values({
      actorUsuarioId: input.actorId ?? null,
      accion: input.accion,
      tipoEntidad: input.tipoEntidad,
      entidadId: input.entidadId ?? null,
      datosAntes: (input.antes ?? null) as never,
      datosDespues: (input.despues ?? null) as never,
    });
  }

  async function listarSendasInterno() {
    const filas = await db
      .select({
        senda: schema.senda,
        temas: sql<number>`count(${schema.tema.id})::int`,
        publicados: sql<number>`count(${schema.tema.id}) filter (where ${schema.tema.estado} = 'publicado')::int`,
      })
      .from(schema.senda)
      .leftJoin(schema.tema, eq(schema.tema.sendaId, schema.senda.id))
      .groupBy(schema.senda.id)
      .orderBy(asc(schema.senda.orden));

    return filas.map((fila) => serializarSenda(fila.senda, {
      temas: Number(fila.temas),
      publicados: Number(fila.publicados),
    }));
  }

  return {
    listarSendas: listarSendasInterno,

    async crearSenda(input: {
      nombre: string;
      codigo: string;
      descripcion?: string | null;
      color_hex: string;
      nombre_icono?: string | null;
      activo: boolean;
    }, actorId?: string) {
      const [max] = await db
        .select({ orden: sql<number>`coalesce(max(${schema.senda.orden}), 0)::int` })
        .from(schema.senda);
      const [senda] = await db
        .insert(schema.senda)
        .values({
          nombre: input.nombre,
          codigo: input.codigo,
          descripcion: input.descripcion ?? null,
          colorHex: input.color_hex,
          nombreIcono: input.nombre_icono ?? null,
          activo: input.activo,
          orden: Number(max?.orden ?? 0) + 1,
        })
        .returning();
      if (!senda) throw new BadRequestError("No se pudo crear la Senda");
      await registrarAuditoria({ actorId, accion: "crear", tipoEntidad: "senda", entidadId: senda.id, despues: serializarSenda(senda) });
      return serializarSenda(senda);
    },

    async actualizarSenda(id: string, input: Record<string, unknown>, actorId?: string) {
      const [anterior] = await db.select().from(schema.senda).where(eq(schema.senda.id, id)).limit(1);
      if (!anterior) throw new NotFoundError("Senda no encontrada");
      const cambios = {
        ...(input.nombre !== undefined ? { nombre: String(input.nombre) } : {}),
        ...(input.codigo !== undefined ? { codigo: String(input.codigo) } : {}),
        ...(input.descripcion !== undefined ? { descripcion: input.descripcion as string | null } : {}),
        ...(input.color_hex !== undefined ? { colorHex: String(input.color_hex) } : {}),
        ...(input.nombre_icono !== undefined ? { nombreIcono: input.nombre_icono as string | null } : {}),
        ...(input.activo !== undefined ? { activo: Boolean(input.activo) } : {}),
      };
      const [senda] = await db.update(schema.senda).set(cambios).where(eq(schema.senda.id, id)).returning();
      if (!senda) throw new NotFoundError("Senda no encontrada");
      await registrarAuditoria({ actorId, accion: "actualizar", tipoEntidad: "senda", entidadId: id, antes: serializarSenda(anterior), despues: serializarSenda(senda) });
      return serializarSenda(senda);
    },

    async reordenarSendas(ids: string[], actorId?: string) {
      const existentes = await db.select({ id: schema.senda.id }).from(schema.senda);
      const idsExistentes = new Set(existentes.map((item) => item.id));
      if (ids.length !== idsExistentes.size || ids.some((id) => !idsExistentes.has(id))) {
        throw new BadRequestError("El orden debe incluir todas las Sendas exactamente una vez");
      }
      await db.transaction(async (tx) => {
        for (const [index, id] of ids.entries()) {
          await tx.update(schema.senda).set({ orden: index + 1 }).where(eq(schema.senda.id, id));
        }
      });
      await registrarAuditoria({ actorId, accion: "reordenar", tipoEntidad: "senda", despues: { senda_ids: ids } });
      return listarSendasInterno();
    },

    async eliminarSenda(id: string, actorId?: string) {
      const [conteo] = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(schema.tema)
        .where(eq(schema.tema.sendaId, id));
      if (Number(conteo?.total ?? 0) > 0) {
        throw new BadRequestError("No puedes eliminar una Senda con temas asociados. Desactívala en su lugar.");
      }
      const [eliminada] = await db.delete(schema.senda).where(eq(schema.senda.id, id)).returning();
      if (!eliminada) throw new NotFoundError("Senda no encontrada");
      await registrarAuditoria({ actorId, accion: "eliminar", tipoEntidad: "senda", entidadId: id, antes: serializarSenda(eliminada) });
      return { eliminada: true };
    },

    async listarClubes(params: { q?: string; activo?: boolean; limit: number; offset: number }) {
      const filtros: SQL[] = [];
      if (params.q) {
        const busqueda = or(
          ilike(schema.club.nombre, `%${params.q}%`),
          ilike(schema.club.codigoInvitacion, `%${params.q}%`),
        );
        if (busqueda) filtros.push(busqueda);
      }
      if (params.activo !== undefined) filtros.push(eq(schema.club.activo, params.activo));
      const where = filtros.length ? and(...filtros) : undefined;
      const [clubes, [total]] = await Promise.all([
        db
          .select({
            club: schema.club,
            creador: schema.usuarioApp.nombreVisible,
            miembros: sql<number>`count(${schema.miembroClub.usuarioId})::int`,
          })
          .from(schema.club)
          .leftJoin(schema.usuarioApp, eq(schema.usuarioApp.id, schema.club.creadoPor))
          .leftJoin(schema.miembroClub, eq(schema.miembroClub.clubId, schema.club.id))
          .where(where)
          .groupBy(schema.club.id, schema.usuarioApp.nombreVisible)
          .orderBy(desc(schema.club.creadoEn))
          .limit(params.limit)
          .offset(params.offset),
        db.select({ total: sql<number>`count(*)::int` }).from(schema.club).where(where),
      ]);
      return {
        clubes: clubes.map((fila) => ({
          ...serializarClub(fila.club),
          creador: fila.creador ?? "Sin creador",
          miembros: Number(fila.miembros),
        })),
        total: Number(total?.total ?? 0),
        limit: params.limit,
        offset: params.offset,
      };
    },

    async obtenerClub(id: string) {
      const [club] = await db.select().from(schema.club).where(eq(schema.club.id, id)).limit(1);
      if (!club) throw new NotFoundError("Club no encontrado");
      const [miembros, retos] = await Promise.all([
        db
          .select({
            usuarioId: schema.miembroClub.usuarioId,
            rol: schema.miembroClub.rolMiembro,
            unidoEn: schema.miembroClub.unidoEn,
            nombre: schema.usuarioApp.nombreVisible,
            correo: schema.usuarioApp.correo,
            activo: schema.usuarioApp.activo,
          })
          .from(schema.miembroClub)
          .innerJoin(schema.usuarioApp, eq(schema.usuarioApp.id, schema.miembroClub.usuarioId))
          .where(eq(schema.miembroClub.clubId, id))
          .orderBy(asc(schema.miembroClub.unidoEn)),
        db.select().from(schema.retoClub).where(eq(schema.retoClub.clubId, id)).orderBy(desc(schema.retoClub.fechaInicio)),
      ]);
      return {
        club: serializarClub(club),
        miembros: miembros.map((miembro) => ({
          usuarioId: miembro.usuarioId,
          rol: miembro.rol,
          unidoEn: miembro.unidoEn.toISOString(),
          nombre: miembro.nombre,
          correo: miembro.correo,
          activo: miembro.activo,
        })),
        retos: retos.map((reto) => ({
          id: reto.id,
          nombre: reto.nombre,
          descripcion: reto.descripcion,
          codigoMetrica: reto.codigoMetrica,
          valorObjetivo: reto.valorObjetivo,
          xpReto: reto.xpReto,
          fechaInicio: reto.fechaInicio.toISOString(),
          fechaFin: reto.fechaFin.toISOString(),
        })),
      };
    },

    async moderarClub(id: string, input: { activo?: boolean; descripcion?: string | null; nombre?: string }, actorId?: string) {
      const [anterior] = await db.select().from(schema.club).where(eq(schema.club.id, id)).limit(1);
      if (!anterior) throw new NotFoundError("Club no encontrado");
      const [club] = await db.update(schema.club).set(input).where(eq(schema.club.id, id)).returning();
      if (!club) throw new NotFoundError("Club no encontrado");
      await registrarAuditoria({ actorId, accion: input.activo === false ? "suspender" : input.activo === true ? "reactivar" : "actualizar", tipoEntidad: "club", entidadId: id, antes: serializarClub(anterior), despues: serializarClub(club) });
      return serializarClub(club);
    },

    async obtenerReportes(desde: Date, hasta: Date) {
      if (Number.isNaN(desde.getTime()) || Number.isNaN(hasta.getTime()) || desde > hasta) {
        throw new BadRequestError("El rango de fechas no es válido");
      }
      const [usuarios, temas, actividades, clubes, xp, eventosPorDia, temasPorSenda, progreso] = await Promise.all([
        db.select({ total: sql<number>`count(*)::int`, activos: sql<number>`count(*) filter (where ${schema.usuarioApp.activo} = true)::int` }).from(schema.usuarioApp),
        db.select({ total: sql<number>`count(*)::int`, publicados: sql<number>`count(*) filter (where ${schema.tema.estado} = 'publicado')::int` }).from(schema.tema),
        db.select({ total: sql<number>`count(*)::int` }).from(schema.actividad),
        db.select({ total: sql<number>`count(*)::int`, activos: sql<number>`count(*) filter (where ${schema.club.activo} = true)::int` }).from(schema.club),
        db.select({ total: sql<number>`coalesce(sum(${schema.movimientoXp.cantidad}), 0)::int` }).from(schema.movimientoXp).where(and(sql`${schema.movimientoXp.creadoEn} >= ${desde}`, sql`${schema.movimientoXp.creadoEn} <= ${hasta}`)),
        db.execute(sql`
          select date_trunc('day', recibido_en_servidor)::date::text as fecha, count(*)::int as total
          from evento_progreso
          where recibido_en_servidor >= ${desde} and recibido_en_servidor <= ${hasta}
          group by 1 order by 1
        `),
        db.execute(sql`
          select s.nombre, count(t.id)::int as total,
                 count(t.id) filter (where t.estado = 'publicado')::int as publicados
          from senda s left join tema t on t.senda_id = s.id
          group by s.id, s.nombre, s.orden order by s.orden
        `),
        db.select({
          iniciados: sql<number>`count(*) filter (where ${schema.progresoTemaUsuario.estado} = 'en_progreso')::int`,
          completados: sql<number>`count(*) filter (where ${schema.progresoTemaUsuario.estado} = 'completado')::int`,
          promedio: sql<number>`coalesce(avg(${schema.progresoTemaUsuario.porcentaje}), 0)::numeric`,
        }).from(schema.progresoTemaUsuario),
      ]);
      const actividadDiaria = eventosPorDia as unknown as Array<{ fecha: string; total: number }>;
      const porSenda = temasPorSenda as unknown as Array<{ nombre: string; total: number; publicados: number }>;
      return {
        periodo: { desde: desde.toISOString(), hasta: hasta.toISOString() },
        metricas: {
          usuarios: Number(usuarios[0]?.total ?? 0),
          usuarios_activos: Number(usuarios[0]?.activos ?? 0),
          temas: Number(temas[0]?.total ?? 0),
          temas_publicados: Number(temas[0]?.publicados ?? 0),
          actividades: Number(actividades[0]?.total ?? 0),
          clubes: Number(clubes[0]?.total ?? 0),
          clubes_activos: Number(clubes[0]?.activos ?? 0),
          xp_otorgada_periodo: Number(xp[0]?.total ?? 0),
          temas_en_progreso: Number(progreso[0]?.iniciados ?? 0),
          temas_completados: Number(progreso[0]?.completados ?? 0),
          progreso_promedio: Number(progreso[0]?.promedio ?? 0),
        },
        actividad_diaria: actividadDiaria.map((item) => ({ fecha: String(item.fecha), total: Number(item.total) })),
        temas_por_senda: porSenda.map((item) => ({ nombre: String(item.nombre), total: Number(item.total), publicados: Number(item.publicados) })),
      };
    },

    async listarAuditoria(params: { q?: string; entidad?: string; limit: number; offset: number }) {
      const filtros: SQL[] = [];
      if (params.q) {
        const busqueda = or(
          ilike(schema.registroAuditoria.accion, `%${params.q}%`),
          ilike(schema.registroAuditoria.tipoEntidad, `%${params.q}%`),
        );
        if (busqueda) filtros.push(busqueda);
      }
      if (params.entidad) filtros.push(eq(schema.registroAuditoria.tipoEntidad, params.entidad));
      const where = filtros.length ? and(...filtros) : undefined;
      const [items, [total]] = await Promise.all([
        db.select({ auditoria: schema.registroAuditoria, actor: schema.usuarioApp.nombreVisible })
          .from(schema.registroAuditoria)
          .leftJoin(schema.usuarioApp, eq(schema.usuarioApp.id, schema.registroAuditoria.actorUsuarioId))
          .where(where)
          .orderBy(desc(schema.registroAuditoria.creadoEn))
          .limit(params.limit)
          .offset(params.offset),
        db.select({ total: sql<number>`count(*)::int` }).from(schema.registroAuditoria).where(where),
      ]);
      return {
        items: items.map((item) => ({
          id: item.auditoria.id,
          tipo_entidad: item.auditoria.tipoEntidad,
          entidad_id: item.auditoria.entidadId,
          accion: item.auditoria.accion,
          datos_antes: item.auditoria.datosAntes,
          datos_despues: item.auditoria.datosDespues,
          actor_usuario_id: item.auditoria.actorUsuarioId,
          direccion_ip: item.auditoria.direccionIp,
          agente_usuario: item.auditoria.agenteUsuario,
          creado_en: item.auditoria.creadoEn.toISOString(),
          actor: item.actor ?? "Sistema",
        })),
        total: Number(total?.total ?? 0),
        limit: params.limit,
        offset: params.offset,
      };
    },

    async listarAjustes() {
      const ajustes = await db.select().from(schema.configuracionPlataforma).orderBy(asc(schema.configuracionPlataforma.categoria), asc(schema.configuracionPlataforma.clave));
      return ajustes.map((ajuste) => ({
        clave: ajuste.clave,
        categoria: ajuste.categoria,
        valor: ajuste.valor,
        descripcion: ajuste.descripcion,
        actualizado_por: ajuste.actualizadoPor,
        actualizado_en: ajuste.actualizadoEn.toISOString(),
      }));
    },

    async guardarAjuste(clave: string, input: { valor: unknown; descripcion?: string | null }, actorId: string) {
      const [anterior] = await db.select().from(schema.configuracionPlataforma).where(eq(schema.configuracionPlataforma.clave, clave)).limit(1);
      const categoria = clave.includes(".") ? clave.split(".")[0]! : "general";
      const [ajuste] = await db.insert(schema.configuracionPlataforma).values({
        clave,
        categoria,
        valor: input.valor as never,
        descripcion: input.descripcion ?? null,
        actualizadoPor: actorId,
        actualizadoEn: new Date(),
      }).onConflictDoUpdate({
        target: schema.configuracionPlataforma.clave,
        set: {
          valor: input.valor as never,
          ...(input.descripcion !== undefined ? { descripcion: input.descripcion } : {}),
          actualizadoPor: actorId,
          actualizadoEn: new Date(),
        },
      }).returning();
      if (!ajuste) throw new BadRequestError("No se pudo guardar el ajuste");
      const salida = {
        clave: ajuste.clave,
        categoria: ajuste.categoria,
        valor: ajuste.valor,
        descripcion: ajuste.descripcion,
        actualizado_por: ajuste.actualizadoPor,
        actualizado_en: ajuste.actualizadoEn.toISOString(),
      };
      await registrarAuditoria({ actorId, accion: "configurar", tipoEntidad: "configuracion", entidadId: null, antes: anterior?.valor, despues: salida });
      return salida;
    },

    async ajustarXpUsuario(
      usuarioId: string,
      input: { cantidad: number; motivo: string },
      actorId?: string,
    ) {
      const [usuario] = await db.select({ id: schema.usuarioApp.id, nombre: schema.usuarioApp.nombreVisible })
        .from(schema.usuarioApp)
        .where(eq(schema.usuarioApp.id, usuarioId))
        .limit(1);
      if (!usuario) throw new NotFoundError("Usuario no encontrado");

      const origenId = crypto.randomUUID();
      const [movimiento] = await db.insert(schema.movimientoXp).values({
        usuarioId,
        origen: "ajuste_admin",
        origenId,
        cantidad: input.cantidad,
        metadatos: {
          motivo: input.motivo,
          actor_usuario_id: actorId ?? null,
        },
      }).returning();
      if (!movimiento) throw new BadRequestError("No se pudo registrar el ajuste de XP");

      await db.insert(schema.notificacionUsuario).values({
        usuarioId,
        tipo: "ajuste_xp",
        titulo: input.cantidad > 0 ? "Recibiste un ajuste de XP" : "Se corrigió tu XP",
        mensaje: `${input.cantidad > 0 ? "+" : ""}${input.cantidad} XP · ${input.motivo}`,
        datos: { movimiento_id: movimiento.id, cantidad: input.cantidad },
      });

      const [total] = await db.select({ xp: sql<number>`coalesce(sum(${schema.movimientoXp.cantidad}), 0)::int` })
        .from(schema.movimientoXp)
        .where(eq(schema.movimientoXp.usuarioId, usuarioId));
      await registrarAuditoria({
        actorId,
        accion: "ajustar_xp",
        tipoEntidad: "usuario",
        entidadId: usuarioId,
        despues: { cantidad: input.cantidad, motivo: input.motivo, xp_total: Number(total?.xp ?? 0) },
      });
      return {
        movimiento_id: movimiento.id,
        usuario_id: usuarioId,
        cantidad: movimiento.cantidad,
        xp_total: Number(total?.xp ?? 0),
      };
    },

    async listarConfiguracionGamificacion() {
      const [niveles, logros, [estadisticas]] = await Promise.all([
        db.select().from(schema.reglaNivel).orderBy(asc(schema.reglaNivel.numeroNivel)),
        db.select().from(schema.logro).orderBy(asc(schema.logro.nombre)),
        db.select({
          xpOtorgada: sql<number>`coalesce(sum(${schema.movimientoXp.cantidad}), 0)::int`,
          usuariosConXp: sql<number>`count(distinct ${schema.movimientoXp.usuarioId})::int`,
        }).from(schema.movimientoXp),
      ]);
      return {
        niveles: niveles.map(serializarNivel),
        logros: logros.map(serializarLogro),
        estadisticas: {
          xpOtorgada: Number(estadisticas?.xpOtorgada ?? 0),
          usuariosConXp: Number(estadisticas?.usuariosConXp ?? 0),
        },
      };
    },

    async crearNivel(input: { nombre: string; numero_nivel: number; xp_minima: number; color_insignia?: string | null }, actorId?: string) {
      const [anterior] = await db.select().from(schema.reglaNivel).orderBy(desc(schema.reglaNivel.numeroNivel)).limit(1);
      if (anterior && (input.numero_nivel <= anterior.numeroNivel || input.xp_minima <= anterior.xpMinima)) {
        throw new BadRequestError("El nuevo nivel debe tener un número y una XP mínima superiores al último nivel");
      }
      const [nivel] = await db.insert(schema.reglaNivel).values({
        nombre: input.nombre,
        numeroNivel: input.numero_nivel,
        xpMinima: input.xp_minima,
        colorInsignia: input.color_insignia ?? null,
      }).returning();
      if (!nivel) throw new BadRequestError("No se pudo crear el nivel");
      await registrarAuditoria({ actorId, accion: "crear", tipoEntidad: "nivel", entidadId: nivel.id, despues: serializarNivel(nivel) });
      return serializarNivel(nivel);
    },

    async actualizarNivel(id: string, input: Record<string, unknown>, actorId?: string) {
      const [anterior] = await db.select().from(schema.reglaNivel).where(eq(schema.reglaNivel.id, id)).limit(1);
      if (!anterior) throw new NotFoundError("Nivel no encontrado");
      const [nivel] = await db.update(schema.reglaNivel).set({
        ...(input.nombre !== undefined ? { nombre: String(input.nombre) } : {}),
        ...(input.numero_nivel !== undefined ? { numeroNivel: Number(input.numero_nivel) } : {}),
        ...(input.xp_minima !== undefined ? { xpMinima: Number(input.xp_minima) } : {}),
        ...(input.color_insignia !== undefined ? { colorInsignia: input.color_insignia as string | null } : {}),
      }).where(eq(schema.reglaNivel.id, id)).returning();
      if (!nivel) throw new NotFoundError("Nivel no encontrado");
      const todos = await db.select().from(schema.reglaNivel).orderBy(asc(schema.reglaNivel.numeroNivel));
      for (let index = 1; index < todos.length; index += 1) {
        const previo = todos[index - 1]!;
        const actual = todos[index]!;
        if (actual.numeroNivel <= previo.numeroNivel || actual.xpMinima <= previo.xpMinima) {
          await db.update(schema.reglaNivel).set({
            nombre: anterior.nombre,
            numeroNivel: anterior.numeroNivel,
            xpMinima: anterior.xpMinima,
            colorInsignia: anterior.colorInsignia,
          }).where(eq(schema.reglaNivel.id, id));
          throw new BadRequestError("Los niveles deben conservar un orden ascendente de número y XP mínima");
        }
      }
      await registrarAuditoria({ actorId, accion: "actualizar", tipoEntidad: "nivel", entidadId: id, antes: serializarNivel(anterior), despues: serializarNivel(nivel) });
      return serializarNivel(nivel);
    },

    async crearLogro(input: {
      nombre: string;
      codigo: string;
      descripcion?: string | null;
      url_icono?: string | null;
      bono_xp: number;
      codigo_criterio: string;
      valor_criterio: number;
      activo: boolean;
    }, actorId?: string) {
      const [logro] = await db.insert(schema.logro).values({
        nombre: input.nombre,
        codigo: input.codigo,
        descripcion: input.descripcion ?? null,
        urlIcono: input.url_icono ?? null,
        bonoXp: input.bono_xp,
        codigoCriterio: input.codigo_criterio,
        valorCriterio: input.valor_criterio,
        activo: input.activo,
      }).returning();
      if (!logro) throw new BadRequestError("No se pudo crear el logro");
      await registrarAuditoria({ actorId, accion: "crear", tipoEntidad: "logro", entidadId: logro.id, despues: serializarLogro(logro) });
      return serializarLogro(logro);
    },

    async actualizarLogro(id: string, input: Record<string, unknown>, actorId?: string) {
      const [anterior] = await db.select().from(schema.logro).where(eq(schema.logro.id, id)).limit(1);
      if (!anterior) throw new NotFoundError("Logro no encontrado");
      const [logro] = await db.update(schema.logro).set({
        ...(input.nombre !== undefined ? { nombre: String(input.nombre) } : {}),
        ...(input.codigo !== undefined ? { codigo: String(input.codigo) } : {}),
        ...(input.descripcion !== undefined ? { descripcion: input.descripcion as string | null } : {}),
        ...(input.url_icono !== undefined ? { urlIcono: input.url_icono as string | null } : {}),
        ...(input.bono_xp !== undefined ? { bonoXp: Number(input.bono_xp) } : {}),
        ...(input.codigo_criterio !== undefined ? { codigoCriterio: String(input.codigo_criterio) } : {}),
        ...(input.valor_criterio !== undefined ? { valorCriterio: Number(input.valor_criterio) } : {}),
        ...(input.activo !== undefined ? { activo: Boolean(input.activo) } : {}),
      }).where(eq(schema.logro.id, id)).returning();
      if (!logro) throw new NotFoundError("Logro no encontrado");
      await registrarAuditoria({ actorId, accion: "actualizar", tipoEntidad: "logro", entidadId: id, antes: serializarLogro(anterior), despues: serializarLogro(logro) });
      return serializarLogro(logro);
    },
  };
}
