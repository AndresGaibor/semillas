import { createMiddleware } from "hono/factory";
import type { AppBindings, AuthSessionUser } from "../../config/env";
import { createSupabaseAdmin, createSupabaseAuthClient } from "../../db/client";
import { verificarTokenInvitado } from "../security/guest-token";
import { UnauthorizedError } from "../errors/http-error";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const db = c.get("db") ?? createSupabaseAdmin(c.env);
  c.set("db", db);

  const guestUserId = c.req.header("x-guest-user-id");
  const guestToken = c.req.header("x-guest-token");
  const authHeader = c.req.header("authorization");
  c.set("guestUserId", guestUserId ?? null);

  if (guestUserId || guestToken) {
    if (!guestUserId || !guestToken) {
      throw new UnauthorizedError("La sesión invitada está incompleta");
    }

    const authUser: AuthSessionUser | null = authHeader?.startsWith("Bearer ")
      ? await obtenerUsuarioSupabase(c.env, authHeader)
      : null;

    const { data, error } = await db
      .from("usuario_app")
      .select("id, rol, proveedor, nombre_visible, correo, activo, token_invitado_hash")
      .eq("id", guestUserId)
      .eq("proveedor", "invitado")
      .single();

    if (
      error ||
      !data ||
      !data.activo ||
      !data.token_invitado_hash ||
      !(await verificarTokenInvitado(guestToken, data.token_invitado_hash))
    ) {
      throw new UnauthorizedError("Credenciales de invitado inválidas");
    }

    c.set("user", {
      id: data.id,
      role: data.rol,
      displayName: data.nombre_visible,
      email: data.correo,
      provider: data.proveedor
    });

    if (authUser) c.set("authSessionUser", authUser);
    await next();
    return;
  }

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Falta token de autenticación");
  }

  const usuarioSupabase = await obtenerUsuarioSupabase(c.env, authHeader);
  const { data: appUser, error: userError } = await db
    .from("usuario_app")
    .select("id, rol, proveedor, nombre_visible, correo")
    .eq("id_externo", usuarioSupabase.id)
    .maybeSingle();

  if (userError) throw userError;

  if (!appUser) {
    const { data: createdUser, error: createError } = await db
      .from("usuario_app")
      .insert({
        proveedor: usuarioSupabase.provider,
        id_externo: usuarioSupabase.id,
        correo: usuarioSupabase.email,
        nombre_visible: usuarioSupabase.displayName,
        rol: "usuario"
      })
      .select("id, rol, nombre_visible, correo")
      .single();

    if (createError || !createdUser) throw createError;

    const { error: profileError } = await db.from("perfil").insert({
      usuario_id: createdUser.id,
      apodo: createdUser.nombre_visible
    });
    if (profileError) {
      await db.from("usuario_app").delete().eq("id", createdUser.id);
      throw profileError;
    }

    c.set("user", {
      id: createdUser.id,
      role: createdUser.rol,
      displayName: createdUser.nombre_visible,
      email: createdUser.correo,
      provider: usuarioSupabase.provider
    });
    c.set("authSessionUser", usuarioSupabase);
    await next();
    return;
  }

  c.set("user", {
    id: appUser.id,
    role: appUser.rol,
    displayName: appUser.nombre_visible,
    email: appUser.correo,
    provider: appUser.proveedor
  });
  c.set("authSessionUser", usuarioSupabase);
  await next();
});

async function obtenerUsuarioSupabase(
  env: AppBindings["Bindings"],
  authHeader: string
): Promise<AuthSessionUser> {
  const token = authHeader.replace("Bearer ", "").trim();
  const authClient = createSupabaseAuthClient(env, token);
  const { data: { user }, error } = await authClient.auth.getUser();

  if (error || !user) throw new UnauthorizedError("Token inválido");

  return {
    id: user.id,
    displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Semillero",
    email: user.email ?? null,
    provider:
      user.app_metadata?.provider === "facebook"
        ? "facebook"
        : user.app_metadata?.provider === "google"
          ? "google"
          : "correo"
  };
}
