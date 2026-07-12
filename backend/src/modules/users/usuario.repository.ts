import { eq, and, desc, isNull } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";
import { ErrorConflicto } from "../../shared/errores/error-aplicacion";

type PerfilFila = typeof schema.perfil.$inferSelect;
type UsuarioFila = typeof schema.usuarioApp.$inferSelect;

type PerfilActualizacion = {
  apodo?: string | null;
  grupoEdadId?: string | null;
  urlAvatar?: string | null;
  prefiereAudio?: boolean | null;
  tamanoTextoPreferido?: "pequeno" | "mediano" | "grande" | null;
};

type VincularCuentaInput = {
  usuarioId: string;
  idExterno: string;
  proveedor: UsuarioFila["proveedor"];
  correo: string | null;
  nombreVisible: string;
};

type UsuarioVinculadoFila = {
  id: string;
  rol: UsuarioFila["rol"];
  proveedor: UsuarioFila["proveedor"];
  nombre_visible: string;
  correo: string | null;
};

export function crearUsuarioRepository(db: DbClient) {
  return {
    async obtenerPerfilPorUsuarioId(usuarioId: string): Promise<PerfilFila | null> {
      const [perfil] = await db
        .select()
        .from(schema.perfil)
        .where(eq(schema.perfil.usuarioId, usuarioId))
        .limit(1);

      return perfil ?? null;
    },

    async actualizarPerfilPorUsuarioId(
      usuarioId: string,
      actualizacion: PerfilActualizacion
    ): Promise<PerfilFila> {
      const cambios: Record<string, unknown> = {
        actualizadoEn: new Date()
      };

      if (actualizacion.apodo !== undefined && actualizacion.apodo !== null) {
        cambios.apodo = actualizacion.apodo;
      }

      if (actualizacion.grupoEdadId !== undefined) {
        cambios.grupoEdadId = actualizacion.grupoEdadId;
      }

      if (actualizacion.urlAvatar !== undefined) {
        cambios.urlAvatar = actualizacion.urlAvatar;
      }

      if (actualizacion.prefiereAudio !== undefined) {
        cambios.prefiereAudio = actualizacion.prefiereAudio;
      }

      if (actualizacion.tamanoTextoPreferido !== undefined) {
        cambios.tamanoTextoPreferido = actualizacion.tamanoTextoPreferido;
      }

      const [perfil] = await db
        .update(schema.perfil)
        .set(cambios as never)
        .where(eq(schema.perfil.usuarioId, usuarioId))
        .returning();

      return perfil;
    },



    async listarNotificaciones(usuarioId: string, limit = 30) {
      return db
        .select()
        .from(schema.notificacionUsuario)
        .where(eq(schema.notificacionUsuario.usuarioId, usuarioId))
        .orderBy(desc(schema.notificacionUsuario.creadoEn))
        .limit(limit);
    },

    async marcarNotificacionLeida(usuarioId: string, notificacionId: string) {
      const [notificacion] = await db
        .update(schema.notificacionUsuario)
        .set({ leidaEn: new Date() })
        .where(and(
          eq(schema.notificacionUsuario.id, notificacionId),
          eq(schema.notificacionUsuario.usuarioId, usuarioId),
        ))
        .returning();
      return notificacion ?? null;
    },

    async marcarTodasNotificacionesLeidas(usuarioId: string) {
      await db
        .update(schema.notificacionUsuario)
        .set({ leidaEn: new Date() })
        .where(and(
          eq(schema.notificacionUsuario.usuarioId, usuarioId),
          isNull(schema.notificacionUsuario.leidaEn),
        ));
      return { actualizadas: true };
    },

    async eliminarCuenta(usuarioId: string) {
      await db.transaction(async (tx) => {
        await tx.delete(schema.usuarioApp).where(eq(schema.usuarioApp.id, usuarioId));
      });
      return { eliminada: true };
    },

    async vincularCuenta({
      usuarioId,
      idExterno,
      proveedor,
      correo,
      nombreVisible
    }: VincularCuentaInput): Promise<UsuarioVinculadoFila> {
      const [existente] = await db
        .select()
        .from(schema.usuarioApp)
        .where(
          and(
            eq(schema.usuarioApp.proveedor, proveedor),
            eq(schema.usuarioApp.idExterno, idExterno)
          )
        )
        .limit(1);

      if (existente && existente.id !== usuarioId) {
        const correoOculto = existente.correo
          ? existente.correo.replace(/(.{2})(.*)(@.*)/, "$1***$3")
          : null;
        throw new ErrorConflicto(
          correoOculto
            ? `El correo ${correoOculto} ya pertenece a otra cuenta de Semillas. Inicia sesion con esa cuenta para acceder a tu progreso.`
            : "Ya existe una cuenta vinculada a este proveedor. Cierra sesion e inicia sesion con esa cuenta."
        );
      }

      const [usuario] = await db
        .update(schema.usuarioApp)
        .set({
          idExterno,
          proveedor,
          correo,
          nombreVisible,
          actualizadoEn: new Date()
        })
        .where(eq(schema.usuarioApp.id, usuarioId))
        .returning({
          id: schema.usuarioApp.id,
          rol: schema.usuarioApp.rol,
          proveedor: schema.usuarioApp.proveedor,
          nombre_visible: schema.usuarioApp.nombreVisible,
          correo: schema.usuarioApp.correo
        });

      return usuario;
    }
  };
}

export type UsuarioRepository = ReturnType<typeof crearUsuarioRepository>;
