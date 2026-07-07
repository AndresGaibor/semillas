import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { responderExito } from "../../shared/http/respuesta";
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
