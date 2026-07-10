import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/client";
import { schema } from "../../db/client";

type PerfilFila = typeof schema.perfil.$inferSelect;
type UsuarioFila = typeof schema.usuarioApp.$inferSelect;

type PerfilActualizacion = {
  apodo?: string | null;
  grupoEdadId?: string | null;
  urlAvatar?: string | null;
  prefiereAudio?: boolean | null;
  tamanoTextoPreferido?: "small" | "medium" | "large" | null;
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

    async vincularCuenta({
      usuarioId,
      idExterno,
      proveedor,
      correo,
      nombreVisible
    }: VincularCuentaInput): Promise<UsuarioVinculadoFila> {
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
