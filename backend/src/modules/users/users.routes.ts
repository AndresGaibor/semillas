import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { serializarPerfil } from "../../shared/serializers/perfil.serializer";
import { serializarUsuario } from "../../shared/serializers/usuario.serializer";
import { updateProfileSchema } from "./users.schemas";
import { db, schema } from "../../db/client";

export const usersRoutes = new Hono<AppBindings>();

usersRoutes.use("*", authMiddleware);

usersRoutes.get("/", async (c) => {
  const user = c.get("user");

  // Drizzle reemplaza la consulta Supabase sin cambiar la forma de la respuesta.
  const [profile] = await db
    .select()
    .from(schema.perfil)
    .where(eq(schema.perfil.usuarioId, user.id))
    .limit(1);

  return responderExito({
    usuario: serializarUsuario({
      id: user.id,
      rol: user.role,
      proveedor: user.provider,
      nombre_visible: user.displayName,
      correo: user.email
    }),
    perfil: profile
      ? serializarPerfil({
          id: profile.id,
          usuario_id: profile.usuarioId,
          apodo: profile.apodo,
          grupo_edad_id: profile.grupoEdadId,
          url_avatar: profile.urlAvatar,
          clave_avatar: profile.claveAvatar,
          prefiere_audio: profile.prefiereAudio,
          tamano_texto_preferido: profile.tamanoTextoPreferido
        })
      : null
  });
});

usersRoutes.patch(
  "/actualizar",
  zValidator("json", updateProfileSchema),
  async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    const [data] = await db
      .update(schema.perfil)
      .set({
        apodo: body.apodo,
        grupoEdadId: body.grupo_edad_id,
        urlAvatar: body.url_avatar,
        prefiereAudio: body.prefiere_audio,
        tamanoTextoPreferido: body.tamano_texto_preferido,
        actualizadoEn: new Date()
      })
      .where(eq(schema.perfil.usuarioId, user.id))
      .returning();

    return responderExito(
      serializarPerfil({
        id: data.id,
        usuario_id: data.usuarioId,
        apodo: data.apodo,
        grupo_edad_id: data.grupoEdadId,
        url_avatar: data.urlAvatar,
        clave_avatar: data.claveAvatar,
        prefiere_audio: data.prefiereAudio,
        tamano_texto_preferido: data.tamanoTextoPreferido
      })
    );
  }
);

usersRoutes.post("/vincular-cuenta", async (c) => {
  const user = c.get("user");
  const authSessionUser = c.get("authSessionUser");

  if (user.provider !== "invitado") {
    return responderError("Solo las cuentas invitadas pueden reclamar una cuenta vinculada", "CUENTA_NO_INVITADA", 400);
  }

  if (!authSessionUser) {
    return responderError("Falta la sesión autenticada para vincular la cuenta", "SIN_SESION_AUTENTICADA", 401);
  }

  const [updatedUser] = await db
    .update(schema.usuarioApp)
    .set({
      idExterno: authSessionUser.id,
      proveedor: authSessionUser.provider,
      correo: authSessionUser.email ?? user.email,
      actualizadoEn: new Date()
    })
    .where(eq(schema.usuarioApp.id, user.id))
    .returning({
      id: schema.usuarioApp.id,
      rol: schema.usuarioApp.rol,
      proveedor: schema.usuarioApp.proveedor,
      nombre_visible: schema.usuarioApp.nombreVisible,
      correo: schema.usuarioApp.correo
    });

  const [profile] = await db
    .select()
    .from(schema.perfil)
    .where(eq(schema.perfil.usuarioId, user.id))
    .limit(1);

  return responderExito({
    vinculada: true,
    usuario: serializarUsuario(updatedUser),
    perfil: serializarPerfil({
      id: profile.id,
      usuario_id: profile.usuarioId,
      apodo: profile.apodo,
      grupo_edad_id: profile.grupoEdadId,
      url_avatar: profile.urlAvatar,
      clave_avatar: profile.claveAvatar,
      prefiere_audio: profile.prefiereAudio,
      tamano_texto_preferido: profile.tamanoTextoPreferido
    })
  });
});
