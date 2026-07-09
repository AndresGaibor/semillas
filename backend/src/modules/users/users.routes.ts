import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderError, responderExito } from "../../shared/http/respuesta";
import { serializarPerfil } from "../../shared/serializers/perfil.serializer";
import { serializarUsuario } from "../../shared/serializers/usuario.serializer";
import { updateProfileSchema } from "./users.schemas";

export const usersRoutes = new Hono<AppBindings>();

usersRoutes.use("*", authMiddleware);

usersRoutes.get("/", async (c) => {
  const db = c.get("db");
  const user = c.get("user");

  const { data: profile, error } = await db
    .from("perfil")
    .select(
      `
      *,
      age_group:grupo_edad_id(
        id,
        codigo,
        nombre,
        edad_minima,
        edad_maxima
      )
    `
    )
    .eq("usuario_id", user.id)
    .single();

  if (error) throw error;

  return responderExito({
    usuario: serializarUsuario({
      id: user.id,
      rol: user.role,
      proveedor: user.provider,
      nombre_visible: user.displayName,
      correo: user.email
    }),
    perfil: profile ? serializarPerfil(profile) : null
  });
});

usersRoutes.patch(
  "/actualizar",
  zValidator("json", updateProfileSchema),
  async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const body = c.req.valid("json");

    const { data, error } = await db
      .from("perfil")
      .update({
        apodo: body.apodo,
        grupo_edad_id: body.grupo_edad_id,
        url_avatar: body.url_avatar,
        prefiere_audio: body.prefiere_audio,
        tamano_texto_preferido: body.tamano_texto_preferido,
        actualizado_en: new Date().toISOString()
      })
      .eq("usuario_id", user.id)
      .select("*")
      .single();

    if (error) throw error;

    return responderExito(serializarPerfil(data));
  }
);

usersRoutes.post("/vincular-cuenta", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const authSessionUser = c.get("authSessionUser");

  if (user.provider !== "invitado") {
    return responderError("Solo las cuentas invitadas pueden reclamar una cuenta vinculada", "CUENTA_NO_INVITADA", 400);
  }

  if (!authSessionUser) {
    return responderError("Falta la sesión autenticada para vincular la cuenta", "SIN_SESION_AUTENTICADA", 401);
  }

  const { data: updatedUser, error: updateError } = await db
    .from("usuario_app")
    .update({
      id_externo: authSessionUser.id,
      proveedor: authSessionUser.provider,
      correo: authSessionUser.email ?? user.email,
      actualizado_en: new Date().toISOString()
    })
    .eq("id", user.id)
    .select("id, rol, proveedor, nombre_visible, correo")
    .single();

  if (updateError || !updatedUser) {
    throw updateError;
  }

  const { data: profile, error: profileError } = await db
    .from("perfil")
    .select("*")
    .eq("usuario_id", user.id)
    .single();

  if (profileError || !profile) {
    throw profileError;
  }

  return responderExito({
    vinculada: true,
    usuario: serializarUsuario(updatedUser),
    perfil: serializarPerfil(profile)
  });
});
