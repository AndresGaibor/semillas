import { createMiddleware } from "hono/factory";
import type { AppBindings, AuthSessionUser } from "../../config/env";
import { createSupabaseAdmin, createSupabaseAuthClient } from "../../db/client";
import { UnauthorizedError } from "../errors/http-error";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const db = createSupabaseAdmin(c.env);
  c.set("db", db);

  const guestUserId = c.req.header("x-guest-user-id");
  const authHeader = c.req.header("authorization");
  c.set("guestUserId", guestUserId ?? null);

  if (guestUserId) {
    const authUser: AuthSessionUser | null = authHeader?.startsWith("Bearer ")
      ? await (async () => {
          const token = authHeader.replace("Bearer ", "").trim();
          const authClient = createSupabaseAuthClient(c.env, token);

          const {
            data: { user },
            error
          } = await authClient.auth.getUser();

          if (error || !user) {
            throw new UnauthorizedError("Token inválido");
          }

          return {
            id: user.id,
            role: "usuario" as const,
            displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Semillero",
            email: user.email ?? null,
            provider:
              user.app_metadata?.provider === "facebook"
                ? "facebook"
                : user.app_metadata?.provider === "google"
                  ? "google"
                  : "correo"
          };
        })()
      : null;

    const { data, error } = await db
      .from("usuario_app")
      .select("id, rol, proveedor, nombre_visible, correo")
      .eq("id", guestUserId)
      .eq("proveedor", "invitado")
      .single();

    if (error || !data) {
      throw new UnauthorizedError("Invitado inválido");
    }

    c.set("user", {
      id: data.id,
      role: data.rol,
      displayName: data.nombre_visible,
      email: data.correo,
      provider: data.proveedor
    });

    if (authUser) {
      c.set("authSessionUser", authUser);
    }

    await next();
    return;
  }

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Falta token de autenticación");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const authClient = createSupabaseAuthClient(c.env, token);

  const {
    data: { user },
    error
  } = await authClient.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError("Token inválido");
  }

  const provider =
    user.app_metadata?.provider === "facebook"
      ? "facebook"
      : user.app_metadata?.provider === "google"
        ? "google"
        : "correo";

  const { data: appUser, error: userError } = await db
    .from("usuario_app")
    .select("id, rol, proveedor, nombre_visible, correo")
    .eq("id_externo", user.id)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  if (!appUser) {
    const { data: createdUser, error: createError } = await db
      .from("usuario_app")
      .insert({
        proveedor: provider,
        id_externo: user.id,
        correo: user.email ?? null,
        nombre_visible:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email ??
          "Semillero",
        rol: "usuario"
      })
      .select("id, rol, nombre_visible, correo")
      .single();

    if (createError || !createdUser) {
      throw createError;
    }

    await db.from("perfil").insert({
      usuario_id: createdUser.id,
      apodo: createdUser.nombre_visible
    });

  c.set("user", {
    id: createdUser.id,
    role: createdUser.rol,
    displayName: createdUser.nombre_visible,
    email: createdUser.correo,
    provider
  });

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

  c.set("authSessionUser", {
    id: user.id,
    displayName:
      user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? appUser.nombre_visible,
    email: user.email ?? null,
    provider
  });

  await next();
});
