import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";

export type UserRole = "administrador" | "usuario" | "invitado" | "padre";

export type AuthUser = {
  id: string;
  role: UserRole;
  displayName: string;
  email: string | null;
  provider: string;
};

export type AuthSessionUser = {
  id: string;
  displayName: string;
  email: string | null;
  provider: string;
};

export type Env = {
  APP_ENV: string;
  CORS_ORIGIN: string;

  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_PROJECT_REF?: string;
};

export type Variables = {
  db: SupabaseClient<Database>;
  user: AuthUser;
  authSessionUser?: AuthSessionUser;
  guestUserId?: string | null;
};

export type AppBindings = {
  Bindings: Env;
  Variables: Variables;
};
