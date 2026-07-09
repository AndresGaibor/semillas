import { Hono } from "hono";
import type { AppBindings } from "../../config/env";
import { zValidator } from "../../shared/middleware/validate.middleware";
import { createGuestSchema } from "./auth.schemas";
import { responderError, responderExito } from "../../shared/http/respuesta";
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
  if (c.env.APP_ENV !== "development" && c.env.APP_ENV !== "local") {
    return responderError("No disponible fuera de desarrollo", "NO_DISPONIBLE_EN_DESARROLLO", 403);
  }

  const db = c.get("db");
  const adminEmail = "admin@correo.com";
  const adminPassword = "admin";

  const { data: existente } = await db
    .from("usuario_app")
    .select("id, rol, proveedor, nombre_visible, correo")
    .eq("correo", adminEmail)
    .maybeSingle();

  if (existente) {
    let usuarioAdmin = existente;

    if (existente.rol !== "administrador") {
      const { data: actualizado, error: updateError } = await db
        .from("usuario_app")
        .update({ rol: "administrador" })
        .eq("id", existente.id)
        .select("id, rol, proveedor, nombre_visible, correo")
        .single();

      if (updateError || !actualizado) throw updateError;
      usuarioAdmin = actualizado;
    }

    const { data: profile } = await db
      .from("perfil")
      .select("*")
      .eq("usuario_id", usuarioAdmin.id)
      .maybeSingle();

    return responderExito({
      usuario: serializarUsuario(usuarioAdmin),
      ...(profile ? { perfil: serializarPerfil(profile) } : {}),
      credenciales: {
        correo: adminEmail,
        password: adminPassword
      },
      mensaje: "Administrador de desarrollo disponible para iniciar sesión con correo."
    });
  }

  const { data: authUser, error: authError } = await db.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: "Admin Dev"
    },
    app_metadata: {
      role: "administrador"
    }
  });

  if (authError || !authUser.user) {
    throw authError;
  }

  const { data: user, error: userError } = await db
    .from("usuario_app")
    .insert({
      proveedor: "correo",
      rol: "administrador",
      nombre_visible: "Admin Dev",
      correo: adminEmail,
      id_externo: authUser.user.id
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
    credenciales: {
      correo: adminEmail,
      password: adminPassword
    },
    perfil: serializarPerfil(profile),
    mensaje: "Administrador creado. Usa este correo y contraseña para iniciar sesión."
  });
});
