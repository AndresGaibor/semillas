import type { ClubsRepository } from "../clubs.repository";

type CrearRetoAdminEntrada = Omit<Parameters<ClubsRepository["crearReto"]>[0], "clubId" | "creadoPor">;

function error(mensaje: string, codigo: string, estado: number) {
  return { error: { mensaje, codigo, estado } } as const;
}

function fechaIso(fecha: Date | null | undefined) {
  return fecha ? fecha.toISOString() : null;
}

export function crearCasosUsoAdminClubs(repositorio: ClubsRepository) {
  return {
    listar: async (filtros: { q?: string; activo?: boolean; limit: number; offset: number }) => {
      const resultado = await repositorio.listarClubesAdministracion(filtros);
      return {
        clubes: resultado.clubes.map((club) => ({
          id: club.id,
          nombre: club.nombre,
          descripcion: club.descripcion,
          activo: club.activo,
          creado_en: club.creadoEn.toISOString(),
          miembros: Number(club.miembros),
          retos_abiertos: Number(club.retosAbiertos),
          lider: club.liderUsuarioId && club.liderApodo
            ? { usuario_id: club.liderUsuarioId, apodo: club.liderApodo }
            : null,
        })),
        meta: { total: resultado.total, limit: filtros.limit, offset: filtros.offset },
      };
    },

    obtenerDetalle: async (clubId: string) => {
      const club = await repositorio.obtenerClub(clubId);
      if (!club) return error("Club no encontrado", "NOT_FOUND", 404);
      const [miembros, retos] = await Promise.all([
        repositorio.listarMiembrosClubAdministracion(clubId),
        repositorio.listarRetos(clubId),
      ]);
      return {
        club: {
          id: club.id,
          nombre: club.nombre,
          descripcion: club.descripcion,
          activo: club.activo,
          creado_en: club.creadoEn.toISOString(),
        },
        miembros: miembros.map((miembro) => ({
          usuario_id: String(miembro.usuario_id),
          apodo: String(miembro.apodo),
          rol_miembro: typeof miembro.rol_miembro === "string" ? miembro.rol_miembro : null,
          unido_en: miembro.unido_en instanceof Date ? miembro.unido_en.toISOString() : fechaIso(miembro.unido_en as Date | null | undefined),
        })),
        retos: retos.map((reto) => ({
          id: reto.id,
          nombre: reto.nombre,
          descripcion: reto.descripcion,
          codigo_metrica: reto.codigoMetrica,
          valor_objetivo: reto.valorObjetivo,
          xp_reto: reto.xpReto,
          fecha_inicio: reto.fechaInicio.toISOString(),
          fecha_fin: reto.fechaFin.toISOString(),
        })),
      };
    },

    archivar: async (clubId: string, _administradorId: string) => {
      const club = await repositorio.desactivarClub(clubId);
      return club ? { archived: true } : error("Club no encontrado", "NOT_FOUND", 404);
    },

    reactivar: async (clubId: string, _administradorId: string) => {
      const club = await repositorio.reactivarClub(clubId);
      return club ? { reactivated: true } : error("Club no encontrado", "NOT_FOUND", 404);
    },

    quitarMiembro: async (clubId: string, usuarioId: string, _administradorId: string) => {
      const resultado = await repositorio.quitarMiembroAdministracion(clubId, usuarioId);
      if (resultado.resultado === "no_encontrado") return error("Miembro no encontrado", "NOT_FOUND", 404);
      if (resultado.resultado === "RESPONSABLE_REQUERIDO") {
        return error("Transfiere la responsabilidad antes de retirar al ultimo responsable", "RESPONSABLE_REQUERIDO", 400);
      }
      return { removed: true } as const;
    },

    transferirLiderazgo: async (clubId: string, usuarioId: string, _administradorId: string) => {
      const resultado = await repositorio.transferirResponsabilidadClub(clubId, usuarioId);
      if (resultado.resultado === "no_encontrado") return error("Miembro no encontrado", "NOT_FOUND", 404);
      if (resultado.resultado === "RESPONSABLE_REQUERIDO") {
        return error("El club no tiene responsable", "RESPONSABLE_REQUERIDO", 400);
      }
      if (resultado.resultado === "ya_responsable") {
        return error("La persona ya es responsable del club", "INVALID_OPERATION", 400);
      }
      return { transferred: true, usuario_id: usuarioId } as const;
    },

    crearReto: (clubId: string, reto: CrearRetoAdminEntrada, administradorId: string) =>
      repositorio.crearReto({ ...reto, clubId, creadoPor: administradorId }),

    cerrarReto: async (clubId: string, retoId: string, _administradorId: string) => {
      const reto = await repositorio.cerrarReto(clubId, retoId);
      return reto ? { closed: true } : error("Reto no encontrado", "NOT_FOUND", 404);
    },
  };
}
