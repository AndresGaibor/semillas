import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { createGuestSchema } from "./auth.schemas";
import { responderExito } from "../../shared/http/respuesta";
import { serializarPerfil } from "../../shared/serializers/perfil.serializer";
import { serializarUsuario } from "../../shared/serializers/usuario.serializer";

export const authRoutes = new Hono<AppBindings>();

authRoutes.post("/invitado", zValidator("json", createGuestSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");

  const { data: user, error: userError } = await db
    .from("usuario_app")
    .insert({
      proveedor: "invitado",
      rol: "invitado",
      nombre_visible: body.apodo,
      correo: null
    })
    .select("id, rol, proveedor, nombre_visible, correo")
    .single();

  if (userError || !user) {
    throw userError;
  }

  const { data: profile, error: profileError } = await db
    .from("perfil")
    .insert({
      usuario_id: user.id,
      apodo: body.apodo,
      grupo_edad_id: body.grupo_edad_id ?? null,
      url_avatar: body.url_avatar ?? null
    })
    .select("*")
    .single();

  if (profileError) {
    throw profileError;
  }

  return responderExito(
    {
      usuario: serializarUsuario(user),
      perfil: serializarPerfil(profile),
      autenticacion: {
        tipo: "invitado",
        encabezado: "x-guest-user-id",
        valor: user.id
      }
    },
    201
  );
});

authRoutes.post("/configuracion-dev", async (c) => {
  if (c.env.APP_ENV !== "development") {
    return c.json({ ok: false, error: "No disponible fuera de desarrollo" }, 403);
  }

  const db = c.get("db");

  const { data: user, error: userError } = await db
    .from("usuario_app")
    .insert({
      proveedor: "invitado",
      rol: "administrador",
      nombre_visible: "Admin Dev",
      correo: null
    })
    .select("id, rol, proveedor, nombre_visible, correo")
    .single();

  if (userError || !user) throw userError;

  const { data: profile, error: profileError } = await db
    .from("perfil")
    .insert({
      usuario_id: user.id,
      apodo: "Admin Dev"
    })
    .select("*")
    .single();

  if (profileError) throw profileError;

  return responderExito({
    usuario: serializarUsuario(user),
    perfil: serializarPerfil(profile),
    mensaje: "Administrador creado. Copia este ID en localStorage:",
    localStorage: `localStorage.setItem("semillas_guest_user_id", "${user.id}")`
  });
});
