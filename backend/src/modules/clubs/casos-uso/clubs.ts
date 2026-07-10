import type { ClubsRepository } from "../clubs.repository";

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function crearCasosUsoClubs(repositorio: ClubsRepository) {
  return {
    listarMios: (usuarioId: string) => repositorio.listarMisClubes(usuarioId),
    listar: (search?: string) => repositorio.listarClubes(search),
    obtener: (clubId: string) => repositorio.obtenerClub(clubId),
    obtenerCreador: (usuarioId: string) => repositorio.obtenerCreadorClub(usuarioId),
    listarMiembros: (clubId: string) => repositorio.listarMiembrosClub(clubId),
    crear: async (body: { name: string; description?: string }, userId: string) => {
      let inviteCode = generateInviteCode();
      let attempts = 0;
      while (attempts < 5) {
        const existing = await repositorio.buscarCodigoInvitacion(inviteCode);
        if (!existing) break;
        inviteCode = generateInviteCode();
        attempts++;
      }
      const club = await repositorio.crearClub({ nombre: body.name, descripcion: body.description ?? null, codigoInvitacion: inviteCode, creadoPor: userId });
      await repositorio.agregarMiembro({ clubId: club.id, usuarioId: userId, rolMiembro: "lider" });
      return club;
    },
    unirse: async (clubId: string, inviteCode: string, userId: string) => {
      const club = await repositorio.obtenerClub(clubId);
      if (!club) return { error: { mensaje: "Club no encontrado", codigo: "NOT_FOUND", estado: 404 } } as const;
      if (!club.activo) return { error: { mensaje: "Club inactivo", codigo: "FORBIDDEN", estado: 403 } } as const;
      if (club.codigoInvitacion !== inviteCode) return { error: { mensaje: "Código de invitación incorrecto", codigo: "CODIGO_INCORRECTO", estado: 403 } } as const;
      const existing = await repositorio.obtenerMembresia(userId, clubId);
      if (existing) return { alreadyMember: true } as const;
      await repositorio.agregarMiembro({ clubId, usuarioId: userId, rolMiembro: "miembro" });
      return { joined: true } as const;
    },
    salir: async (clubId: string, userId: string) => {
      const membership = await repositorio.obtenerMembresia(userId, clubId);
      if (!membership) return { error: { mensaje: "No eres miembro de este club", codigo: "NOT_FOUND", estado: 404 } } as const;
      if (membership.rolMiembro === "lider") {
        const total = await repositorio.contarMiembrosClub(clubId);
        if (total > 1) return { error: { mensaje: "Transfiere el liderazgo antes de salir", codigo: "TRANSFERIR_LIDERAZGO", estado: 400 } } as const;
      }
      await repositorio.eliminarMiembro(userId, clubId);
      const total = await repositorio.contarMiembrosClub(clubId);
      if (total === 0) await repositorio.desactivarClub(clubId);
      return { left: true } as const;
    },
    ranking: (clubId: string) => repositorio.obtenerRanking(clubId),
    listarRetos: (clubId: string) => repositorio.listarRetos(clubId),
    crearReto: async (clubId: string, body: { name: string; description?: string; metricCode: string; targetValue: number; rewardXp: number; startsOn: string; endsOn: string }, userId: string) => {
      const membership = await repositorio.obtenerMembresia(userId, clubId);
      if (!membership || membership.rolMiembro !== "lider") return { error: { mensaje: "Solo el líder puede crear retos", codigo: "FORBIDDEN", estado: 403 } } as const;
      return repositorio.crearReto({ clubId, nombre: body.name, descripcion: body.description ?? null, codigoMetrica: body.metricCode, valorObjetivo: body.targetValue, xpReto: body.rewardXp, fechaInicio: new Date(body.startsOn), fechaFin: new Date(body.endsOn), creadoPor: userId });
    }
  };
}
