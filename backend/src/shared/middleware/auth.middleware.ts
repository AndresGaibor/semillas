import { createMiddleware } from "hono/factory";
import type { AppBindings } from "../../config/env";
import { createSupabaseAdmin, createSupabaseAuthClient } from "../../db/client";
import { UnauthorizedError } from "../errors/http-error";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const db = createSupabaseAdmin(c.env);
  c.set("db", db);

  const guestUserId = c.req.header("x-guest-user-id");
  const authHeader = c.req.header("authorization");

  if (guestUserId) {
    const { data, error } = await db
      .from("app_user")
      .select("id, role, display_name, email")
      .eq("id", guestUserId)
      .eq("provider", "guest")
      .single();

    if (error || !data) {
      throw new UnauthorizedError("Invitado inválido");
    }

    c.set("user", {
      id: data.id,
      role: data.role,
      displayName: data.display_name,
      email: data.email
    });

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
        : "email";

  const { data: appUser, error: userError } = await db
    .from("app_user")
    .select("id, role, display_name, email")
    .eq("external_id", user.id)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  if (!appUser) {
    const { data: createdUser, error: createError } = await db
      .from("app_user")
      .insert({
        provider,
        external_id: user.id,
        email: user.email ?? null,
        display_name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email ??
          "Semillero",
        role: "user"
      })
      .select("id, role, display_name, email")
      .single();

    if (createError || !createdUser) {
      throw createError;
    }

    await db.from("profile").insert({
      user_id: createdUser.id,
      nickname: createdUser.display_name
    });

    c.set("user", {
      id: createdUser.id,
      role: createdUser.role,
      displayName: createdUser.display_name,
      email: createdUser.email
    });

    await next();
    return;
  }

  c.set("user", {
    id: appUser.id,
    role: appUser.role,
    displayName: appUser.display_name,
    email: appUser.email
  });

  await next();
});
