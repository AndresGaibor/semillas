import type { ClubsRepository } from "../clubs.repository";

function generarCodigoInvitacion() {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (byte) => caracteres[byte % caracteres.length]).join("");
}

type CrearRetoEntrada = {
  nombre: string;
  descripcion?: string;
  codigo_metrica: string;
  valor_objetivo: number;
  xp_reto: number;
  fecha_inicio: string;
  fecha_fin: string;
};

export function crearCasosUsoClubs(repositorio: ClubsRepository) {
  async function agregarUsuarioAlClub(clubId: string, codigoAcceso: string, userId: string) {
    const club = await repositorio.obtenerClub(clubId);
    if (!club) return { error: { mensaje: "Club no encontrado", codigo: "NOT_FOUND", estado: 404 } } as const;
    if (!club.activo) return { error: { mensaje: "Club inactivo", codigo: "FORBIDDEN", estado: 403 } } as const;
    if (club.codigoInvitacion.toUpperCase() !== codigoAcceso.toUpperCase()) {
      return { error: { mensaje: "Código de invitación incorrecto", codigo: "CODIGO_INCORRECTO", estado: 403 } } as const;
    }

    const existente = await repositorio.obtenerMembresia(userId, clubId);
    if (existente) return { alreadyMember: true, club } as const;

    await repositorio.agregarMiembro({ clubId, usuarioId: userId, rolMiembro: "miembro" });
    return { joined: true, club } as const;
  }

  return {
    listarMios: (usuarioId: string) => repositorio.listarMisClubes(usuarioId),
    listar: (search?: string) => repositorio.listarClubes(search),
    esMiembro: (clubId: string, usuarioId: string) => repositorio.obtenerMembresia(usuarioId, clubId),
    obtener: (clubId: string) => repositorio.obtenerClub(clubId),
    obtenerCreador: (usuarioId: string) => repositorio.obtenerCreadorClub(usuarioId),
    listarMiembros: (clubId: string) => repositorio.listarMiembrosClub(clubId),
    crear: async (body: { nombre: string; descripcion?: string }, userId: string) => {
      let codigoInvitacion = generarCodigoInvitacion();
      let intentos = 0;
      while (intentos < 5) {
        const existente = await repositorio.buscarCodigoInvitacion(codigoInvitacion);
        if (!existente) break;
        codigoInvitacion = generarCodigoInvitacion();
        intentos++;
      }
      if (intentos >= 5) throw new Error("No se pudo generar un código de invitación único");

      const club = await repositorio.crearClub({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        codigoInvitacion,
        creadoPor: userId
      });
      const membresia = await repositorio.agregarMiembro({ clubId: club.id, usuarioId: userId, rolMiembro: "lider" });
      if (!membresia) {
        await repositorio.eliminarClub(club.id);
        throw new Error("No se pudo registrar al líder del club");
      }
      return club;
    },
    unirse: agregarUsuarioAlClub,
    unirsePorCodigo: async (codigoAcceso: string, userId: string) => {
      const club = await repositorio.obtenerClubPorCodigo(codigoAcceso);
      if (!club) return { error: { mensaje: "Código de invitación inválido", codigo: "CODIGO_INCORRECTO", estado: 404 } } as const;
      return agregarUsuarioAlClub(club.id, codigoAcceso, userId);
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
    crearReto: async (clubId: string, body: CrearRetoEntrada, userId: string) => {
      const membership = await repositorio.obtenerMembresia(userId, clubId);
      if (!membership || membership.rolMiembro !== "lider") {
        return { error: { mensaje: "Solo el líder puede crear retos", codigo: "FORBIDDEN", estado: 403 } } as const;
      }
      return repositorio.crearReto({
        clubId,
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        codigoMetrica: body.codigo_metrica,
        valorObjetivo: body.valor_objetivo,
        xpReto: body.xp_reto,
        fechaInicio: new Date(body.fecha_inicio),
        fechaFin: new Date(body.fecha_fin),
        creadoPor: userId
      });
    }
  };
}
